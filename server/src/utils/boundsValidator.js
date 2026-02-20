const { MAX_BOUNDS_AREA_KM2 } = require('../config/constants');

const EARTH_RADIUS_KM = 6371;

const toRad = (deg) => (deg * Math.PI) / 180;

const haversineDistance = (lat1, lng1, lat2, lng2) => {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const isWithinMaxArea = (swLat, swLng, neLat, neLng) => {
  const width = haversineDistance(swLat, swLng, swLat, neLng);
  const height = haversineDistance(swLat, swLng, neLat, swLng);
  return width * height <= MAX_BOUNDS_AREA_KM2;
};

module.exports = { isWithinMaxArea };
