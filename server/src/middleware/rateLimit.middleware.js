const { rateLimit } = require('express-rate-limit');
const { RATE_LIMITS } = require('../config/constants');

const createLimiter = (config) =>
  rateLimit({
    windowMs: config.windowMs,
    max: config.max,
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => process.env.NODE_ENV === 'test',
    message: {
      success: false,
      message: 'Too many requests. Please try again later.',
    },
  });

const generalLimiter = createLimiter(RATE_LIMITS.general);
const authLimiter = createLimiter(RATE_LIMITS.auth);
const momentSubmitLimiter = createLimiter(RATE_LIMITS.momentSubmit);
const heatmapLimiter = createLimiter(RATE_LIMITS.heatmap);
const routeScoreLimiter = createLimiter(RATE_LIMITS.routeScore);

module.exports = {
  generalLimiter,
  authLimiter,
  momentSubmitLimiter,
  heatmapLimiter,
  routeScoreLimiter,
};
