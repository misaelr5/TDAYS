"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Arrow } from "@/components/icons";
import { goToDestination } from "@/features/destinations/destination-transition";
import styles from "./apple-cards-carousel.module.css";

export type CarouselItem = {
  slug: string;
  title: string;
  category: string | null;
  location?: string;
  href: string;
  visual: ReactNode;
};

type ScrollState = { previous: boolean; next: boolean; current: number };

// Pointer intent delays: a fast sweep across the row settles on the last card
// instead of expanding every card it crosses.
const ENTER_DELAY = 70;
const LEAVE_DELAY = 320;

/**
 * Destination gallery. On wide fine-pointer screens all cards fit in one row and
 * the active card grows via flex-grow (no scroll, so expansion can never move the
 * rail). Elsewhere it is a scroll-snap carousel with fixed card widths.
 */
export function Carousel({ items }: { items: CarouselItem[] }) {
  const root = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [active, setActive] = useState(0);
  const router = useRouter();
  const [state, setState] = useState<ScrollState>({ previous: false, next: false, current: 0 });

  useEffect(() => {
    const rail = viewport.current;
    const list = track.current;
    if (!rail || !list) return;

    const measure = () => {
      const maximum = rail.scrollWidth - rail.clientWidth;
      const slides = Array.from(list.children) as HTMLElement[];
      const start = rail.getBoundingClientRect().left + (Number.parseFloat(getComputedStyle(list).paddingInlineStart) || 0);
      const current = Math.max(0, slides.findIndex(slide => slide.getBoundingClientRect().right > start + 2));
      const next = { previous: rail.scrollLeft > 2, next: rail.scrollLeft < maximum - 2, current };
      setState(previous => previous.previous === next.previous && previous.next === next.next && previous.current === next.current ? previous : next);
    };

    measure();
    rail.addEventListener("scroll", measure, { passive: true });
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    observer?.observe(rail);
    window.addEventListener("resize", measure);
    return () => {
      rail.removeEventListener("scroll", measure);
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [items.length]);

  // One-shot entrance. Only hides content that is still off screen, so SSR and
  // no-JS renders stay visible and nothing flashes.
  useEffect(() => {
    const element = root.current;
    if (!element || typeof IntersectionObserver === "undefined" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (element.getBoundingClientRect().top < innerHeight * 0.9) return;
    element.dataset.reveal = "pending";
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      element.dataset.reveal = "visible";
      observer.disconnect();
    }, { threshold: 0.12 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  function schedule(index: number, delay: number) {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setActive(index), delay);
  }

  function move(direction: -1 | 1) {
    const rail = viewport.current;
    const slides = track.current?.children;
    if (!rail || !slides?.length) return;
    const first = slides[0].getBoundingClientRect();
    const second = slides[1]?.getBoundingClientRect();
    const step = second ? second.left - first.left : first.width;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    rail.scrollBy({ left: direction * step, behavior: reduced ? "instant" : "smooth" });
  }

  function focusCard(index: number) {
    const links = track.current?.querySelectorAll<HTMLAnchorElement>("a");
    links?.[Math.max(0, Math.min(items.length - 1, index))]?.focus();
  }

  function navigate(event: KeyboardEvent<HTMLDivElement>) {
    const rail = viewport.current;
    if (!rail || event.altKey || event.ctrlKey || event.metaKey) return;
    const scrollable = rail.scrollWidth - rail.clientWidth > 2;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      const direction = event.key === "ArrowLeft" ? -1 : 1;
      if (scrollable) move(direction);
      else focusCard(active + direction);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      if (scrollable) rail.scrollTo({ left: event.key === "Home" ? 0 : rail.scrollWidth, behavior: reduced ? "instant" : "smooth" });
      else focusCard(event.key === "Home" ? 0 : items.length - 1);
    }
  }

  if (!items.length) return null;
  const total = String(items.length).padStart(2, "0");

  return <div ref={root} className={styles.carousel} role="region" aria-roledescription="carrusel" aria-label="Destinos destacados" data-destination-carousel>
    <div ref={viewport} className={styles.viewport} role="group" tabIndex={0} onKeyDown={navigate} aria-label="Explorá los destinos con las flechas del teclado" data-carousel-viewport>
      <ul ref={track} className={styles.track} onPointerLeave={event => { if (event.pointerType === "mouse") schedule(0, LEAVE_DELAY); }}>
        {items.map((item, index) => <li
          key={item.slug}
          className={styles.slide}
          data-active={index === active || undefined}
          style={{ "--i": index } as CSSProperties}
          onPointerEnter={event => { if (event.pointerType === "mouse") schedule(index, ENTER_DELAY); }}
        >
          <Link
            className={styles.card}
            href={item.href}
            aria-label={`Explorar ${item.title} en el catálogo`}
            data-destination-preview
            data-destination-slug={item.slug}
            onFocus={() => { clearTimeout(timer.current); setActive(index); }}
            // The photo travels into its catalog card (see destination-transition).
            onClick={event => goToDestination(event, router, item.slug, event.currentTarget.querySelector("[data-destination-photo]"))}
          >
            <div className={styles.visual} aria-hidden="true" data-destination-photo>{item.visual}</div>
            <div className={styles.shade} aria-hidden="true" />
            <span className={styles.rail} aria-hidden="true">{item.title}</span>
            <div className={styles.copy}>
              <p className={styles.meta}>
                {item.category && <span className={styles.category}>{item.category}</span>}
                {item.location && <span className={styles.location}>{item.location}</span>}
              </p>
              <h3>{item.title}</h3>
              <span className={styles.cta}>Explorar destino <Arrow /></span>
            </div>
          </Link>
        </li>)}
      </ul>
    </div>
    <div className={styles.controls}>
      <span className={styles.counter} aria-hidden="true">{String(state.current + 1).padStart(2, "0")} <span>/ {total}</span></span>
      <span className="sr-only" role="status" aria-live="polite">Destino {state.current + 1} de {items.length}</span>
      <button type="button" disabled={!state.previous} onClick={() => move(-1)} aria-label="Destinos anteriores"><Arrow diagonal={false} /></button>
      <button type="button" disabled={!state.next} onClick={() => move(1)} aria-label="Destinos siguientes"><Arrow diagonal={false} /></button>
    </div>
    <noscript><style>{`.${styles.controls}{display:none!important}`}</style></noscript>
  </div>;
}
