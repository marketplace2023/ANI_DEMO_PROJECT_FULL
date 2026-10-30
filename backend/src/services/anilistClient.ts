import { NormalizedAnime, SearchFilters, SearchResult } from "../types";

const ENDPOINT = process.env.ANILIST_ENDPOINT || "https://graphql.anilist.co";

const SEARCH_QUERY = `
query (
  $page: Int
  $perPage: Int
  $search: String
  $genres: [String]
  $formats: [MediaFormat]
  $status: MediaStatus
  $season: MediaSeason
  $sort: [MediaSort]
  $isAdult: Boolean
  $countryOfOrigin: CountryCode
  $startGreater: FuzzyDateInt
  $startLesser: FuzzyDateInt
) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      total
      currentPage
      lastPage
      hasNextPage
      perPage
    }
    media(
      type: ANIME
      search: $search
      genre_in: $genres
      format_in: $formats
      status: $status
      season: $season
      sort: $sort
      isAdult: $isAdult
      countryOfOrigin: $countryOfOrigin
      startDate_greater: $startGreater
      startDate_lesser: $startLesser
    ) {
      ...MediaFields
    }
  }
}
${"" /* fragment appended below */}
`;

const MEDIA_FRAGMENT = `
fragment MediaFields on Media {
  id
  title {
    romaji
    english
    native
  }
  startDate {
    year
  }
  season
  format
  episodes
  duration
  status
  description(asHtml: false)
  coverImage {
    large
    extraLarge
  }
  bannerImage
  genres
  studios(isMain: true) {
    nodes {
      name
    }
  }
  countryOfOrigin
  source
  averageScore
  isAdult
  siteUrl
  updatedAt
}
`;

const DETAIL_QUERY = `
query ($id: Int) {
  Media(id: $id, type: ANIME) {
    ...MediaFields
  }
}
${MEDIA_FRAGMENT}
`;

const GENRE_QUERY = `
query {
  GenreCollection
}
`;

async function requestAniList<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const maxAttempts = 4;
  let attempt = 0;

  while (true) {
    attempt += 1;
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });

    if (response.status === 429 && attempt < maxAttempts) {
      const retryAfter = Number(response.headers.get("retry-after")) || 2 * attempt;
      await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
      continue;
    }

    const json = (await response.json()) as { data?: T; errors?: Array<{ message: string }> };

    if (!response.ok || json.errors) {
      const message = json.errors?.[0]?.message || `AniList request failed with status ${response.status}`;
      throw new Error(message);
    }

    return json.data as T;
  }
}

function normalizeMedia(raw: any): NormalizedAnime {
  const title =
    raw.title?.english || raw.title?.romaji || raw.title?.native || "Sin título";

  return {
    id: raw.id,
    provider: "ANILIST",
    title,
    titleEnglish: raw.title?.english ?? null,
    titleRomaji: raw.title?.romaji ?? null,
    titleNative: raw.title?.native ?? null,
    year: raw.startDate?.year ?? null,
    season: raw.season ?? null,
    format: raw.format ?? null,
    episodes: raw.episodes ?? null,
    durationMinutes: raw.duration ?? null,
    status: raw.status ?? null,
    synopsis: raw.description ?? null,
    coverImage: raw.coverImage?.extraLarge || raw.coverImage?.large || null,
    bannerImage: raw.bannerImage ?? null,
    genres: raw.genres ?? [],
    studios: (raw.studios?.nodes ?? []).map((s: any) => s.name),
    countryOfOrigin: raw.countryOfOrigin ?? null,
    source: raw.source ?? null,
    score: raw.averageScore ?? null,
    isAdult: Boolean(raw.isAdult),
    siteUrl: raw.siteUrl ?? null,
    updatedAt: raw.updatedAt ? new Date(raw.updatedAt * 1000).toISOString() : null,
  };
}

function yearToFuzzyGreater(year: number | undefined): number | undefined {
  if (!year) return undefined;
  return (year - 1) * 10000 + 1231;
}

function yearToFuzzyLesser(year: number | undefined): number | undefined {
  if (!year) return undefined;
  return (year + 1) * 10000 + 101;
}

export async function searchAnime(filters: SearchFilters): Promise<SearchResult> {
  const data = await requestAniList<{ Page: any }>(SEARCH_QUERY + MEDIA_FRAGMENT, {
    page: filters.page,
    perPage: filters.perPage,
    search: filters.search || undefined,
    genres: filters.genres && filters.genres.length > 0 ? filters.genres : undefined,
    formats: filters.formats && filters.formats.length > 0 ? filters.formats : undefined,
    status: filters.status || undefined,
    season: filters.season || undefined,
    sort: filters.sort ? [filters.sort] : ["POPULARITY_DESC"],
    isAdult: filters.includeAdult ? undefined : false,
    countryOfOrigin: filters.countryOfOrigin || undefined,
    startGreater: yearToFuzzyGreater(filters.yearFrom),
    startLesser: yearToFuzzyLesser(filters.yearTo),
  });

  return {
    media: data.Page.media.map(normalizeMedia),
    pageInfo: data.Page.pageInfo,
  };
}

export async function getAnimeDetail(id: number): Promise<NormalizedAnime> {
  const data = await requestAniList<{ Media: any }>(DETAIL_QUERY, { id });
  return normalizeMedia(data.Media);
}

export async function getGenres(): Promise<string[]> {
  const data = await requestAniList<{ GenreCollection: string[] }>(GENRE_QUERY, {});
  return data.GenreCollection;
}
