"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * One observer for every `[data-reveal]` element inside `root`. Server markup is
 * fully visible. Existing reveals skip the initial viewport; soft blocks are
 * registered even during route scroll restoration, then revealed by visibility.
 * No-JS renders remain visible. `[data-count]` numbers
 * count up once when their module enters.
 */
export function ScrollReveal({ root, selector = "[data-reveal]:not([data-soft-reveal])" }: { root: string; selector?: string }) {
  const pathname = usePathname();
  useEffect(() => {
    const container = document.querySelector(root);
    if (!container || typeof IntersectionObserver === "undefined" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const frames: number[] = [];
    const count = (element: HTMLElement) => {
      for (const number of element.querySelectorAll<HTMLElement>("[data-count]")) {
        const target = Number(number.dataset.count);
        if (!Number.isFinite(target)) continue;
        const start = performance.now();
        const step = (now: number) => {
          const progress = Math.min(1, (now - start) / 1100);
          number.textContent = String(Math.round(target * (1 - (1 - progress) ** 3)));
          if (progress < 1) frames.push(requestAnimationFrame(step));
        };
        frames.push(requestAnimationFrame(step));
      }
    };
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target as HTMLElement;
        element.dataset.reveal = "visible";
        count(element);
        observer.unobserve(element);
      }
    }, { threshold: 0.18, rootMargin: "0px 0px -40px 0px" });
    const elements = new Set<HTMLElement>();
    const track = (element: HTMLElement) => {
      if (elements.has(element)) return;
      elements.add(element);
      const rect = element.getBoundingClientRect();
      if (!element.hasAttribute("data-soft-reveal") && rect.top < innerHeight * 0.92) return;
      element.dataset.reveal = "pending";
      observer.observe(element);
    };
    let scanFrame = 0;
    const scan = () => {
      cancelAnimationFrame(scanFrame);
      // Let route styles and Next's scroll restoration settle before measuring.
      scanFrame = requestAnimationFrame(() => {
        scanFrame = requestAnimationFrame(() => container.querySelectorAll<HTMLElement>(selector).forEach(track));
      });
    };
    scan();
    // App Router can commit the pathname before its streamed page content.
    // Observe new blocks too; attribute changes from the animation are ignored.
    const additions = new MutationObserver(records => {
      for (const record of records) for (const node of record.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;
        if (node.matches(selector) || node.querySelector(selector)) scan();
      }
    });
    additions.observe(container, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      additions.disconnect();
      cancelAnimationFrame(scanFrame);
      frames.forEach(cancelAnimationFrame);
      for (const element of elements) {
        if (element.dataset.reveal === "pending") delete element.dataset.reveal;
      }
    };
  }, [root, selector, pathname]);
  return null;
}
