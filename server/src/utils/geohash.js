const ngeohash = require('ngeohash');
const { GEOHASH_PRECISION } = require('../config/constants');

const encodeCell = (lat, lng) => {
  return ngeohash.encode(lat, lng, GEOHASH_PRECISION);
};

const getCellCenter = (hash) => {
  const { latitude, longitude } = ngeohash.decode(hash);
  return { lat: latitude, lng: longitude };
};

const decodeBbox = (hash) => {
  const [minlat, minlng, maxlat, maxlng] = ngeohash.decode_bbox(hash);
  return { minlat, minlng, maxlat, maxlng };
};

module.exports = { encodeCell, getCellCenter, decodeBbox };
