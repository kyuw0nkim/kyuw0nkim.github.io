import { useSyncExternalStore } from "react";
import type { PointerEvent } from "react";
import { useLocation } from "react-router-dom";
import type { Mode, ModeFilter } from "../data/types";

/**
 * Transient interaction state shared by the DOM UI and the 3D scene
 * (which renders in its own React root, so a tiny external store is used
 * instead of context). Navigation state — which view and which mode is
 * selected — lives in the URL; see `useRouteState`.
 */
export interface InteractionState {
  /** Mode being previewed by hovering/focusing a scene object, a button or a list item. */
  hover: Mode | null;
  /** Which scene object is hovered (characters/table/laptop), for the 3D highlight. */
  hoverObject: string | null;
  /** Project being previewed in the list. */
  previewId: string | null;
  /** Vertical centre (viewport px) of the previewed list row. */
  previewY: number;
}

let state: InteractionState = { hover: null, hoverObject: null, previewId: null, previewY: 0 };
const listeners = new Set<() => void>();

export const portfolioStore = {
  get: () => state,
  set(patch: Partial<InteractionState>) {
    const next = { ...state, ...patch };
    if ((Object.keys(patch) as (keyof InteractionState)[]).every((k) => next[k] === state[k])) return;
    state = next;
    listeners.forEach((l) => l());
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};

export function usePortfolioStore<T>(selector: (s: InteractionState) => T): T {
  return useSyncExternalStore(portfolioStore.subscribe, () => selector(portfolioStore.get()));
}

export const setHover = (hover: Mode | null, hoverObject: string | null = null) =>
  portfolioStore.set({ hover, hoverObject });

export type View = "intro" | "explore" | "about" | "contact" | "project" | "other";

export interface RouteState {
  view: View;
  /** List filter while exploring ("all" for /works). */
  filter: ModeFilter | null;
  /** The explicitly selected mode, if any. Stops the headline from alternating. */
  selected: Mode | null;
}

export function routeStateFor(pathname: string): RouteState {
  if (pathname === "/" || pathname === "") return { view: "intro", filter: null, selected: null };
  if (pathname === "/tracing") return { view: "explore", filter: "tracing", selected: "tracing" };
  if (pathname === "/shaping") return { view: "explore", filter: "shaping", selected: "shaping" };
  if (pathname === "/works") return { view: "explore", filter: "all", selected: null };
  if (pathname.startsWith("/works/")) return { view: "project", filter: null, selected: null };
  if (pathname === "/about") return { view: "about", filter: null, selected: null };
  if (pathname === "/contact") return { view: "contact", filter: null, selected: null };
  return { view: "other", filter: null, selected: null };
}

export function useRouteState(): RouteState {
  return routeStateFor(useLocation().pathname);
}

export const pathForFilter = (filter: ModeFilter) => (filter === "all" ? "/works" : `/${filter}`);

/** Hover previews only for real pointers; touch goes straight to navigation. */
export function previewHandlers(mode: Mode | null) {
  const on = (e: PointerEvent) => e.pointerType !== "touch" && setHover(mode);
  const off = (e: PointerEvent) => e.pointerType !== "touch" && setHover(null);
  return {
    onPointerEnter: on,
    onPointerLeave: off,
    onFocus: () => setHover(mode),
    onBlur: () => setHover(null),
  };
}
