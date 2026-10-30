import { create } from "zustand";
import { FilterState } from "../types/anime";

interface FilterStore extends FilterState {
  setSearch: (search: string) => void;
  toggleGenre: (genre: string) => void;
  setYearFrom: (year: number | null) => void;
  setYearTo: (year: number | null) => void;
  toggleFormat: (format: string) => void;
  setCountryOfOrigin: (country: string | null) => void;
  setStatus: (status: string | null) => void;
  setSeason: (season: string | null) => void;
  setSort: (sort: string) => void;
  setIncludeAdult: (value: boolean) => void;
  reset: () => void;
}

const initialState: FilterState = {
  search: "",
  genres: [],
  yearFrom: null,
  yearTo: null,
  formats: [],
  countryOfOrigin: "JP",
  status: null,
  season: null,
  sort: "POPULARITY_DESC",
  includeAdult: false,
};

export const useFilterStore = create<FilterStore>((set) => ({
  ...initialState,
  setSearch: (search) => set({ search }),
  toggleGenre: (genre) =>
    set((state) => ({
      genres: state.genres.includes(genre)
        ? state.genres.filter((g) => g !== genre)
        : [...state.genres, genre],
    })),
  setYearFrom: (yearFrom) => set({ yearFrom }),
  setYearTo: (yearTo) => set({ yearTo }),
  toggleFormat: (format) =>
    set((state) => ({
      formats: state.formats.includes(format)
        ? state.formats.filter((f) => f !== format)
        : [...state.formats, format],
    })),
  setCountryOfOrigin: (countryOfOrigin) => set({ countryOfOrigin }),
  setStatus: (status) => set({ status }),
  setSeason: (season) => set({ season }),
  setSort: (sort) => set({ sort }),
  setIncludeAdult: (includeAdult) => set({ includeAdult }),
  reset: () => set(initialState),
}));
