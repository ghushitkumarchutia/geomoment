import TAG_TYPES from '../../utils/tagConfig';

export default function TagLegend() {
  return (
    <div className="bg-black backdrop-blur-2xl border border-white/8 rounded-2xl md:rounded-3xl px-4 py-4 md:py-3 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.8)] ring-1 ring-white/2 inline-flex">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-wrap">
        {TAG_TYPES.map((tag) => (
          <div key={tag.id} className="flex items-center gap-2">
            <span
              className="size-2.5 rounded-full shrink-0 shadow-[0_0_10px_rgba(255,255,255,0.1)]"
              style={{ backgroundColor: tag.color }}
            />
            <span className="text-[12px] font-medium text-white/70 leading-none">{tag.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
