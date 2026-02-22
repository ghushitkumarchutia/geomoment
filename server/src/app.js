const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler.middleware');
const { generalLimiter } = require('./middleware/rateLimit.middleware');
const authRoutes = require('./routes/auth.routes');
const momentRoutes = require('./routes/moment.routes');
const userRoutes = require('./routes/user.routes');
const routeRoutes = require('./routes/route.routes');

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: [process.env.FRONTEND_URL, 'http://localhost:5173'].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

app.use(compression());

const morganStream = {
  write: (message) => logger.info(message.trim()),
};

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined', { stream: morganStream }));
} else {
  app.use(morgan('dev'));
}

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.use('/api', generalLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/moments', momentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/route', routeRoutes);

app.use(errorHandler);

module.exports = app;
