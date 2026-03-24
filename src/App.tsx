import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { ReactQueryProvider } from "./providers/ReactQueryProvider";
import { Nav } from "./components/Nav";
import { Home } from "./pages/home/Home";
import { DependentQueries } from "./pages/dependent-queries/DependentQueries";
import { ParallelQueries } from "./pages/parallel-queries/ParallelQueries";
import { AdvancedMutations } from "./pages/advanced-mutations/AdvancedMutations";
import { Prefetching } from "./pages/prefetching/Prefetching";
import { SuspenseMode } from "./pages/suspense-mode/SuspenseMode";

export default function App() {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia("(max-width: 900px)").matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 900px)");
    const onChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);
    mediaQuery.addEventListener("change", onChange);
    setIsMobile(mediaQuery.matches);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  return (
    <BrowserRouter>
      <ReactQueryProvider>
        <Nav />
        <div style={{ paddingTop: isMobile ? 84 : 64 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dependent-queries" element={<DependentQueries />} />
            <Route path="/parallel-queries" element={<ParallelQueries />} />
            <Route path="/advanced-mutations" element={<AdvancedMutations />} />
            <Route path="/prefetching" element={<Prefetching />} />
            <Route path="/suspense-mode" element={<SuspenseMode />} />
          </Routes>
        </div>
      </ReactQueryProvider>
    </BrowserRouter>
  );
}
