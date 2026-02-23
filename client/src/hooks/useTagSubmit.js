import { useState, useCallback } from 'react';
import useAuthStore from '../store/authStore';
import useMapStore from '../store/mapStore';
import useUiStore from '../store/uiStore';
import * as momentService from '../services/momentService';
import { SUBMIT_SLOTS } from '../utils/timeSlots';

export default function useTagSubmit() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const clickedCoords = useMapStore((s) => s.clickedCoords);
  const clearClickedCoords = useMapStore((s) => s.clearClickedCoords);
  const addRecentMoment = useMapStore((s) => s.addRecentMoment);
  const triggerHeatmapRefresh = useMapStore((s) => s.triggerHeatmapRefresh);
  const openAuthModal = useUiStore((s) => s.openAuthModal);
  const closeTagSubmitModal = useUiStore((s) => s.closeTagSubmitModal);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = useCallback(
    async (tag, note = '', slotId) => {
      if (!isAuthenticated) {
        closeTagSubmitModal();
        openAuthModal('login');
        return null;
      }

      if (!clickedCoords || !slotId) return null;

      const slot = SUBMIT_SLOTS.find((s) => s.id === slotId);
      if (!slot) return null;

      const isAllTime = slotId === 'all';
      const now = new Date();

      const payload = {
        lat: clickedCoords.lat,
        lng: clickedCoords.lng,
        tag,
        note: note.trim(),
        dayOfWeek: isAllTime ? -1 : now.getDay(),
        hourSlot: slot.representative,
      };

      setIsLoading(true);
      setError(null);

      try {
        const res = await momentService.submitMoment(payload);

        addRecentMoment({
          _id: res.data._id,
          tag: res.data.tag,
          note: res.data.note,
          dayOfWeek: res.data.dayOfWeek,
          hourSlot: res.data.hourSlot,
          lat: clickedCoords.lat,
          lng: clickedCoords.lng,
          createdAt: res.data.createdAt,
        });

        triggerHeatmapRefresh();
        clearClickedCoords();
        closeTagSubmitModal();
        return res.data;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [
      isAuthenticated,
      clickedCoords,
      addRecentMoment,
      triggerHeatmapRefresh,
      clearClickedCoords,
      closeTagSubmitModal,
      openAuthModal,
    ]
  );

  const clearError = useCallback(() => setError(null), []);

  return { submit, isLoading, error, clearError };
}
