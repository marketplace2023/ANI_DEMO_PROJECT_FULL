import { create } from "zustand";
import { NormalizedAnime } from "../types/anime";

interface SelectionStore {
  selected: Map<number, NormalizedAnime>;
  toggle: (anime: NormalizedAnime) => void;
  addMany: (animeList: NormalizedAnime[]) => void;
  remove: (id: number) => void;
  clear: () => void;
  isSelected: (id: number) => boolean;
}

export const useSelectionStore = create<SelectionStore>((set, get) => ({
  selected: new Map(),
  toggle: (anime) =>
    set((state) => {
      const next = new Map(state.selected);
      if (next.has(anime.id)) {
        next.delete(anime.id);
      } else {
        next.set(anime.id, anime);
      }
      return { selected: next };
    }),
  addMany: (animeList) =>
    set((state) => {
      const next = new Map(state.selected);
      animeList.forEach((anime) => next.set(anime.id, anime));
      return { selected: next };
    }),
  remove: (id) =>
    set((state) => {
      const next = new Map(state.selected);
      next.delete(id);
      return { selected: next };
    }),
  clear: () => set({ selected: new Map() }),
  isSelected: (id) => get().selected.has(id),
}));
