import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MapCanvas, { LocateMeButton } from '../components/map/MapCanvas';
import TimeFilterBar from '../components/filters/TimeFilterBar';
import TagLegend from '../components/filters/TagLegend';
import MomentFeed from '../components/moments/MomentFeed';
import useMapStore from '../store/mapStore';
import Spinner from '../components/ui/Spinner';

export default function HomePage() {
  const isHeatmapLoading = useMapStore((s) => s.isHeatmapLoading);
  const [isFeedOpen, setIsFeedOpen] = useState(false);

  return (
    <main className="h-dvh w-full flex overflow-hidden">
      <div className="flex-1 relative">
        <MapCanvas />

        {isHeatmapLoading && (
          <div className="absolute top-18 left-1/2 -translate-x-1/2 z-10 bg-black/50 backdrop-blur-md rounded-full px-5 py-2.5 flex items-center gap-2.5 border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.4)]">
            <Spinner size="sm" className="text-white/60" />
            <span className="text-[13px] font-medium text-white/90 tracking-wide">
              Updating map...
            </span>
          </div>
        )}

        <div className="absolute top-18 right-3 z-10">
          <LocateMeButton />
        </div>

        <div className="absolute bottom-28 right-3 z-10 lg:hidden pointer-events-auto">
          <button
            onClick={() => setIsFeedOpen(true)}
            className="size-11 bg-black/90 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white/90 hover:text-white hover:bg-black transition-all duration-200 cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.5)] ring-1 ring-white/5"
            aria-label="View nearby moments"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>

        <div className="absolute top-18 left-3 z-10 pointer-events-auto">
          <TagLegend />
        </div>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-auto w-full px-3 flex justify-center">
          <TimeFilterBar />
        </div>
      </div>

      <AnimatePresence>
        {isFeedOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-x-0 bottom-0 top-14 z-40 bg-black lg:hidden border-t border-white/10 flex flex-col"
          >
            <MomentFeed onClose={() => setIsFeedOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <aside className="hidden lg:flex flex-col w-[360px] border-l border-white/10 bg-black z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] pt-14">
        <MomentFeed />
      </aside>
    </main>
  );
}
