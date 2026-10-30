import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { fetchGenres } from "../api/client";
import { COUNTRY_OPTIONS, FORMAT_OPTIONS, SEASON_OPTIONS, SORT_OPTIONS, STATUS_OPTIONS } from "../constants";
import { useFilterStore } from "../store/useFilterStore";

export function FilterSidebar() {
  const filters = useFilterStore();
  const [searchInput, setSearchInput] = useState(filters.search);

  const { data: genres = [] } = useQuery({
    queryKey: ["genres"],
    queryFn: fetchGenres,
    staleTime: Infinity,
  });

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    filters.setSearch(value);
  }, 400);

  useEffect(() => {
    debouncedSetSearch(searchInput);
  }, [searchInput, debouncedSetSearch]);

  return (
    <aside className="flex w-full flex-col gap-5 border-base-700 bg-base-900 p-4 text-sm md:w-72 md:border-r">
      <div>
        <label className="mb-1 block text-xs uppercase tracking-wide text-slate-400">
          Buscar título
        </label>
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Ej: Cowboy Bebop"
          className="w-full rounded border border-base-700 bg-base-800 px-3 py-2 text-slate-100 outline-none focus:border-accent-500"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs uppercase tracking-wide text-slate-400">
          País de origen
        </label>
        <select
          value={filters.countryOfOrigin ?? ""}
          onChange={(e) => filters.setCountryOfOrigin(e.target.value || null)}
          className="w-full rounded border border-base-700 bg-base-800 px-3 py-2 text-slate-100"
        >
          <option value="">Todos (incluye donghua, etc.)</option>
          {COUNTRY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs uppercase tracking-wide text-slate-400">
          Ordenar por
        </label>
        <select
          value={filters.sort}
          onChange={(e) => filters.setSort(e.target.value)}
          className="w-full rounded border border-base-700 bg-base-800 px-3 py-2 text-slate-100"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-slate-400">
            Año desde
          </label>
          <input
            type="number"
            value={filters.yearFrom ?? ""}
            onChange={(e) => filters.setYearFrom(e.target.value ? Number(e.target.value) : null)}
            placeholder="1990"
            className="w-full rounded border border-base-700 bg-base-800 px-2 py-2 text-slate-100"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wide text-slate-400">
            Año hasta
          </label>
          <input
            type="number"
            value={filters.yearTo ?? ""}
            onChange={(e) => filters.setYearTo(e.target.value ? Number(e.target.value) : null)}
            placeholder="2026"
            className="w-full rounded border border-base-700 bg-base-800 px-2 py-2 text-slate-100"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 flex items-center justify-between text-xs uppercase tracking-wide text-slate-400">
          Formato
          {filters.formats.length > 0 && (
            <button
              type="button"
              onClick={() => filters.formats.forEach((f) => filters.toggleFormat(f))}
              className="normal-case text-accent-500"
            >
              limpiar
            </button>
          )}
        </label>
        <div className="flex flex-wrap gap-1">
          {FORMAT_OPTIONS.map((opt) => {
            const active = filters.formats.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => filters.toggleFormat(opt.value)}
                className={`rounded-full border px-2 py-1 text-xs ${
                  active
                    ? "border-accent-500 bg-accent-500 text-base-950"
                    : "border-base-700 text-slate-300 hover:border-accent-600"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs uppercase tracking-wide text-slate-400">
          Estado
        </label>
        <select
          value={filters.status ?? ""}
          onChange={(e) => filters.setStatus(e.target.value || null)}
          className="w-full rounded border border-base-700 bg-base-800 px-3 py-2 text-slate-100"
        >
          <option value="">Todos</option>
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs uppercase tracking-wide text-slate-400">
          Temporada
        </label>
        <select
          value={filters.season ?? ""}
          onChange={(e) => filters.setSeason(e.target.value || null)}
          className="w-full rounded border border-base-700 bg-base-800 px-3 py-2 text-slate-100"
        >
          <option value="">Todas</option>
          {SEASON_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 flex items-center justify-between text-xs uppercase tracking-wide text-slate-400">
          Géneros
          {filters.genres.length > 0 && (
            <button
              type="button"
              onClick={() => filters.genres.forEach((g) => filters.toggleGenre(g))}
              className="normal-case text-accent-500"
            >
              limpiar
            </button>
          )}
        </label>
        <div className="flex max-h-48 flex-wrap gap-1 overflow-y-auto pr-1">
          {genres.map((genre) => {
            const active = filters.genres.includes(genre);
            return (
              <button
                key={genre}
                type="button"
                onClick={() => filters.toggleGenre(genre)}
                className={`rounded-full border px-2 py-1 text-xs ${
                  active
                    ? "border-accent-500 bg-accent-500 text-base-950"
                    : "border-base-700 text-slate-300 hover:border-accent-600"
                }`}
              >
                {genre}
              </button>
            );
          })}
        </div>
      </div>

      <label className="flex items-center gap-2 text-xs text-slate-400">
        <input
          type="checkbox"
          checked={filters.includeAdult}
          onChange={(e) => filters.setIncludeAdult(e.target.checked)}
          className="h-4 w-4 rounded border-base-700 bg-base-800"
        />
        Incluir contenido adulto
      </label>

      <button
        type="button"
        onClick={() => {
          filters.reset();
          setSearchInput("");
        }}
        className="mt-2 rounded border border-base-700 py-2 text-xs text-slate-300 hover:border-accent-500"
      >
        Limpiar filtros
      </button>
    </aside>
  );
}
