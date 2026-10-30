export function cleanSynopsis(raw: string | null): string {
  if (!raw) return "Sinopsis no disponible.";

  return raw
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function formatList(items: string[], fallback = "No informado"): string {
  return items.length > 0 ? items.join(", ") : fallback;
}
