import { pdf } from "@react-pdf/renderer";
import { useState } from "react";
import { useFilterStore } from "../store/useFilterStore";
import { useSelectionStore } from "../store/useSelectionStore";
import { CatalogDocument } from "./pdf/CatalogDocument";

function buildFilterSummary(filters: ReturnType<typeof useFilterStore.getState>): string {
  const parts: string[] = [];
  if (filters.search) parts.push(`búsqueda "${filters.search}"`);
  if (filters.genres.length > 0) parts.push(`géneros: ${filters.genres.join(", ")}`);
  if (filters.yearFrom || filters.yearTo) {
    parts.push(`años ${filters.yearFrom ?? "…"}–${filters.yearTo ?? "…"}`);
  }
  if (filters.formats.length > 0) parts.push(`formatos: ${filters.formats.join(", ")}`);
  if (filters.countryOfOrigin) parts.push(`país de origen: ${filters.countryOfOrigin}`);
  if (filters.status) parts.push(`estado: ${filters.status}`);
  if (filters.season) parts.push(`temporada: ${filters.season}`);

  return parts.length > 0 ? parts.join(" · ") : "Sin filtros (selección manual)";
}

export function SelectionBar() {
  const selected = useSelectionStore((state) => state.selected);
  const clear = useSelectionStore((state) => state.clear);
  const filters = useFilterStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const animeList = Array.from(selected.values());

  async function handleDownload() {
    if (animeList.length === 0) return;
    setIsGenerating(true);
    try {
      const filterSummary = buildFilterSummary(filters);
      const blob = await pdf(
        <CatalogDocument animeList={animeList} filterSummary={filterSummary} />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const date = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.download = `Catalogo_Anime_${date}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setIsGenerating(false);
    }
  }

  if (animeList.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-base-700 bg-base-900/95 backdrop-blur">
      {isOpen && (
        <div className="max-h-64 overflow-y-auto border-b border-base-700 p-3">
          <div className="flex flex-wrap gap-2">
            {animeList.map((anime) => (
              <span
                key={anime.id}
                className="flex items-center gap-2 rounded-full border border-base-700 bg-base-800 px-3 py-1 text-xs"
              >
                {anime.title}
                <button
                  type="button"
                  onClick={() => useSelectionStore.getState().remove(anime.id)}
                  className="text-slate-400 hover:text-red-400"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="text-sm text-slate-300 underline decoration-dotted"
        >
          {animeList.length} anime seleccionados
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={clear}
            className="rounded border border-base-700 px-3 py-2 text-xs text-slate-300 hover:border-red-400"
          >
            Vaciar selección
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={isGenerating}
            className="rounded bg-accent-500 px-4 py-2 text-sm font-semibold text-base-950 hover:bg-accent-600 disabled:opacity-60"
          >
            {isGenerating ? "Generando PDF..." : "Descargar PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}
