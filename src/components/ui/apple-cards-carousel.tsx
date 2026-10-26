"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Arrow } from "@/components/icons";
import styles from "./apple-cards-carousel.module.css";

export type CarouselItem = {
  slug: string;
  title: string;
  category: string | null;
  href: string;
  visual: ReactNode;
};

type ScrollState = { previous: boolean; next: boolean; current: number };

/** Apple Cards composition adapted to destination links and server-rendered media. */
export function Carousel({ items }: { items: CarouselItem[] }) {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const reduced = useReducedMotion();
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
    observer?.observe(list);
    window.addEventListener("resize", measure);
    return () => {
      rail.removeEventListener("scroll", measure);
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [items.length]);

  function move(direction: -1 | 1) {
    const rail = viewport.current;
    const slides = track.current?.children;
    if (!rail || !slides?.length) return;
    const first = slides[0].getBoundingClientRect();
    const second = slides[1]?.getBoundingClientRect();
    const step = second ? second.left - first.left : first.width;
    rail.scrollBy({ left: direction * step, behavior: reduced ? "instant" : "smooth" });
  }

  function navigate(event: KeyboardEvent<HTMLDivElement>) {
    const rail = viewport.current;
    if (!rail || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      move(event.key === "ArrowLeft" ? -1 : 1);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      rail.scrollTo({ left: event.key === "Home" ? 0 : rail.scrollWidth, behavior: reduced ? "instant" : "smooth" });
    }
  }

  if (!items.length) return null;

  return <div className={styles.carousel} role="region" aria-roledescription="carrusel" aria-label="Destinos destacados" data-destination-carousel>
    <div ref={viewport} className={styles.viewport} role="group" tabIndex={0} onKeyDown={navigate} aria-label="Explorá los destinos con las flechas del teclado" data-carousel-viewport>
      <ul ref={track} className={styles.track}>
        {items.map(item => <motion.li key={item.slug} className={styles.slide} initial={false} whileHover={reduced ? undefined : { y: -6 }} transition={{ duration: reduced ? 0 : .22 }}>
          <Link className={styles.card} href={item.href} aria-label={`Explorar ${item.title} en el catálogo`} data-destination-preview data-destination-slug={item.slug}>
            <div className={styles.visual} aria-hidden="true">{item.visual}</div>
            <div className={styles.shade} aria-hidden="true" />
            <div className={styles.copy}>{item.category && <span className={styles.category}>{item.category}</span>}<h3>{item.title}</h3></div>
            <span className={styles.cardArrow} aria-hidden="true"><Arrow /></span>
          </Link>
        </motion.li>)}
      </ul>
    </div>
    <div className={styles.controls}>
      <span className="sr-only" role="status" aria-live="polite">Destino {state.current + 1} de {items.length}</span>
      <button type="button" disabled={!state.previous} onClick={() => move(-1)} aria-label="Destinos anteriores"><Arrow diagonal={false} /></button>
      <button type="button" disabled={!state.next} onClick={() => move(1)} aria-label="Destinos siguientes"><Arrow diagonal={false} /></button>
    </div>
    <noscript><style>{`.${styles.controls}{display:none!important}`}</style></noscript>
  </div>;
}
