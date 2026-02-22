const { query } = require('express-validator');
const { PAGINATION } = require('../config/constants');

const myMomentsQueryRules = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer').toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: PAGINATION.MAX_LIMIT })
    .withMessage(`Limit must be between 1 and ${PAGINATION.MAX_LIMIT}`)
    .toInt(),
];

module.exports = { myMomentsQueryRules };
