const Moment = require('../models/Moment');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');
const { encodeCell } = require('../utils/geohash');
const { TAG_TYPES } = require('../config/constants');

const getRouteVibeScore = asyncHandler(async (req, res) => {
  const { points, day, hour } = req.body;

  const pointHashes = points.map((p) => ({
    lat: p.lat,
    lng: p.lng,
    hash: encodeCell(p.lat, p.lng),
  }));

  const uniqueHashes = [...new Set(pointHashes.map((p) => p.hash))];

  const tagAccumulators = {};
  TAG_TYPES.forEach((tag) => {
    tagAccumulators[tag] = {
      $sum: { $cond: [{ $eq: ['$tag', tag] }, 1, 0] },
    };
  });

  const results = await Moment.aggregate([
    {
      $match: {
        geohashCell: { $in: uniqueHashes },
        $and: [
          { $or: [{ dayOfWeek: day }, { dayOfWeek: -1 }] },
          { $or: [{ hourSlot: hour }, { hourSlot: -1 }] },
        ],
      },
    },
    {
      $group: {
        _id: '$geohashCell',
        totalCount: { $sum: 1 },
        ...tagAccumulators,
      },
    },
  ]);

  const cellScoreMap = {};
  results.forEach((cell) => {
    const tagCounts = {};
    TAG_TYPES.forEach((tag) => {
      tagCounts[tag] = cell[tag];
    });

    const dominantTag = Object.entries(tagCounts).reduce((a, b) => (a[1] >= b[1] ? a : b))[0];

    cellScoreMap[cell._id] = {
      dominantTag,
      score: Math.round((tagCounts[dominantTag] / cell.totalCount) * 100) / 100,
      totalCount: cell.totalCount,
    };
  });

  const segments = pointHashes.map((p) => {
    const cellData = cellScoreMap[p.hash];
    return {
      lat: p.lat,
      lng: p.lng,
      geohashCell: p.hash,
      dominantTag: cellData ? cellData.dominantTag : null,
      score: cellData ? cellData.score : null,
      totalCount: cellData ? cellData.totalCount : 0,
    };
  });

  const scoredSegments = segments.filter((s) => s.score !== null);

  const overallScore =
    scoredSegments.length > 0
      ? Math.round(
          (scoredSegments.reduce((sum, s) => sum + s.score, 0) / scoredSegments.length) * 100
        ) / 100
      : null;

  const overallTagTotals = {};
  TAG_TYPES.forEach((tag) => {
    overallTagTotals[tag] = 0;
  });
  results.forEach((cell) => {
    TAG_TYPES.forEach((tag) => {
      overallTagTotals[tag] += cell[tag];
    });
  });

  const overallDominantEntry = Object.entries(overallTagTotals).reduce((a, b) =>
    a[1] >= b[1] ? a : b
  );

  return success(res, {
    overallScore,
    overallDominantTag: overallDominantEntry[1] > 0 ? overallDominantEntry[0] : null,
    coverage: `${scoredSegments.length}/${segments.length}`,
    segments,
  });
});

module.exports = { getRouteVibeScore };
