import { Image, Page, Text, View } from "@react-pdf/renderer";
import { imageProxyUrl } from "../../api/client";
import { NormalizedAnime } from "../../types/anime";
import { cleanSynopsis, formatList } from "../../utils/text";
import { styles } from "./styles";

const FORMAT_LABELS: Record<string, string> = {
  TV: "Serie de TV",
  TV_SHORT: "TV corta",
  MOVIE: "Película",
  OVA: "OVA",
  ONA: "ONA",
  SPECIAL: "Especial",
  MUSIC: "Video musical",
};

const STATUS_LABELS: Record<string, string> = {
  FINISHED: "Finalizado",
  RELEASING: "En emisión",
  NOT_YET_RELEASED: "Por estrenar",
  CANCELLED: "Cancelado",
  HIATUS: "En pausa",
};

interface Props {
  anime: NormalizedAnime;
  index: number;
  total: number;
}

export function AnimeFicha({ anime, index, total }: Props) {
  const coverUrl = imageProxyUrl(anime.coverImage);
  const updatedAt = anime.updatedAt
    ? new Date(anime.updatedAt).toLocaleDateString("es-ES")
    : "No informado";

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.fichaHeader}>
        <Text style={styles.fichaTitle}>{anime.title}</Text>
        {anime.titleNative && (
          <Text style={styles.fichaOriginalTitle}>{anime.titleNative}</Text>
        )}
      </View>

      <View style={styles.fichaBody}>
        {coverUrl ? (
          <Image src={coverUrl} style={styles.fichaCover} />
        ) : (
          <View style={styles.fichaCoverPlaceholder}>
            <Text>Portada no disponible</Text>
          </View>
        )}

        <View style={styles.fichaInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Año</Text>
            <Text style={styles.infoValue}>{anime.year ?? "No disponible"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tipo</Text>
            <Text style={styles.infoValue}>{FORMAT_LABELS[anime.format ?? ""] ?? "No informado"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Episodios</Text>
            <Text style={styles.infoValue}>{anime.episodes ?? "No informado"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Duración</Text>
            <Text style={styles.infoValue}>
              {anime.durationMinutes ? `${anime.durationMinutes} min/ep.` : "No informado"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Estado</Text>
            <Text style={styles.infoValue}>{STATUS_LABELS[anime.status ?? ""] ?? "No informado"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Géneros</Text>
            <Text style={styles.infoValue}>{formatList(anime.genres)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Estudio</Text>
            <Text style={styles.infoValue}>{formatList(anime.studios)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Puntuación</Text>
            <Text style={styles.infoValue}>{anime.score !== null ? `${anime.score}%` : "No informado"}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.synopsisHeading}>Sinopsis</Text>
      <Text style={styles.synopsisText}>{cleanSynopsis(anime.synopsis)}</Text>

      <View style={styles.footer} fixed>
        <Text>Fuente: AniList · ID {anime.id}</Text>
        <Text>Actualizado: {updatedAt}</Text>
        <Text render={({ pageNumber }) => `Ficha ${index + 1} de ${total} · Pág. ${pageNumber}`} />
      </View>
    </Page>
  );
}
