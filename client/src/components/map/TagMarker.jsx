import { AdvancedMarker } from '@vis.gl/react-google-maps';
import { getTagById } from '../../utils/tagConfig';

export default function TagMarker({ lat, lng, tag }) {
  const config = getTagById(tag);

  return (
    <AdvancedMarker position={{ lat, lng }}>
      <div className="flex flex-col items-center">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-lg shadow-[0_4px_12px_rgba(0,0,0,0.4)] border-[1.5px] border-white/30 backdrop-blur-sm"
          style={{ backgroundColor: `${config.color}e6` }}
        >
          {config.emoji}
        </div>
        <div
          className="w-2.5 h-2.5 -mt-1.5 rotate-45 shadow-sm"
          style={{ backgroundColor: config.color }}
        />
      </div>
    </AdvancedMarker>
  );
}
