import Badge from '../ui/Badge';
import { formatTimeAgo, formatDaySlot, truncateNote } from '../../utils/formatters';

export default function MomentCard({ moment, actions }) {
  return (
    <div className="group relative bg-white/5 border border-white/10 hover:bg-white/10 rounded-3xl p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)] backdrop-blur-md transition-all duration-300">
      <div className="flex items-start justify-between gap-3">
        <Badge tag={moment.tag} />
        {actions && <div className="flex items-center gap-1 shrink-0">{actions}</div>}
      </div>

      {moment.note && (
        <p className="text-[13px] text-white/70 mt-2.5 leading-relaxed">
          {truncateNote(moment.note, 80)}
        </p>
      )}

      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/6">
        <span className="text-[11px] text-white/50 font-medium tracking-wide uppercase">
          {formatDaySlot(moment.dayOfWeek, moment.hourSlot)}
        </span>
        <span className="text-[11px] text-white/40">{formatTimeAgo(moment.createdAt)}</span>
      </div>
    </div>
  );
}
