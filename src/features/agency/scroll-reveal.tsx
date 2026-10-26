"use client";

import { useEffect } from "react";

/**
 * One observer for every `[data-reveal]` element inside `root`. Server markup is
 * fully visible; only elements still below the fold are hidden on mount, so
 * no-JS renders and above-the-fold content never flash. `[data-count]` numbers
 * count up once when their module enters.
 */
export function ScrollReveal({ root }: { root: string }) {
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
    for (const element of container.querySelectorAll<HTMLElement>("[data-reveal]")) {
      if (element.getBoundingClientRect().top < innerHeight * 0.92) continue;
      element.dataset.reveal = "pending";
      observer.observe(element);
    }
    return () => {
      observer.disconnect();
      frames.forEach(cancelAnimationFrame);
    };
  }, [root]);
  return null;
}
