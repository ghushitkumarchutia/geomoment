import { getTagById } from '../../utils/tagConfig';

const BADGE_STYLES = {
  safe: 'bg-green-500/10 text-green-400 border-green-500/20',
  unsafe: 'bg-red-500/10 text-red-400 border-red-500/20',
  lively: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  calm: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  crowded: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  deserted: 'bg-white/5 text-white/70 border-white/10',
};

const FALLBACK = BADGE_STYLES.deserted;

export default function Badge({ tag, className = '' }) {
  const config = getTagById(tag);
  const style = BADGE_STYLES[tag] || FALLBACK;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[13px] border ${style} ${className}`}
    >
      <span className="text-[13px] leading-none">{config.emoji}</span>
      {config.label}
    </span>
  );
}
