"use client";

import type { MouseEvent } from "react";

type Router = { push: (href: string, options?: { scroll?: boolean }) => void };

// One shared name: only one destination travels at a time.
const NAME = "destination-photo";
const WAIT_LIMIT = 1500;

const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

function waitFor<T>(find: () => T | null, limit = WAIT_LIMIT) {
  return new Promise<T | null>(resolve => {
    const start = performance.now();
    const check = () => {
      const found = find();
      if (found || performance.now() - start > limit) resolve(found);
      else setTimeout(check, 16);
    };
    check();
  });
}

/** Opens the destination's card (mobile strip) and centres it, without animating. */
async function present(target: HTMLElement) {
  window.dispatchEvent(new CustomEvent("expand-group:open", { detail: target.id }));
  // Lets React commit the strip opening before the card is measured.
  await new Promise(resolve => setTimeout(resolve, 34));
  target.scrollIntoView({ block: "center", behavior: "instant" });
}

function highlight(target: HTMLElement) {
  delete target.dataset.arrived;
  void target.offsetWidth;
  target.dataset.arrived = "";
  target.addEventListener("animationend", () => { delete target.dataset.arrived; }, { once: true });
}

/**
 * Moves from a destination preview to its catalog card at /destinos#slug. Where
 * view transitions are supported, `source` travels into the card's photo; the
 * card is centred (and its mobile strip opened) before the new state is captured,
 * so both ends of the morph are on screen. Modified clicks keep the native link.
 */
export function goToDestination(event: MouseEvent<HTMLAnchorElement>, router: Router, slug: string, source: HTMLElement | null, kind: "photo" | "chip" = "photo") {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  const href = `/destinos#${slug}`;
  const find = () => document.getElementById(slug);

  if (typeof document.startViewTransition !== "function" || reducedMotion() || !source) {
    router.push(href);
    void waitFor(find).then(target => { if (target) highlight(target); });
    return;
  }

  const root = document.documentElement;
  let photo: HTMLElement | null = null;
  source.style.viewTransitionName = NAME;
  root.dataset.destinationTransition = kind;
  const transition = document.startViewTransition(async () => {
    source.style.viewTransitionName = "";
    router.push(href, { scroll: false });
    const target = await waitFor(find);
    if (!target) return;
    await present(target);
    photo = target.querySelector<HTMLElement>("[data-destination-photo]");
    if (photo) photo.style.viewTransitionName = NAME;
  });
  transition.finished.finally(() => {
    source.style.viewTransitionName = "";
    if (photo) photo.style.viewTransitionName = "";
    delete root.dataset.destinationTransition;
    const target = find();
    if (target) highlight(target);
  });
}
