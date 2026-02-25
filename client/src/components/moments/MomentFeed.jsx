import { useEffect, useRef, useState } from 'react';
import useMapStore from '../../store/mapStore';
import * as momentService from '../../services/momentService';
import MomentCard from './MomentCard';
import Spinner from '../ui/Spinner';

const DEBOUNCE_MS = 600;

export default function MomentFeed({ onClose }) {
  const mapBounds = useMapStore((s) => s.mapBounds);
  const recentMoments = useMapStore((s) => s.recentMoments);
  const setRecentMoments = useMapStore((s) => s.setRecentMoments);

  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!mapBounds) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      const id = ++requestIdRef.current;
      const { sw, ne } = mapBounds;

      setIsLoading(true);
      try {
        const res = await momentService.getMomentsInBounds({
          swLat: sw.lat,
          swLng: sw.lng,
          neLat: ne.lat,
          neLng: ne.lng,
          limit: 30,
        });
        if (id !== requestIdRef.current) return;
        setRecentMoments(res.data);
      } catch {
        if (id !== requestIdRef.current) return;
      } finally {
        if (id === requestIdRef.current) setIsLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [mapBounds, setRecentMoments]);

  return (
    <div className="flex flex-col h-full bg-transparent overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <h2 className="text-[14px] font-semibold text-white tracking-tight">Nearby Moments</h2>
          {isLoading && <Spinner size="sm" className="text-white/50" />}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 -mr-1.5 text-white/50 hover:text-white rounded-full hover:bg-white/10 transition-colors lg:hidden"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 hide-scrollbar">
        {!isLoading && recentMoments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-white/4 border border-white/6 flex items-center justify-center mb-4">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-white/40"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <p className="text-[13px] text-white/50">No moments in this area yet</p>
          </div>
        )}

        {recentMoments.map((m) => (
          <MomentCard key={m._id} moment={m} />
        ))}
      </div>
    </div>
  );
}
