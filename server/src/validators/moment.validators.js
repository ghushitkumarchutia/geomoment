const { body, query } = require('express-validator');
const { TAG_TYPES, NOTE_MAX_LENGTH, BOUNDS_MAX_LIMIT } = require('../config/constants');

const submitMomentRules = [
  body('lat')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90')
    .toFloat(),
  body('lng')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180')
    .toFloat(),
  body('tag')
    .isIn(TAG_TYPES)
    .withMessage(`Tag must be one of: ${TAG_TYPES.join(', ')}`),
  body('note')
    .optional()
    .trim()
    .isLength({ max: NOTE_MAX_LENGTH })
    .withMessage(`Note cannot exceed ${NOTE_MAX_LENGTH} characters`),
  body('dayOfWeek').isInt({ min: -1, max: 6 }).withMessage('dayOfWeek must be -1 to 6').toInt(),
  body('hourSlot').isInt({ min: -1, max: 23 }).withMessage('hourSlot must be -1 to 23').toInt(),
];

const heatmapQueryRules = [
  query('swLat')
    .isFloat({ min: -90, max: 90 })
    .withMessage('swLat must be between -90 and 90')
    .toFloat(),
  query('swLng')
    .isFloat({ min: -180, max: 180 })
    .withMessage('swLng must be between -180 and 180')
    .toFloat(),
  query('neLat')
    .isFloat({ min: -90, max: 90 })
    .withMessage('neLat must be between -90 and 90')
    .toFloat(),
  query('neLng')
    .isFloat({ min: -180, max: 180 })
    .withMessage('neLng must be between -180 and 180')
    .toFloat(),
  query('day').isInt({ min: -1, max: 6 }).withMessage('day must be -1 to 6').toInt(),
  query('hour').isInt({ min: -1, max: 23 }).withMessage('hour must be -1 to 23').toInt(),
];

const boundsQueryRules = [
  query('swLat')
    .isFloat({ min: -90, max: 90 })
    .withMessage('swLat must be between -90 and 90')
    .toFloat(),
  query('swLng')
    .isFloat({ min: -180, max: 180 })
    .withMessage('swLng must be between -180 and 180')
    .toFloat(),
  query('neLat')
    .isFloat({ min: -90, max: 90 })
    .withMessage('neLat must be between -90 and 90')
    .toFloat(),
  query('neLng')
    .isFloat({ min: -180, max: 180 })
    .withMessage('neLng must be between -180 and 180')
    .toFloat(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: BOUNDS_MAX_LIMIT })
    .withMessage(`limit must be between 1 and ${BOUNDS_MAX_LIMIT}`)
    .toInt(),
];

const updateMomentRules = [
  body('note')
    .isString()
    .withMessage('Note must be a string')
    .trim()
    .isLength({ max: NOTE_MAX_LENGTH })
    .withMessage(`Note cannot exceed ${NOTE_MAX_LENGTH} characters`),
];

module.exports = {
  submitMomentRules,
  heatmapQueryRules,
  boundsQueryRules,
  updateMomentRules,
};
