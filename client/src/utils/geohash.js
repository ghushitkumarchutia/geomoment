import ngeohash from 'ngeohash';

const PRECISION = 7;

export const encodeCell = (lat, lng) => ngeohash.encode(lat, lng, PRECISION);

export const cellToPolygon = (hash) => {
  const [minlat, minlng, maxlat, maxlng] = ngeohash.decode_bbox(hash);
  return [
    [minlng, minlat],
    [maxlng, minlat],
    [maxlng, maxlat],
    [minlng, maxlat],
    [minlng, minlat],
  ];
};

export const getCellCenter = (hash) => {
  const { latitude, longitude } = ngeohash.decode(hash);
  return { lat: latitude, lng: longitude };
};
