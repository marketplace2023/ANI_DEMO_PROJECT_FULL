export function Header() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-base-700 bg-base-900/95 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-accent-500">Catálogo</span>
        <span className="text-xl font-bold text-slate-100">Anime</span>
      </div>
      <p className="hidden text-xs text-slate-400 sm:block">
        Explora, filtra y descarga tu catálogo personal en PDF · datos vía AniList
      </p>
    </header>
  );
}
