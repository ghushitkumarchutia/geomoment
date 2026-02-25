import { useMemo, useEffect } from 'react';
import useMapStore from '../../store/mapStore';
import {
  DAYS_OF_WEEK,
  HOUR_SLOTS,
  getSlotForHour,
  getCurrentTimeDefaults,
} from '../../utils/timeSlots';

const TODAY = new Date().getDay();
const AUTO_SYNC_INTERVAL = 60_000;

export default function TimeFilterBar() {
  const selectedDay = useMapStore((s) => s.selectedDay);
  const selectedHour = useMapStore((s) => s.selectedHour);
  const setSelectedDay = useMapStore((s) => s.setSelectedDay);
  const setSelectedHour = useMapStore((s) => s.setSelectedHour);
  const syncToCurrentTime = useMapStore((s) => s.syncToCurrentTime);

  const activeSlotId = useMemo(() => getSlotForHour(selectedHour)?.id, [selectedHour]);

  useEffect(() => {
    const timer = setInterval(() => {
      const { day, hour } = getCurrentTimeDefaults();
      syncToCurrentTime(day, hour);
    }, AUTO_SYNC_INTERVAL);

    return () => clearInterval(timer);
  }, [syncToCurrentTime]);

  return (
    <div className="bg-black backdrop-blur-2xl border border-white/8 rounded-3xl p-2 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.8)] ring-1 ring-white/2 inline-flex flex-col gap-2">
      <div className="flex items-center h-[44px] px-1.5 rounded-full border border-white/4 bg-white/2">
        {DAYS_OF_WEEK.map((day) => (
          <button
            key={day.value}
            type="button"
            onClick={() => setSelectedDay(day.value)}
            className={[
              'relative px-4 py-1.5 text-[13px] font-medium rounded-full transition-colors duration-200 cursor-pointer outline-none flex items-center justify-center -translate-y-[0.5px]',
              selectedDay === day.value
                ? 'bg-white/10 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] box-border border-b border-black/30'
                : day.value === TODAY
                  ? 'text-green-400 font-semibold hover:bg-white/4'
                  : 'text-white/50 hover:text-white/90 hover:bg-white/4',
            ].join(' ')}
          >
            {day.label}
          </button>
        ))}
      </div>

      <div className="flex items-center h-[44px] px-1.5 rounded-full border border-white/4 bg-white/2">
        {HOUR_SLOTS.map((slot) => (
          <button
            key={slot.id}
            type="button"
            title={slot.description}
            onClick={() => setSelectedHour(slot.representative)}
            className={[
              'flex-1 h-8 px-2 text-[12px] font-medium rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center -translate-y-[0.5px]',
              activeSlotId === slot.id
                ? 'bg-white/10 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] box-border border-b border-black/30'
                : 'text-white/50 hover:text-white/90 hover:bg-white/4',
            ].join(' ')}
          >
            {slot.label}
          </button>
        ))}
      </div>
    </div>
  );
}
