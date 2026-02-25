import { useState } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import RouteScorePanel from '../components/map/RouteScorePanel';
import { DAYS_OF_WEEK, HOUR_SLOTS } from '../utils/timeSlots';

export default function RouteComparePage() {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [selectedSlot, setSelectedSlot] = useState(
    HOUR_SLOTS.find((s) => {
      const h = new Date().getHours();
      if (s.id === 'morning') return h >= 6 && h < 12;
      if (s.id === 'afternoon') return h >= 12 && h < 18;
      if (s.id === 'evening') return h >= 18 && h < 22;
      return h >= 22 || h < 6;
    })?.id || 'morning'
  );

  const selectedHour = HOUR_SLOTS.find((s) => s.id === selectedSlot)?.representative || 9;

  return (
    <PageWrapper>
      <div className="mb-8 pl-1">
        <h1 className="text-2xl font-semibold text-white tracking-tight">Compare Routes</h1>
        <p className="text-[13px] text-white/60 mt-1.5">
          Enter two routes and compare their vibe scores for any day and time.
        </p>
      </div>

      <div className="bg-white/4 border border-white/6 rounded-[28px] p-6 mb-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
        <h2 className="text-[13px] font-medium text-white/90 mb-4 px-1">Time Filter</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {DAYS_OF_WEEK.map((day) => (
            <button
              key={day.value}
              type="button"
              onClick={() => setSelectedDay(day.value)}
              className={[
                'px-4 py-1.5 text-[12px] font-medium rounded-full transition-all duration-200 cursor-pointer',
                selectedDay === day.value
                  ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.15)]'
                  : 'text-white/50 hover:text-white bg-white/2 border border-white/4 hover:bg-white/6 hover:border-white/10',
              ].join(' ')}
            >
              {day.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {HOUR_SLOTS.map((slot) => (
            <button
              key={slot.id}
              type="button"
              onClick={() => setSelectedSlot(slot.id)}
              className={[
                'px-4 py-1.5 text-[12px] font-medium rounded-full transition-all duration-200 cursor-pointer border',
                selectedSlot === slot.id
                  ? 'bg-white text-black border-transparent shadow-[0_0_15px_rgba(255,255,255,0.15)]'
                  : 'text-white/50 bg-white/2 border-white/4 hover:text-white hover:bg-white/6 hover:border-white/10',
              ].join(' ')}
            >
              {slot.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <RouteScorePanel
          routeLabel="Route A"
          selectedDay={selectedDay}
          selectedHour={selectedHour}
        />
        <RouteScorePanel
          routeLabel="Route B"
          selectedDay={selectedDay}
          selectedHour={selectedHour}
        />
      </div>
    </PageWrapper>
  );
}
