const { body } = require('express-validator');
const { ROUTE_POINTS_MAX } = require('../config/constants');

const routeScoreRules = [
  body('points')
    .isArray({ min: 2, max: ROUTE_POINTS_MAX })
    .withMessage(`Points must be an array of 2 to ${ROUTE_POINTS_MAX} items`),
  body('points.*.lat')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Each point lat must be between -90 and 90')
    .toFloat(),
  body('points.*.lng')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Each point lng must be between -180 and 180')
    .toFloat(),
  body('day').isInt({ min: 0, max: 6 }).withMessage('day must be 0-6').toInt(),
  body('hour').isInt({ min: 0, max: 23 }).withMessage('hour must be 0-23').toInt(),
];

module.exports = { routeScoreRules };
