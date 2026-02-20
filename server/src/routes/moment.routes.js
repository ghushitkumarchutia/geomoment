const express = require('express');
const {
  getHeatmap,
  getMomentsInBounds,
  submitMoment,
  deleteMoment,
  updateMoment,
} = require('../controllers/moment.controller');
const {
  heatmapQueryRules,
  boundsQueryRules,
  submitMomentRules,
  updateMomentRules,
} = require('../validators/moment.validators');
const validate = require('../middleware/validate.middleware');
const verifyToken = require('../middleware/auth.middleware');
const { heatmapLimiter, momentSubmitLimiter } = require('../middleware/rateLimit.middleware');

const router = express.Router();

router.get('/heatmap', heatmapLimiter, heatmapQueryRules, validate, getHeatmap);
router.get('/bounds', boundsQueryRules, validate, getMomentsInBounds);
router.post('/', verifyToken, momentSubmitLimiter, submitMomentRules, validate, submitMoment);
router.delete('/:id', verifyToken, deleteMoment);
router.patch('/:id', verifyToken, updateMomentRules, validate, updateMoment);

module.exports = router;
