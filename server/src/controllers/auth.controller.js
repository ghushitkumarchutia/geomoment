const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { success, error } = require('../utils/apiResponse');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY || '7d',
  });
};

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return error(res, 'Email already registered', 409);
  }

  const user = await User.create({ name, email, password });
  const accessToken = generateToken(user._id);

  return success(
    res,
    {
      user: { id: user._id, name: user.name, email: user.email },
      accessToken,
    },
    201
  );
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return error(res, 'Invalid credentials', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return error(res, 'Invalid credentials', 401);
  }

  const accessToken = generateToken(user._id);

  return success(res, {
    user: { id: user._id, name: user.name, email: user.email },
    accessToken,
  });
});

module.exports = { register, login };
