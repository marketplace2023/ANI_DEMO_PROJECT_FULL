import { imageProxyUrl } from "../api/client";
import { useSelectionStore } from "../store/useSelectionStore";
import { NormalizedAnime } from "../types/anime";

interface Props {
  anime: NormalizedAnime;
}

export function AnimeCard({ anime }: Props) {
  const isSelected = useSelectionStore((state) => state.isSelected(anime.id));
  const toggle = useSelectionStore((state) => state.toggle);

  return (
    <button
      type="button"
      onClick={() => toggle(anime)}
      className={`group relative flex flex-col overflow-hidden rounded-lg border bg-base-900 text-left transition
        ${isSelected ? "border-accent-500 ring-2 ring-accent-500" : "border-base-700 hover:border-accent-600"}`}
    >
      <div className="aspect-[2/3] w-full overflow-hidden bg-base-800">
        {anime.coverImage ? (
          <img
            src={imageProxyUrl(anime.coverImage) ?? undefined}
            alt={anime.title}
            loading="lazy"
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            Sin portada
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-2">
        <p className="line-clamp-2 text-sm font-semibold text-slate-100">{anime.title}</p>
        <div className="flex flex-wrap items-center gap-1 text-xs text-slate-400">
          <span>{anime.year ?? "s/f"}</span>
          <span>·</span>
          <span>{anime.format ?? "?"}</span>
          {anime.score !== null && (
            <>
              <span>·</span>
              <span className="text-accent-500">{anime.score}%</span>
            </>
          )}
        </div>
      </div>

      <div
        className={`absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full border text-xs
          ${isSelected ? "border-accent-500 bg-accent-500 text-base-950" : "border-slate-400/60 bg-black/40 text-transparent"}`}
      >
        ✓
      </div>
    </button>
  );
}
