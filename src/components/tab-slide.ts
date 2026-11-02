"use client";

import { flushSync } from "react-dom";

const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
let latest = 0;

/**
 * Swaps a tab group's panels with the sideways slide the Nosotros chapters use:
 * the old panel leaves toward one side and the new one arrives from the other.
 * The panels element opts in with `data-tab-slide-panels` (one per page); styles live
 * in globals.css. Without view transitions or with reduced motion it just updates.
 */
export function slideTabs(direction: "forward" | "back" | null, update: () => void) {
  if (!direction || typeof document.startViewTransition !== "function" || reducedMotion()) { update(); return; }
  const root = document.documentElement;
  const id = ++latest;
  root.dataset.tabSlide = direction;
  const transition = document.startViewTransition(() => flushSync(update));
  // A quicker second click skips this transition; the state update still applies.
  void transition.ready.catch(() => {});
  void transition.finished.catch(() => {}).then(() => { if (id === latest) delete root.dataset.tabSlide; });
}

export const slideDirection = (from: number, to: number) => to === from || from < 0 || to < 0 ? null : to > from ? "forward" : "back";
