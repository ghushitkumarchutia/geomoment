const express = require('express');
const { register, login } = require('../controllers/auth.controller');
const { registerRules, loginRules } = require('../validators/auth.validators');
const validate = require('../middleware/validate.middleware');
const { authLimiter } = require('../middleware/rateLimit.middleware');

const router = express.Router();

router.post('/register', authLimiter, registerRules, validate, register);
router.post('/login', authLimiter, loginRules, validate, login);

module.exports = router;
