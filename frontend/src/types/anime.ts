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

export interface PageInfo {
  total: number;
  currentPage: number;
  lastPage: number;
  hasNextPage: boolean;
  perPage: number;
}

export interface SearchResponse {
  media: NormalizedAnime[];
  pageInfo: PageInfo;
  fromCache: boolean;
}

export interface FilterState {
  search: string;
  genres: string[];
  yearFrom: number | null;
  yearTo: number | null;
  formats: string[];
  countryOfOrigin: string | null;
  status: string | null;
  season: string | null;
  sort: string;
  includeAdult: boolean;
}
