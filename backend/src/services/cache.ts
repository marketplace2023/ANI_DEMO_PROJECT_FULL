import crypto from "crypto";
import { prisma } from "./prisma";
import { NormalizedAnime, SearchFilters, SearchResult } from "../types";

const SEARCH_TTL_MS = (Number(process.env.SEARCH_CACHE_TTL_MINUTES) || 30) * 60 * 1000;
const ANIME_TTL_MS = (Number(process.env.ANIME_CACHE_TTL_MINUTES) || 1440) * 60 * 1000;

export function hashFilters(filters: SearchFilters): string {
  const normalized = JSON.stringify(filters, Object.keys(filters).sort());
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

export async function getCachedSearch(hash: string): Promise<SearchResult | null> {
  const row = await prisma.searchCache.findUnique({ where: { queryHash: hash } });
  if (!row) return null;

  const age = Date.now() - row.createdAt.getTime();
  if (age > SEARCH_TTL_MS) return null;

  return JSON.parse(row.resultJson) as SearchResult;
}

export async function setCachedSearch(hash: string, result: SearchResult): Promise<void> {
  const resultJson = JSON.stringify(result);
  await prisma.searchCache.upsert({
    where: { queryHash: hash },
    create: { queryHash: hash, resultJson },
    update: { resultJson, createdAt: new Date() },
  });

  await Promise.all(
    result.media.map((anime) =>
      prisma.animeCache.upsert({
        where: { provider_externalId: { provider: "ANILIST", externalId: anime.id } },
        create: { provider: "ANILIST", externalId: anime.id, data: JSON.stringify(anime) },
        update: { data: JSON.stringify(anime) },
      })
    )
  );
}

export async function getCachedAnime(id: number): Promise<NormalizedAnime | null> {
  const row = await prisma.animeCache.findUnique({
    where: { provider_externalId: { provider: "ANILIST", externalId: id } },
  });
  if (!row) return null;

  const age = Date.now() - row.updatedAt.getTime();
  if (age > ANIME_TTL_MS) return null;

  return JSON.parse(row.data) as NormalizedAnime;
}

export async function setCachedAnime(anime: NormalizedAnime): Promise<void> {
  await prisma.animeCache.upsert({
    where: { provider_externalId: { provider: "ANILIST", externalId: anime.id } },
    create: { provider: "ANILIST", externalId: anime.id, data: JSON.stringify(anime) },
    update: { data: JSON.stringify(anime) },
  });
}

export async function getCachedGenres(): Promise<string[] | null> {
  const rows = await prisma.genreCache.findMany({ orderBy: { name: "asc" } });
  if (rows.length === 0) return null;
  return rows.map((r) => r.name);
}

export async function setCachedGenres(genres: string[]): Promise<void> {
  await prisma.$transaction(
    genres.map((name) =>
      prisma.genreCache.upsert({
        where: { name },
        create: { name },
        update: {},
      })
    )
  );
}
