import { Document } from "@react-pdf/renderer";
import { NormalizedAnime } from "../../types/anime";
import { AnimeFicha } from "./AnimeFicha";
import { CoverPage } from "./CoverPage";
import { IndexPage } from "./IndexPage";

interface Props {
  animeList: NormalizedAnime[];
  filterSummary: string;
}

export function CatalogDocument({ animeList, filterSummary }: Props) {
  return (
    <Document
      title="Catálogo Personal de Anime"
      author="Catálogo Anime PDF"
      subject="Catálogo de anime filtrado desde AniList"
      keywords="anime, catalogo, anilist, pdf"
      creator="Catálogo Anime PDF App"
    >
      <CoverPage total={animeList.length} filterSummary={filterSummary} />
      <IndexPage animeList={animeList} />
      {animeList.map((anime, index) => (
        <AnimeFicha key={anime.id} anime={anime} index={index} total={animeList.length} />
      ))}
    </Document>
  );
}
