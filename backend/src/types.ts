export interface NormalizedAnime {
  id: number;
  provider: "ANILIST";
  title: string;
  titleEnglish: string | null;
  titleRomaji: string | null;
  titleNative: string | null;
  year: number | null;
  season: string | null;
  format: string | null;
  episodes: number | null;
  durationMinutes: number | null;
  status: string | null;
  synopsis: string | null;
  coverImage: string | null;
  bannerImage: string | null;
  genres: string[];
  studios: string[];
  countryOfOrigin: string | null;
  source: string | null;
  score: number | null;
  isAdult: boolean;
  siteUrl: string | null;
  updatedAt: string | null;
}

export interface SearchFilters {
  search?: string;
  genres?: string[];
  yearFrom?: number;
  yearTo?: number;
  formats?: string[];
  countryOfOrigin?: string;
  status?: string;
  season?: string;
  sort?: string;
  includeAdult?: boolean;
  page: number;
  perPage: number;
}

export interface SearchResult {
  media: NormalizedAnime[];
  pageInfo: {
    total: number;
    currentPage: number;
    lastPage: number;
    hasNextPage: boolean;
    perPage: number;
  };
}
