import { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import useUiStore from '../../store/uiStore';
import useMapStore from '../../store/mapStore';
import useTagSubmit from '../../hooks/useTagSubmit';
import TAG_TYPES from '../../utils/tagConfig';
import { SUBMIT_SLOTS } from '../../utils/timeSlots';
import { noteRules } from '../../utils/validators';

const NOTE_MAX = noteRules.maxLength.value;

export default function TagSubmitModal() {
  const { isTagSubmitModalOpen, closeTagSubmitModal } = useUiStore();
  const clickedCoords = useMapStore((s) => s.clickedCoords);
  const clearClickedCoords = useMapStore((s) => s.clearClickedCoords);
  const { submit, isLoading, error } = useTagSubmit();

  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [note, setNote] = useState('');

  const handleClose = () => {
    setSelectedTag(null);
    setSelectedSlot(null);
    setNote('');
    clearClickedCoords();
    closeTagSubmitModal();
  };

  const handleSubmit = async () => {
    if (!selectedTag || !selectedSlot) return;
    try {
      await submit(selectedTag, note, selectedSlot);
      setSelectedTag(null);
      setSelectedSlot(null);
      setNote('');
    } catch (err) {
      console.error(err);
    }
  };

  const coords = clickedCoords
    ? `${clickedCoords.lat.toFixed(5)}, ${clickedCoords.lng.toFixed(5)}`
    : '';

  const canSubmit = selectedTag && selectedSlot;

  return (
    <Modal isOpen={isTagSubmitModalOpen} onClose={handleClose} title="How does it feel here?">
      {coords && <p className="text-[11px] text-white/40 font-mono mb-5 -mt-2.5 ml-1">{coords}</p>}

      <div className="grid grid-cols-3 gap-2 mb-5">
        {TAG_TYPES.map((tag) => (
          <button
            key={tag.id}
            type="button"
            onClick={() => setSelectedTag(tag.id)}
            className={[
              'flex flex-col items-center gap-2 p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer',
              selectedTag === tag.id
                ? 'border-current shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] scale-[1.02]'
                : 'border-white/6 hover:border-white/20 hover:bg-white/5',
            ].join(' ')}
            style={
              selectedTag === tag.id
                ? { color: tag.color, backgroundColor: `${tag.color}0a` }
                : undefined
            }
          >
            <span className="text-xl leading-none">{tag.emoji}</span>
            <span
              className={[
                'text-[12px] font-medium tracking-wide',
                selectedTag === tag.id ? '' : 'text-white/60',
              ].join(' ')}
            >
              {tag.label}
            </span>
          </button>
        ))}
      </div>

      <div className="mb-6">
        <p className="text-[13px] font-medium text-white/90 mb-2.5 ml-1">When does this apply?</p>
        <div className="flex gap-1.5 p-1 bg-white/4 rounded-full border border-white/6">
          {SUBMIT_SLOTS.map((slot) => (
            <button
              key={slot.id}
              type="button"
              onClick={() => setSelectedSlot(slot.id)}
              className={[
                'flex-1 py-1.5 text-[12px] font-semibold rounded-full border transition-all duration-200 cursor-pointer',
                selectedSlot === slot.id
                  ? 'bg-white text-black border-transparent shadow-sm'
                  : 'text-white/50 border-transparent hover:text-white/80 hover:bg-white/5',
              ].join(' ')}
            >
              {slot.label}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-white/40 mt-3 ml-1">
          Select the time of day this vibe applies to
        </p>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2 ml-1">
          <label htmlFor="moment-note" className="text-[13px] font-medium text-white/90">
            Note <span className="text-white/40 font-normal">(optional)</span>
          </label>
          <span
            className={[
              'text-[11px] tabular-nums',
              note.length > NOTE_MAX ? 'text-red-400' : 'text-white/40',
            ].join(' ')}
          >
            {note.length}/{NOTE_MAX}
          </span>
        </div>
        <textarea
          id="moment-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={NOTE_MAX}
          rows={2}
          placeholder="What's the vibe like right now?"
          className="w-full bg-white/2 border border-white/6 rounded-2xl px-4 py-3 text-[13px] text-white/90 placeholder:text-white/30 focus:outline-none focus:border-white/20 focus:bg-white/4 transition-colors duration-200 resize-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-[13px] text-red-400 mb-5">
          <span>{error}</span>
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="ghost" onClick={handleClose} className="flex-1">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          isLoading={isLoading}
          disabled={!canSubmit}
          className="flex-1"
        >
          Tag this spot
        </Button>
      </div>
    </Modal>
  );
}
