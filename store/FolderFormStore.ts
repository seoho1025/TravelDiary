import { create } from 'zustand';

interface FolderFormState {
  startDate: string | null;
  endDate: string | null;
  title: string | null;
  setStartDate: (date: string | null) => void;
  setEndDate: (date: string | null) => void;
  setTitle: (title: string | null) => void;
  resetDates: () => void;
  resetAll: () => void;
}

export const useFolderFormStore = create<FolderFormState>((set) => ({
  startDate: null,
  endDate: null,
  title: null,
  setStartDate: (date) => set({ startDate: date }),
  setEndDate: (date) => set({ endDate: date }),
  setTitle: (title) => set({ title }),
  resetDates: () => set({ startDate: null, endDate: null }),
  resetAll: () => set({ startDate: null, endDate: null, title: null }),
})); 