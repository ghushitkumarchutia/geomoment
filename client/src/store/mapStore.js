import { create } from 'zustand';
import { getCurrentTimeDefaults } from '../utils/timeSlots';

const { day, hour } = getCurrentTimeDefaults();

const useMapStore = create((set, get) => ({
  mapBounds: null,
  clickedCoords: null,
  selectedDay: day,
  selectedHour: hour,
  isAutoTime: true,
  heatmapCells: [],
  recentMoments: [],
  isHeatmapLoading: false,
  heatmapRefreshKey: 0,

  setMapBounds: (bounds) => set({ mapBounds: bounds }),
  setClickedCoords: (coords) => set({ clickedCoords: coords }),
  clearClickedCoords: () => set({ clickedCoords: null }),
  setSelectedDay: (d) => set({ selectedDay: d, isAutoTime: false }),
  setSelectedHour: (h) => set({ selectedHour: h, isAutoTime: false }),
  setTimeFilter: (d, h) => set({ selectedDay: d, selectedHour: h }),
  syncToCurrentTime: (d, h) => {
    const { isAutoTime } = get();
    if (isAutoTime) set({ selectedDay: d, selectedHour: h });
  },
  resetAutoTime: () => {
    const { day: d, hour: h } = getCurrentTimeDefaults();
    set({ selectedDay: d, selectedHour: h, isAutoTime: true });
  },
  setHeatmapCells: (cells) => set({ heatmapCells: cells }),
  setRecentMoments: (moments) => set({ recentMoments: moments }),
  addRecentMoment: (moment) =>
    set((state) => ({ recentMoments: [moment, ...state.recentMoments] })),
  setIsHeatmapLoading: (loading) => set({ isHeatmapLoading: loading }),
  triggerHeatmapRefresh: () => set((state) => ({ heatmapRefreshKey: state.heatmapRefreshKey + 1 })),
}));

export default useMapStore;
