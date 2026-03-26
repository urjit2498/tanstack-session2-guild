import { createContext, useContext } from "react";

export type SectionId =
  | "home"
  | "dependent"
  | "parallel"
  | "mutations"
  | "prefetching"
  | "suspense";

const SECTION_BY_PATH: Record<string, SectionId> = {
  "/": "home",
  "/dependent-queries": "dependent",
  "/parallel-queries": "parallel",
  "/advanced-mutations": "mutations",
  "/prefetching": "prefetching",
  "/suspense-mode": "suspense",
};

export function sectionFromPath(pathname: string): SectionId {
  return SECTION_BY_PATH[pathname] ?? "home";
}

export type NavigationContextValue = {
  activeSection: SectionId;
  navigateTo: (to: string) => void;
};

export const NavigationContext = createContext<NavigationContextValue | null>(null);

export function useNavigation() {
  return useContext(NavigationContext);
}

