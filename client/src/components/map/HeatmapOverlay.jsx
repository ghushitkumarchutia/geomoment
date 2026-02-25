import { useEffect, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { PolygonLayer } from '@deck.gl/layers';
import useMapStore from '../../store/mapStore';
import { cellToPolygon } from '../../utils/geohash';
import { getScoreColor } from '../../utils/scoreColor';

export default function HeatmapOverlay() {
  const map = useMap();
  const heatmapCells = useMapStore((s) => s.heatmapCells);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    const overlay = new GoogleMapsOverlay();
    overlay.setMap(map);
    overlayRef.current = overlay;

    return () => {
      overlay.setMap(null);
      overlay.finalize();
      overlayRef.current = null;
    };
  }, [map]);

  useEffect(() => {
    if (!overlayRef.current) return;

    const layer = new PolygonLayer({
      id: 'heatmap-polygons',
      data: heatmapCells,
      getPolygon: (d) => cellToPolygon(d.geohashCell),
      getFillColor: (d) => getScoreColor(d.dominantTag, d.score),
      getLineColor: [255, 255, 255, 25],
      getLineWidth: 1,
      lineWidthUnits: 'pixels',
      filled: true,
      stroked: true,
      extruded: false,
      pickable: false,
      updateTriggers: {
        getFillColor: [heatmapCells],
      },
    });

    overlayRef.current.setProps({ layers: [layer] });
  }, [heatmapCells, map]);

  return null;
}
