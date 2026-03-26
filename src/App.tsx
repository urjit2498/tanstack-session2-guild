import { useEffect, useMemo, useState } from "react";
import { ReactQueryProvider } from "./providers/ReactQueryProvider";
import { Nav } from "./components/Nav";
import { Home } from "./pages/home/Home";
import { DependentQueries } from "./pages/dependent-queries/DependentQueries";
import { ParallelQueries } from "./pages/parallel-queries/ParallelQueries";
import { AdvancedMutations } from "./pages/advanced-mutations/AdvancedMutations";
import { Prefetching } from "./pages/prefetching/Prefetching";
import { SuspenseMode } from "./pages/suspense-mode/SuspenseMode";
import { NavigationContext, sectionFromPath, type SectionId } from "./navigation/NavigationContext";

export default function App() {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia("(max-width: 900px)").matches);
  const [activeSection, setActiveSection] = useState<SectionId>(() =>
    sectionFromPath(window.location.pathname),
  );

  useEffect(() => {
    // Keep a single URL in the address bar (no router). If the user lands on another path,
    // normalize back to "/" while still rendering the right section.
    if (window.location.pathname !== "/") {
      window.history.replaceState(null, "", "/");
    }
  }, []);

  const navigateTo = (to: string) => {
    const next = sectionFromPath(to);
    setActiveSection(next);
    // Always keep the main URL.
    if (window.location.pathname !== "/") {
      window.history.replaceState(null, "", "/");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sectionNode = useMemo(() => {
    switch (activeSection) {
      case "dependent":
        return <DependentQueries />;
      case "parallel":
        return <ParallelQueries />;
      case "mutations":
        return <AdvancedMutations />;
      case "prefetching":
        return <Prefetching />;
      case "suspense":
        return <SuspenseMode />;
      case "home":
      default:
        return <Home />;
    }
  }, [activeSection]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 900px)");
    const onChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);
    mediaQuery.addEventListener("change", onChange);
    setIsMobile(mediaQuery.matches);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  return (
    <ReactQueryProvider>
      <NavigationContext.Provider value={{ activeSection, navigateTo }}>
        <Nav />
      <div style={{ paddingTop: isMobile ? 84 : 64 }}>
        {sectionNode}
      </div>
      </NavigationContext.Provider>
    </ReactQueryProvider>
  );
}
