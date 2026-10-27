"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { credentials } from "@/features/agency/data";
import styles from "./trust-cards.module.css";

type TrustCard = {
  title: string;
  subtitle: string;
  href: string;
  value?: number;
  prefix?: string;
  suffix?: string;
};

const cards: readonly TrustCard[] = [
  {
    title: `+${credentials.experienceYears} años`,
    subtitle: "Experiencia en turismo nacional e internacional",
    href: "/nosotros#historia",
    value: credentials.experienceYears,
    prefix: "+",
    suffix: " años",
  },
  {
    title: `N.º ${credentials.license}`,
    subtitle: "Legajo oficial de nuestra agencia",
    href: "/nosotros#backing-heading",
    value: Number(credentials.license),
    prefix: "N.º ",
  },
  {
    title: "Pioneros",
    subtitle: "En turismo estudiantil habilitado en Traslasierra",
    href: "/destinos#egresados",
  },
  {
    title: "Cara a cara",
    subtitle: "Atención personalizada en Villa Dolores",
    href: "/contacto",
  },
];

const COUNT_DURATION = 1400;
const STAGGER = 110;
const BAND_LEAD = 260;

export function TrustCards() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const band = root.current!;
    const elements = Array.from(band.querySelectorAll<HTMLAnchorElement>("[data-trust-card]"));
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches || !("IntersectionObserver" in window)) return;

    const items = elements.map((element, index) => ({
      element,
      card: cards[index],
      counter: element.querySelector<HTMLElement>("[data-trust-number]"),
      start: null as number | null,
      complete: false,
    }));
    let frame = 0;

    // Final values are present in SSR and the first client render. Only enhance
    // after hydration; without JS or observer support the content remains visible.
    band.dataset.reveal = "pending";
    items.forEach(({ element, counter }) => {
      element.dataset.reveal = "pending";
      if (counter) counter.textContent = "0";
    });

    const tick = (now: number) => {
      frame = 0;
      let running = false;
      for (const item of items) {
        if (item.start === null || item.complete) continue;
        running = true;
        if (now < item.start) continue;
        if (item.element.dataset.reveal !== "visible") item.element.dataset.reveal = "visible";
        const progress = Math.min((now - item.start) / COUNT_DURATION, 1);
        if (item.counter && item.card.value !== undefined) {
          const eased = 1 - (1 - progress) ** 3;
          const next = String(Math.floor(eased * item.card.value));
          if (item.counter.textContent !== next) item.counter.textContent = next;
        }
        if (progress === 1) item.complete = true;
      }
      if (running) frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const index = elements.indexOf(entry.target as HTMLAnchorElement);
        // The band settles first; its segments follow in a stagger.
        band.dataset.reveal = "visible";
        items[index].start = performance.now() + BAND_LEAD + index * STAGGER;
        observer.unobserve(entry.target);
      }
      if (!frame) frame = requestAnimationFrame(tick);
    }, { threshold: 0.15 });
    elements.forEach(element => observer.observe(element));

    const finish = () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      delete band.dataset.reveal;
      items.forEach(({ element, counter, card }) => {
        delete element.dataset.reveal;
        if (counter) counter.textContent = String(card.value);
      });
    };
    const onPreferenceChange = () => {
      if (preference.matches) finish();
    };
    preference.addEventListener("change", onPreferenceChange);
    return () => {
      finish();
      preference.removeEventListener("change", onPreferenceChange);
    };
  }, []);

  return (
    <div ref={root} className={styles.cards} aria-label="Conocé Travel Days" data-trust-cards>
      {cards.map(card => (
        <Link key={card.title} href={card.href} className={styles.card} data-trust-card>
          <strong className={styles.title}>
            <span className="sr-only">{card.title}</span>
            <span aria-hidden="true" className={styles.visualTitle}>
              <span className={styles.reserved}>{card.title}</span>
              <span className={styles.display}>
                {card.value === undefined ? card.title : <>{card.prefix}<span data-trust-number>{card.value}</span>{card.suffix}</>}
              </span>
            </span>
          </strong>
          <span className={styles.subtitle}>{card.subtitle}</span>
        </Link>
      ))}
    </div>
  );
}
