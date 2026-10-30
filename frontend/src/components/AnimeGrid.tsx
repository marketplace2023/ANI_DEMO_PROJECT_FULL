import { useEffect, useRef } from "react";
import { useAnimeSearch } from "../hooks/useAnimeSearch";
import { useFilterStore } from "../store/useFilterStore";
import { useSelectionStore } from "../store/useSelectionStore";
import { AnimeCard } from "./AnimeCard";

export function AnimeGrid() {
  const filters = useFilterStore();
  const addMany = useSelectionStore((state) => state.addMany);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } =
    useAnimeSearch(filters);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const allAnime = data?.pages.flatMap((page) => page.media) ?? [];
  const total = data?.pages[0]?.pageInfo.total ?? 0;

  if (isLoading) {
    return <p className="p-8 text-center text-slate-400">Cargando catálogo...</p>;
  }

  if (isError) {
    return (
      <p className="p-8 text-center text-red-400">
        Error al consultar AniList: {(error as Error).message}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-sm text-slate-400">
        <span>{total.toLocaleString()} resultados</span>
        <button
          type="button"
          onClick={() => addMany(allAnime)}
          className="rounded border border-base-700 px-3 py-1 text-xs text-slate-200 hover:border-accent-500"
        >
          Seleccionar los {allAnime.length} cargados
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {allAnime.map((anime) => (
          <AnimeCard key={anime.id} anime={anime} />
        ))}
      </div>

      <div ref={sentinelRef} className="h-10">
        {isFetchingNextPage && (
          <p className="text-center text-sm text-slate-500">Cargando más...</p>
        )}
      </div>
    </div>
  );
}
