const express = require('express');
const { getMyMoments, getProfile } = require('../controllers/user.controller');
const { myMomentsQueryRules } = require('../validators/user.validators');
const validate = require('../middleware/validate.middleware');
const verifyToken = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/me/moments', verifyToken, myMomentsQueryRules, validate, getMyMoments);
router.get('/me/profile', verifyToken, getProfile);

module.exports = router;
