import { create } from 'zustand';

const useUiStore = create((set) => ({
  isAuthModalOpen: false,
  isTagSubmitModalOpen: false,
  activeAuthTab: 'login',

  openAuthModal: (tab = 'login') => set({ isAuthModalOpen: true, activeAuthTab: tab }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  openTagSubmitModal: () => set({ isTagSubmitModalOpen: true }),
  closeTagSubmitModal: () => set({ isTagSubmitModalOpen: false }),
  setActiveAuthTab: (tab) => set({ activeAuthTab: tab }),
}));

export default useUiStore;
