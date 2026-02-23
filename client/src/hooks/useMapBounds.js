import { useEffect } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import useMapStore from '../store/mapStore';

export default function useMapBounds() {
  const map = useMap();
  const setMapBounds = useMapStore((s) => s.setMapBounds);

  useEffect(() => {
    if (!map) return;

    const updateBounds = () => {
      const bounds = map.getBounds();
      if (!bounds) return;

      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();

      setMapBounds({
        sw: { lat: sw.lat(), lng: sw.lng() },
        ne: { lat: ne.lat(), lng: ne.lng() },
      });
    };

    const listener = map.addListener('idle', updateBounds);
    updateBounds();

    return () => listener.remove();
  }, [map, setMapBounds]);
}
