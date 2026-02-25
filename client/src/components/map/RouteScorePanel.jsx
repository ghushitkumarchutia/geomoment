import { useState } from 'react';
import useRouteScore from '../../hooks/useRouteScore';
import { getTagById } from '../../utils/tagConfig';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

function WaypointInput({ label, value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-[11px] font-medium text-white/50 uppercase tracking-wider ml-1">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/2 border border-white/6 rounded-full px-4 py-2 text-[13px] text-white/90 placeholder:text-white/30 focus:outline-none focus:border-white/20 focus:bg-white/4 transition-all duration-200 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
      />
    </div>
  );
}

function parseWaypoints(from, to) {
  const parse = (str) => {
    const parts = str.split(',').map((s) => parseFloat(s.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return { lat: parts[0], lng: parts[1] };
    }
    return null;
  };
  const start = parse(from);
  const end = parse(to);
  if (!start || !end) return null;

  const steps = 5;
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    points.push({
      lat: start.lat + (end.lat - start.lat) * t,
      lng: start.lng + (end.lng - start.lng) * t,
    });
  }
  return points;
}

function ScoreDisplay({ data, label }) {
  if (!data) return null;

  const hasScore = data.overallScore !== null;

  return (
    <div className="bg-white/4 border border-white/6 rounded-2xl p-4 mt-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[13px] font-medium text-white/70">{label}</span>
        <span className="text-[11px] text-white/50">{data.coverage} segments scored</span>
      </div>

      {hasScore ? (
        <div className="flex items-center gap-3">
          <div className="text-4xl font-bold text-white tracking-tight tabular-nums">
            {Math.round(data.overallScore * 100)}
          </div>
          <div className="flex flex-col gap-1">
            {data.overallDominantTag && <Badge tag={data.overallDominantTag} />}
            <span className="text-[11px] text-white/50">confidence score</span>
          </div>
        </div>
      ) : (
        <p className="text-[13px] text-white/50 py-2">No data available for this route and time</p>
      )}

      {hasScore && data.segments && (
        <div className="flex gap-0.5 mt-3 rounded-full overflow-hidden h-2">
          {data.segments.map((seg, i) => {
            const tag = seg.dominantTag ? getTagById(seg.dominantTag) : null;
            return (
              <div
                key={i}
                className="flex-1 transition-colors"
                style={{ backgroundColor: tag ? tag.color : '#e5e7eb' }}
                title={tag ? `${tag.label} (${Math.round((seg.score || 0) * 100)}%)` : 'No data'}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function RouteScorePanel({ routeLabel, selectedDay, selectedHour }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const { data, isLoading, error, fetchScore, reset } = useRouteScore();

  const handleScore = () => {
    const points = parseWaypoints(from, to);
    if (!points) return;
    fetchScore(points, selectedDay, selectedHour);
  };

  const handleClear = () => {
    setFrom('');
    setTo('');
    reset();
  };

  const isValid = from.includes(',') && to.includes(',');

  return (
    <div className="bg-black/80 backdrop-blur-xl border border-white/8 rounded-[28px] p-6 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.8)] ring-1 ring-white/2">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[15px] font-semibold text-white tracking-tight">{routeLabel}</h3>
        {(from || to) && (
          <button
            type="button"
            onClick={handleClear}
            className="text-[12px] text-white/50 hover:text-white transition-colors cursor-pointer px-2 py-0.5"
          >
            Clear
          </button>
        )}
      </div>

      <div className="space-y-3">
        <WaypointInput
          label="From"
          value={from}
          onChange={setFrom}
          placeholder="lat, lng (e.g. 28.63, 77.21)"
        />
        <WaypointInput
          label="To"
          value={to}
          onChange={setTo}
          placeholder="lat, lng (e.g. 28.64, 77.22)"
        />
      </div>

      <Button
        onClick={handleScore}
        disabled={!isValid}
        isLoading={isLoading}
        size="sm"
        className="w-full mt-4"
      >
        Get vibe score
      </Button>

      {error && (
        <div className="mt-3 p-2.5 rounded-lg bg-danger/5 border border-danger/15 text-xs text-danger">
          {error}
        </div>
      )}

      <ScoreDisplay data={data} label={routeLabel} />
    </div>
  );
}
