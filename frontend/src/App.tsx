import { AnimeGrid } from "./components/AnimeGrid";
import { FilterSidebar } from "./components/FilterSidebar";
import { Header } from "./components/Header";
import { SelectionBar } from "./components/SelectionBar";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1 flex-col md:flex-row">
        <FilterSidebar />
        <main className="flex-1 p-4 pb-24">
          <AnimeGrid />
        </main>
      </div>
      <SelectionBar />
    </div>
  );
}
