const TAG_TYPES = ['safe', 'unsafe', 'lively', 'calm', 'crowded', 'deserted'];

const GEOHASH_PRECISION = 7;

const MAX_BOUNDS_AREA_KM2 = 2500;

const BCRYPT_SALT_ROUNDS = 12;

const MIN_TAGS_PER_CELL = 1;

const NOTE_MAX_LENGTH = 80;

const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 50;

const PASSWORD_MIN_LENGTH = 8;

const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

const BOUNDS_MAX_LIMIT = 100;
const BOUNDS_DEFAULT_LIMIT = 50;

const ROUTE_POINTS_MAX = 100;

const RATE_LIMITS = {
  general: { windowMs: 15 * 60 * 1000, max: 100 },
  auth: { windowMs: 15 * 60 * 1000, max: 5 },
  momentSubmit: { windowMs: 60 * 60 * 1000, max: 10 },
  heatmap: { windowMs: 60 * 1000, max: 30 },
  routeScore: { windowMs: 15 * 60 * 1000, max: 20 },
};

module.exports = {
  TAG_TYPES,
  GEOHASH_PRECISION,
  MAX_BOUNDS_AREA_KM2,
  BCRYPT_SALT_ROUNDS,
  MIN_TAGS_PER_CELL,
  NOTE_MAX_LENGTH,
  NAME_MIN_LENGTH,
  NAME_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PAGINATION,
  BOUNDS_MAX_LIMIT,
  BOUNDS_DEFAULT_LIMIT,
  ROUTE_POINTS_MAX,
  RATE_LIMITS,
};
