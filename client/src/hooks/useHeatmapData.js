import { useEffect, useRef } from 'react';
import useMapStore from '../store/mapStore';
import * as momentService from '../services/momentService';

const DEBOUNCE_MS = 400;

export default function useHeatmapData() {
  const mapBounds = useMapStore((s) => s.mapBounds);
  const selectedDay = useMapStore((s) => s.selectedDay);
  const selectedHour = useMapStore((s) => s.selectedHour);
  const setHeatmapCells = useMapStore((s) => s.setHeatmapCells);
  const setIsHeatmapLoading = useMapStore((s) => s.setIsHeatmapLoading);
  const heatmapRefreshKey = useMapStore((s) => s.heatmapRefreshKey);

  const timerRef = useRef(null);
  const requestIdRef = useRef(0);
  const lastFetchRef = useRef(null);

  useEffect(() => {
    if (!mapBounds) return;

    const { sw, ne } = mapBounds;

    if (lastFetchRef.current) {
      const prev = lastFetchRef.current;
      if (
        prev.refreshKey === heatmapRefreshKey &&
        prev.day === selectedDay &&
        prev.hour === selectedHour &&
        sw.lat >= prev.swLat &&
        sw.lng >= prev.swLng &&
        ne.lat <= prev.neLat &&
        ne.lng <= prev.neLng
      ) {
        return;
      }
    }

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      const id = ++requestIdRef.current;
      const params = {
        swLat: sw.lat,
        swLng: sw.lng,
        neLat: ne.lat,
        neLng: ne.lng,
        day: selectedDay,
        hour: selectedHour,
      };

      setIsHeatmapLoading(true);

      try {
        const res = await momentService.getHeatmap(params);
        if (id !== requestIdRef.current) return;
        setHeatmapCells(res.data);
        lastFetchRef.current = { ...params, refreshKey: heatmapRefreshKey };
      } catch {
        if (id !== requestIdRef.current) return;
      } finally {
        if (id === requestIdRef.current) {
          setIsHeatmapLoading(false);
        }
      }
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [
    mapBounds,
    selectedDay,
    selectedHour,
    heatmapRefreshKey,
    setHeatmapCells,
    setIsHeatmapLoading,
  ]);
}
