const express = require('express');
const { getRouteVibeScore } = require('../controllers/route.controller');
const { routeScoreRules } = require('../validators/route.validators');
const validate = require('../middleware/validate.middleware');
const { routeScoreLimiter } = require('../middleware/rateLimit.middleware');

const router = express.Router();

router.post('/score', routeScoreLimiter, routeScoreRules, validate, getRouteVibeScore);

module.exports = router;
