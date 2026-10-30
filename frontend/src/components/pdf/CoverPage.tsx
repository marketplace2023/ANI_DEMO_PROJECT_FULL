import { Page, Text, View } from "@react-pdf/renderer";
import { styles } from "./styles";

interface Props {
  total: number;
  filterSummary: string;
}

export function CoverPage({ total, filterSummary }: Props) {
  const generatedAt = new Date().toLocaleString("es-ES", {
    dateStyle: "long",
    timeStyle: "short",
  });

  return (
    <Page size="A4" style={styles.coverPage}>
      <Text style={styles.coverTitle}>Catálogo Personal de Anime</Text>
      <Text style={styles.coverSubtitle}>Generado desde AniList</Text>

      <View style={styles.coverMetaBlock}>
        <Text style={styles.coverMetaLine}>Registros incluidos: {total}</Text>
        <Text style={styles.coverMetaLine}>Filtros aplicados: {filterSummary}</Text>
        <Text style={styles.coverMetaLine}>Fecha de generación: {generatedAt}</Text>
        <Text style={styles.coverMetaLine}>Fuente de datos: AniList (anilist.co)</Text>
      </View>
    </Page>
  );
}
