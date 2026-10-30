import "dotenv/config";
import cors from "cors";
import express from "express";
import { animeRouter } from "./routes/anime";

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  })
);
app.use(express.json());

app.use("/api", animeRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Backend escuchando en http://localhost:${port}`);
});
