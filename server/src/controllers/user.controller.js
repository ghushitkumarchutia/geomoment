const Moment = require('../models/Moment');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');
const { PAGINATION } = require('../config/constants');

const getMyMoments = asyncHandler(async (req, res) => {
  const page = req.query.page || PAGINATION.DEFAULT_PAGE;
  const limit = req.query.limit || PAGINATION.DEFAULT_LIMIT;
  const skip = (page - 1) * limit;

  const [moments, total] = await Promise.all([
    Moment.find({ userId: req.user._id }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Moment.countDocuments({ userId: req.user._id }),
  ]);

  return success(res, {
    moments,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

const getProfile = asyncHandler(async (req, res) => {
  return success(res, {
    name: req.user.name,
    email: req.user.email,
    momentCount: req.user.momentCount,
    createdAt: req.user.createdAt,
  });
});

module.exports = { getMyMoments, getProfile };
