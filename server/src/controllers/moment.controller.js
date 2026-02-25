const Moment = require('../models/Moment');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { success, error } = require('../utils/apiResponse');
const { encodeCell, getCellCenter } = require('../utils/geohash');
const { isWithinMaxArea } = require('../utils/boundsValidator');
const { TAG_TYPES, MIN_TAGS_PER_CELL, BOUNDS_DEFAULT_LIMIT } = require('../config/constants');

const buildGeoPolygon = (swLat, swLng, neLat, neLng) => ({
  type: 'Polygon',
  coordinates: [
    [
      [parseFloat(swLng), parseFloat(swLat)],
      [parseFloat(neLng), parseFloat(swLat)],
      [parseFloat(neLng), parseFloat(neLat)],
      [parseFloat(swLng), parseFloat(neLat)],
      [parseFloat(swLng), parseFloat(swLat)],
    ],
  ],
});

const SLOT_RANGES = [
  { start: 6, end: 12 },
  { start: 12, end: 18 },
  { start: 18, end: 22 },
  { start: 22, end: 6, wrap: true },
];

const getSlotHours = (hour) => {
  for (const range of SLOT_RANGES) {
    if (range.wrap) {
      if (hour >= range.start || hour < range.end) {
        const hours = [];
        for (let h = range.start; h < 24; h++) hours.push(h);
        for (let h = 0; h < range.end; h++) hours.push(h);
        return hours;
      }
    } else if (hour >= range.start && hour < range.end) {
      const hours = [];
      for (let h = range.start; h < range.end; h++) hours.push(h);
      return hours;
    }
  }
  return [hour];
};

const submitMoment = asyncHandler(async (req, res) => {
  const { lat, lng, tag, note, dayOfWeek, hourSlot } = req.body;

  const geohashCell = encodeCell(lat, lng);

  const moment = await Moment.create({
    location: {
      type: 'Point',
      coordinates: [lng, lat],
    },
    tag,
    dayOfWeek,
    hourSlot,
    geohashCell,
    note: note || '',
    userId: req.user._id,
  });

  await User.findByIdAndUpdate(req.user._id, { $inc: { momentCount: 1 } });

  return success(res, moment, 201);
});

const getHeatmap = asyncHandler(async (req, res) => {
  const swLat = parseFloat(req.query.swLat);
  const swLng = parseFloat(req.query.swLng);
  const neLat = parseFloat(req.query.neLat);
  const neLng = parseFloat(req.query.neLng);
  const day = parseInt(req.query.day, 10);
  const hour = parseInt(req.query.hour, 10);

  if (!isWithinMaxArea(swLat, swLng, neLat, neLng)) {
    return error(res, 'Bounding box too large. Maximum area is 50km × 50km.', 400);
  }

  const tagAccumulators = {};
  TAG_TYPES.forEach((tag) => {
    tagAccumulators[tag] = {
      $sum: { $cond: [{ $eq: ['$tag', tag] }, 1, 0] },
    };
  });

  const matchStage = {
    location: {
      $geoWithin: {
        $geometry: buildGeoPolygon(swLat, swLng, neLat, neLng),
      },
    },
  };

  const conditions = [];

  if (day !== -1) conditions.push({ $or: [{ dayOfWeek: day }, { dayOfWeek: -1 }] });
  if (hour !== -1) {
    conditions.push({ $or: [{ hourSlot: { $in: getSlotHours(hour) } }, { hourSlot: -1 }] });
  }

  if (conditions.length > 0) matchStage.$and = conditions;

  const results = await Moment.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$geohashCell',
        totalCount: { $sum: 1 },
        ...tagAccumulators,
      },
    },
    {
      $match: {
        totalCount: { $gte: MIN_TAGS_PER_CELL },
      },
    },
  ]);

  const cells = results.map((cell) => {
    const tagCounts = {};
    TAG_TYPES.forEach((tag) => {
      tagCounts[tag] = cell[tag];
    });

    const dominantTag = Object.entries(tagCounts).reduce((a, b) => (a[1] >= b[1] ? a : b))[0];

    const center = getCellCenter(cell._id);

    return {
      geohashCell: cell._id,
      centerLat: center.lat,
      centerLng: center.lng,
      dominantTag,
      score: Math.round((tagCounts[dominantTag] / cell.totalCount) * 100) / 100,
      totalCount: cell.totalCount,
    };
  });

  return success(res, cells);
});

const getMomentsInBounds = asyncHandler(async (req, res) => {
  const swLat = parseFloat(req.query.swLat);
  const swLng = parseFloat(req.query.swLng);
  const neLat = parseFloat(req.query.neLat);
  const neLng = parseFloat(req.query.neLng);
  const limit = parseInt(req.query.limit, 10) || BOUNDS_DEFAULT_LIMIT;

  const moments = await Moment.find({
    location: {
      $geoWithin: {
        $geometry: buildGeoPolygon(swLat, swLng, neLat, neLng),
      },
    },
  })
    .select('tag note dayOfWeek hourSlot location createdAt')
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  const formatted = moments.map((m) => ({
    _id: m._id,
    tag: m.tag,
    note: m.note,
    dayOfWeek: m.dayOfWeek,
    hourSlot: m.hourSlot,
    lat: m.location.coordinates[1],
    lng: m.location.coordinates[0],
    createdAt: m.createdAt,
  }));

  return success(res, formatted);
});

const deleteMoment = asyncHandler(async (req, res) => {
  const moment = await Moment.findById(req.params.id);

  if (!moment) {
    return error(res, 'Moment not found', 404);
  }

  if (moment.userId.toString() !== req.user._id.toString()) {
    return error(res, 'Not authorized to delete this moment', 403);
  }

  await moment.deleteOne();

  await User.findByIdAndUpdate(req.user._id, [
    { $set: { momentCount: { $max: [{ $subtract: ['$momentCount', 1] }, 0] } } },
  ]);

  return success(res, null);
});

const updateMoment = asyncHandler(async (req, res) => {
  const moment = await Moment.findById(req.params.id);

  if (!moment) {
    return error(res, 'Moment not found', 404);
  }

  if (moment.userId.toString() !== req.user._id.toString()) {
    return error(res, 'Not authorized to update this moment', 403);
  }

  moment.note = req.body.note;
  await moment.save();

  return success(res, moment);
});

module.exports = {
  submitMoment,
  getHeatmap,
  getMomentsInBounds,
  deleteMoment,
  updateMoment,
};
