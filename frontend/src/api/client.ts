import { FilterState, NormalizedAnime, SearchResponse } from "../types/anime";

const API_BASE = "/api";

export function imageProxyUrl(url: string | null): string | null {
  if (!url) return null;
  return `${API_BASE}/image-proxy?url=${encodeURIComponent(url)}`;
}

export async function fetchGenres(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/genres`);
  if (!res.ok) throw new Error("No se pudieron cargar los géneros");
  const data = await res.json();
  return data.genres;
}

export async function fetchAnimeSearch(
  filters: FilterState,
  page: number,
  perPage: number
): Promise<SearchResponse> {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.genres.length > 0) params.set("genres", filters.genres.join(","));
  if (filters.yearFrom) params.set("yearFrom", String(filters.yearFrom));
  if (filters.yearTo) params.set("yearTo", String(filters.yearTo));
  if (filters.formats.length > 0) params.set("formats", filters.formats.join(","));
  if (filters.countryOfOrigin) params.set("countryOfOrigin", filters.countryOfOrigin);
  if (filters.status) params.set("status", filters.status);
  if (filters.season) params.set("season", filters.season);
  if (filters.sort) params.set("sort", filters.sort);
  params.set("includeAdult", String(filters.includeAdult));
  params.set("page", String(page));
  params.set("perPage", String(perPage));

  const res = await fetch(`${API_BASE}/search?${params.toString()}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || "Error al buscar anime");
  }
  return res.json();
}

export async function fetchAnimeDetail(id: number): Promise<NormalizedAnime> {
  const res = await fetch(`${API_BASE}/anime/${id}`);
  if (!res.ok) throw new Error("No se pudo cargar el detalle del anime");
  return res.json();
}
