# Catálogo Anime PDF (React + AniList)

SPA estilo AniList para explorar y filtrar anime, con exportación del resultado filtrado (o de una selección manual) a un PDF de catálogo personal (portada, índice y una ficha por anime).

> Este proyecto reemplaza el enfoque original de `PLAN_DESARROLLO_CATALOGO_ANIME_PDF.md` (app Python de escritorio con generación batch de volúmenes). Ese documento queda como referencia histórica de los campos y criterios de diseño de las fichas, que sí se reutilizaron aquí.

## Arquitectura

```
anime/
├── backend/     Express + TypeScript. Proxy/caché de la API GraphQL de AniList (SQLite vía Prisma).
└── frontend/    Vite + React + TypeScript. UI de filtros/grid + generación de PDF con @react-pdf/renderer.
```

- El frontend nunca llama a AniList directamente: pasa por `backend`, que normaliza la respuesta, cachea en SQLite (`SearchCache`, `AnimeCache`, `GenreCache`) y hace reintentos ante `429`.
- Las imágenes de portada se sirven a través de `/api/image-proxy` (mismo origen vía el proxy de Vite), necesario para que `@react-pdf/renderer` pueda incrustarlas en el PDF sin problemas de CORS.
- El PDF se genera 100% en el navegador con `@react-pdf/renderer` (texto seleccionable/buscable, no es una captura de pantalla).

## Requisitos

- Node.js 20+
- Conexión a internet (consume `https://graphql.anilist.co`)

## Instalación

```bash
npm install
cp backend/.env.example backend/.env
cd backend && npx prisma db push && cd ..
```

## Ejecución en desarrollo

En dos terminales:

```bash
npm run dev:backend    # http://localhost:4000
npm run dev:frontend   # http://localhost:5173
```

Abrir `http://localhost:5173`.

## Uso

1. Filtrar por título, géneros, año, formato, estado, temporada u orden desde la barra lateral.
2. Hacer clic en las portadas para seleccionarlas (o usar "Seleccionar los N cargados").
3. Con al menos un anime seleccionado aparece la barra inferior con el conteo y el botón **Descargar PDF**.
4. El PDF incluye: portada del catálogo (con el resumen de filtros aplicados), índice alfabético y una ficha por anime (título, título nativo, portada, año, tipo, episodios, estado, géneros, estudio, puntuación y sinopsis).

## Notas / limitaciones conocidas

- La fuente por defecto del PDF (Helvetica) no soporta caracteres japoneses; el título nativo (`titleNative`) puede no renderizarse correctamente. Para soportarlo, registrar una fuente Unicode (p. ej. Noto Sans JP) con `Font.register` en `frontend/src/components/pdf/`.
- La caché de búsquedas (`SEARCH_CACHE_TTL_MINUTES`, por defecto 30 min) y de fichas (`ANIME_CACHE_TTL_MINUTES`, por defecto 24h) se configuran en `backend/.env`.
- AniList aplica rate limiting a su API pública; el backend reintenta automáticamente ante `429` respetando `Retry-After`.

## Variables de entorno (`backend/.env`)

Ver `backend/.env.example`.
