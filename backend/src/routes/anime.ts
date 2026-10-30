import { Router } from "express";
import { getAnimeDetail, getGenres, searchAnime } from "../services/anilistClient";
import {
  getCachedAnime,
  getCachedGenres,
  getCachedSearch,
  hashFilters,
  setCachedAnime,
  setCachedGenres,
  setCachedSearch,
} from "../services/cache";
import { SearchFilters } from "../types";

export const animeRouter = Router();

function parseFilters(query: Record<string, unknown>): SearchFilters {
  const page = Number(query.page) || 1;
  const perPage = Math.min(Number(query.perPage) || 24, 50);

  return {
    search: typeof query.search === "string" && query.search.trim() ? query.search.trim() : undefined,
    genres: typeof query.genres === "string" && query.genres.trim() ? query.genres.split(",") : undefined,
    yearFrom: query.yearFrom ? Number(query.yearFrom) : undefined,
    yearTo: query.yearTo ? Number(query.yearTo) : undefined,
    formats: typeof query.formats === "string" && query.formats.trim() ? query.formats.split(",") : undefined,
    countryOfOrigin:
      typeof query.countryOfOrigin === "string" && query.countryOfOrigin ? query.countryOfOrigin : undefined,
    status: typeof query.status === "string" && query.status ? query.status : undefined,
    season: typeof query.season === "string" && query.season ? query.season : undefined,
    sort: typeof query.sort === "string" && query.sort ? query.sort : undefined,
    includeAdult: query.includeAdult === "true",
    page,
    perPage,
  };
}

animeRouter.get("/search", async (req, res) => {
  try {
    const filters = parseFilters(req.query as Record<string, unknown>);
    const hash = hashFilters(filters);

    const cached = await getCachedSearch(hash);
    if (cached) {
      res.json({ ...cached, fromCache: true });
      return;
    }

    const result = await searchAnime(filters);
    await setCachedSearch(hash, result);
    res.json({ ...result, fromCache: false });
  } catch (error) {
    console.error(error);
    res.status(502).json({ message: (error as Error).message });
  }
});

animeRouter.get("/anime/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ message: "ID inválido" });
      return;
    }

    const cached = await getCachedAnime(id);
    if (cached) {
      res.json({ ...cached, fromCache: true });
      return;
    }

    const anime = await getAnimeDetail(id);
    await setCachedAnime(anime);
    res.json({ ...anime, fromCache: false });
  } catch (error) {
    console.error(error);
    res.status(502).json({ message: (error as Error).message });
  }
});

animeRouter.get("/genres", async (_req, res) => {
  try {
    const cached = await getCachedGenres();
    if (cached) {
      res.json({ genres: cached, fromCache: true });
      return;
    }

    const genres = await getGenres();
    await setCachedGenres(genres);
    res.json({ genres, fromCache: false });
  } catch (error) {
    console.error(error);
    res.status(502).json({ message: (error as Error).message });
  }
});

const ALLOWED_IMAGE_HOSTS = ["s4.anilist.co", "s.anilist.co"];

animeRouter.get("/image-proxy", async (req, res) => {
  try {
    const url = req.query.url;
    if (typeof url !== "string") {
      res.status(400).json({ message: "Parámetro url requerido" });
      return;
    }

    const parsed = new URL(url);
    if (!ALLOWED_IMAGE_HOSTS.includes(parsed.hostname)) {
      res.status(400).json({ message: "Host de imagen no permitido" });
      return;
    }

    const upstream = await fetch(parsed.toString());
    if (!upstream.ok || !upstream.body) {
      res.status(502).json({ message: "No se pudo obtener la imagen" });
      return;
    }

    res.setHeader("Content-Type", upstream.headers.get("content-type") || "image/jpeg");
    res.setHeader("Cache-Control", "public, max-age=86400");

    const buffer = Buffer.from(await upstream.arrayBuffer());
    res.send(buffer);
  } catch (error) {
    console.error(error);
    res.status(502).json({ message: (error as Error).message });
  }
});
