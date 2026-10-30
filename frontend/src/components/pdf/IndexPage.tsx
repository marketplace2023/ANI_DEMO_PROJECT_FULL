import { Page, Text, View } from "@react-pdf/renderer";
import { NormalizedAnime } from "../../types/anime";
import { styles } from "./styles";

interface Props {
  animeList: NormalizedAnime[];
}

export function IndexPage({ animeList }: Props) {
  const sorted = [...animeList].sort((a, b) => a.title.localeCompare(b.title, "es"));

  let lastLetter = "";

  return (
    <Page size="A4" style={styles.page} wrap>
      <Text style={styles.sectionHeading}>Índice general</Text>

      <View style={styles.indexRow}>
        <Text style={[styles.indexTitle, { fontFamily: "Helvetica-Bold" }]}>Título</Text>
        <Text style={[styles.indexYear, { fontFamily: "Helvetica-Bold" }]}>Año</Text>
        <Text style={[styles.indexFormat, { fontFamily: "Helvetica-Bold" }]}>Tipo</Text>
      </View>

      {sorted.map((anime) => {
        const letter = anime.title.charAt(0).toUpperCase();
        const showLetter = letter !== lastLetter;
        lastLetter = letter;

        return (
          <View key={anime.id} wrap={false}>
            {showLetter && <Text style={styles.indexLetter}>{letter}</Text>}
            <View style={styles.indexRow}>
              <Text style={styles.indexTitle}>{anime.title}</Text>
              <Text style={styles.indexYear}>{anime.year ?? "-"}</Text>
              <Text style={styles.indexFormat}>{anime.format ?? "-"}</Text>
            </View>
          </View>
        );
      })}
    </Page>
  );
}
