import { useState, useCallback } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { DAYS_OF_WEEK, HOUR_SLOTS } from '../utils/timeSlots';
import { getTagById, TAG_IDS } from '../utils/tagConfig';
import * as momentService from '../services/momentService';

function ScoreGrid({ cells }) {
  if (!cells || cells.length === 0) return null;

  const tagTotals = {};
  let grandTotal = 0;
  TAG_IDS.forEach((t) => {
    tagTotals[t] = 0;
  });

  cells.forEach((cell) => {
    tagTotals[cell.dominantTag] = (tagTotals[cell.dominantTag] || 0) + cell.totalCount;
    grandTotal += cell.totalCount;
  });

  const sorted = Object.entries(tagTotals)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  if (sorted.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex gap-0.5 rounded-full overflow-hidden h-2.5">
        {sorted.map(([tag, count]) => {
          const config = getTagById(tag);
          const pct = grandTotal > 0 ? (count / grandTotal) * 100 : 0;
          return (
            <div
              key={tag}
              style={{ backgroundColor: config.color, width: `${pct}%` }}
              className="transition-all duration-300"
              title={`${config.label}: ${Math.round(pct)}%`}
            />
          );
        })}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {sorted.map(([tag, count]) => {
          const pct = grandTotal > 0 ? Math.round((count / grandTotal) * 100) : 0;
          return (
            <div
              key={tag}
              className="flex items-center justify-between bg-white/4 border border-white/6 rounded-2xl px-3 py-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]"
            >
              <Badge tag={tag} />
              <span className="text-[13px] font-semibold text-white tabular-nums">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ExplorePage() {
  const [coords, setCoords] = useState('');
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

  const [cells, setCells] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchedLabel, setSearchedLabel] = useState('');

  const handleExplore = useCallback(async () => {
    const parts = coords.split(',').map((s) => parseFloat(s.trim()));
    if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) {
      setError('Enter coordinates as: lat, lng');
      return;
    }

    const [lat, lng] = parts;
    const offset = 0.005;
    const slot = HOUR_SLOTS.find((s) => s.id === selectedSlot);

    setIsLoading(true);
    setError(null);

    try {
      const res = await momentService.getHeatmap({
        swLat: lat - offset,
        swLng: lng - offset,
        neLat: lat + offset,
        neLng: lng + offset,
        day: selectedDay,
        hour: slot.representative,
      });
      setCells(res.data);
      setSearchedLabel(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [coords, selectedDay, selectedSlot]);

  return (
    <PageWrapper>
      <div className="mb-8 pl-1">
        <h1 className="text-2xl font-semibold text-white tracking-tight">Explore a Location</h1>
        <p className="text-[13px] text-white/60 mt-1.5">
          Enter coordinates and see how that area feels across different times.
        </p>
      </div>

      <div className="bg-white/4 border border-white/6 rounded-[28px] p-6 mb-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <input
            type="text"
            value={coords}
            onChange={(e) => setCoords(e.target.value)}
            placeholder="lat, lng (e.g. 28.6315, 77.2167)"
            className="flex-1 bg-white/2 border border-white/6 rounded-full px-5 py-2.5 text-[14px] text-white/90 placeholder:text-white/30 focus:outline-none focus:border-white/20 focus:bg-white/4 transition-all duration-200"
          />
          <Button
            onClick={handleExplore}
            isLoading={isLoading}
            disabled={!coords.includes(',')}
            className="rounded-full"
          >
            Explore
          </Button>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
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

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-[13px] text-red-400 mb-6">
          {error}
        </div>
      )}

      {cells !== null && (
        <div className="bg-white/4 border border-white/6 rounded-[28px] p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
          <div className="flex items-center justify-between mb-5 px-1">
            <h2 className="text-[15px] font-semibold text-white tracking-tight">
              Score Profile —{' '}
              <span className="font-mono text-white/50 bg-white/5 px-2 py-0.5 rounded-md text-[13px]">
                {searchedLabel}
              </span>
            </h2>
            <span className="text-[12px] text-white/40">
              {cells.length} cell{cells.length !== 1 ? 's' : ''} with data
            </span>
          </div>

          {cells.length > 0 ? (
            <ScoreGrid cells={cells} />
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-3 opacity-80">🔇</div>
              <p className="text-[14px] font-medium text-white/70">
                No data for this location and time slot yet.
              </p>
              <p className="text-[13px] text-white/40 mt-1.5">
                Be the first to tag how it feels here!
              </p>
            </div>
          )}
        </div>
      )}
    </PageWrapper>
  );
}
