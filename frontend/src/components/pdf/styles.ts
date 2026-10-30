import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1a1a1a",
  },
  coverPage: {
    padding: 60,
    fontFamily: "Helvetica",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  coverTitle: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    marginBottom: 12,
  },
  coverSubtitle: {
    fontSize: 14,
    color: "#4a4a4a",
    marginBottom: 40,
  },
  coverMetaBlock: {
    borderTop: "1pt solid #cccccc",
    paddingTop: 16,
    marginTop: 16,
    gap: 4,
  },
  coverMetaLine: {
    fontSize: 11,
    color: "#333333",
    marginBottom: 4,
  },
  sectionHeading: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    marginBottom: 12,
  },
  indexRow: {
    flexDirection: "row",
    borderBottom: "0.5pt solid #e0e0e0",
    paddingVertical: 4,
  },
  indexTitle: {
    flex: 3,
  },
  indexYear: {
    flex: 1,
    textAlign: "center",
  },
  indexFormat: {
    flex: 1,
    textAlign: "center",
  },
  indexLetter: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginTop: 10,
    marginBottom: 4,
    color: "#2b9fe0",
  },
  fichaHeader: {
    marginBottom: 10,
  },
  fichaTitle: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
  },
  fichaOriginalTitle: {
    fontSize: 11,
    color: "#555555",
    marginTop: 2,
  },
  fichaBody: {
    flexDirection: "row",
    gap: 16,
  },
  fichaCover: {
    width: 160,
    height: 240,
    objectFit: "cover",
    borderRadius: 4,
  },
  fichaCoverPlaceholder: {
    width: 160,
    height: 240,
    borderRadius: 4,
    backgroundColor: "#e5e5e5",
    justifyContent: "center",
    alignItems: "center",
  },
  fichaInfo: {
    flex: 1,
    gap: 6,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  infoLabel: {
    width: 90,
    fontFamily: "Helvetica-Bold",
    color: "#444444",
  },
  infoValue: {
    flex: 1,
  },
  synopsisHeading: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginTop: 16,
    marginBottom: 6,
  },
  synopsisText: {
    fontSize: 10,
    lineHeight: 1.5,
    textAlign: "justify",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#888888",
    borderTop: "0.5pt solid #dddddd",
    paddingTop: 6,
  },
});
