"use client";

import { useEffect, useRef } from "react";

/**
 * Slides one glass pill between the items of a group, like a shared-element view transition.
 * Markup: the container gets the ref, items carry `data-glide-item`, the resting item carries
 * `data-glide-active`, and the pill is a direct child with `data-glide-pill`.
 * `key` should change whenever the resting item changes (pathname, open panel…).
 */
export function useGlide<T extends HTMLElement>(key: unknown) {
  const ref = useRef<T>(null);
  const place = useRef<(target?: Element | null) => void>(() => {});

  useEffect(() => {
    const root = ref.current;
    const pill = root?.querySelector<HTMLElement>(":scope > [data-glide-pill]");
    if (!root || !pill) return;
    let hovered: Element | null = null;

    const move = (target: Element | null, instant: boolean) => {
      if (!(target instanceof HTMLElement)) { pill.dataset.visible = "false"; return; }
      // Offsets share the pill's coordinate space even under CSS `zoom`, where
      // getBoundingClientRect reports zoomed pixels and would misplace it.
      let x = 0, y = 0, node: HTMLElement | null = target;
      while (node && node !== root) {
        x += node.offsetLeft; y += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
        if (node && node !== root) { x += node.clientLeft; y += node.clientTop; }
      }
      if (node !== root) { pill.dataset.visible = "false"; return; }
      const jump = instant || pill.dataset.visible !== "true";
      if (jump) pill.style.transition = "none";
      pill.style.width = `${target.offsetWidth}px`;
      pill.style.height = `${target.offsetHeight}px`;
      pill.style.transform = `translate(${x}px, ${y}px)`;
      if (jump) { void pill.offsetWidth; pill.style.transition = ""; }
      pill.dataset.visible = "true";
    };
    const rest = (instant = false) => move(hovered ?? root.querySelector("[data-glide-active]"), instant);
    place.current = target => move(target ?? root.querySelector("[data-glide-active]"), false);

    const over = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      // Gaps between items (the container itself) keep the pill where it is; other controls release it.
      if (event.target === root) return;
      const item = (event.target as Element).closest("[data-glide-item]");
      const next = item && root.contains(item) ? item : null;
      if (next !== hovered) { hovered = next; rest(); }
    };
    const leave = () => { hovered = null; rest(); };
    const resize = new ResizeObserver(() => rest(true));

    rest(true);
    root.dataset.glideReady = "";
    root.addEventListener("pointerover", over);
    root.addEventListener("pointerleave", leave);
    resize.observe(root);
    return () => {
      root.removeEventListener("pointerover", over);
      root.removeEventListener("pointerleave", leave);
      resize.disconnect();
    };
  }, []);

  useEffect(() => { place.current(); }, [key]);

  return ref;
}
