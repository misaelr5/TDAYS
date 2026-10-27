"use client";

import Link from "next/link";
import { useEffect, useSyncExternalStore, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import { Arrow } from "@/components/icons";
import { useGlide } from "@/components/use-glide";
import type { graduates } from "./data";
import styles from "./graduates-explorer.module.css";

type Category = (typeof graduates.levels)[number];
export type GraduatesLevel = Omit<Category, "message" | "mediaSlot" | "caption"> & {
  caption: string;
  href: string;
  visual: ReactNode;
  photographic: boolean;
};

function subscribe(listener: () => void) {
  window.addEventListener("hashchange", listener);
  window.addEventListener("popstate", listener);
  return () => {
    window.removeEventListener("hashchange", listener);
    window.removeEventListener("popstate", listener);
  };
}
const serverLocation = () => null;
const currentLocation = () => window.location.href;

/** Real links work before hydration. JS adds tabs, arrow keys and selection
 * without scrolling. The query preserves the category across help anchors.
 * Media and editorial nodes come from the server without private metadata.
 */
export function GraduatesExplorer({ levels, expanded = false }: { levels: GraduatesLevel[]; expanded?: boolean }) {
  const location = useSyncExternalStore(subscribe, currentLocation, serverLocation);
  const prefix = expanded ? "escolares" : "inicio-escolares";
  const url = location ? new URL(location) : null;
  const hashCategory = levels.find(level => url?.hash === `#${prefix}-${level.id}`)?.id;
  const selected = hashCategory ?? url?.searchParams.get("escolar");
  const active = levels.find(level => level.id === selected)?.id ?? levels[0].id;
  const ready = location !== null;
  const choices = useGlide<HTMLDivElement>(active);

  useEffect(() => {
    if (!location || !hashCategory) return;
    const current = new URL(location);
    if (current.searchParams.get("escolar") === hashCategory) return;
    current.searchParams.set("escolar", hashCategory);
    window.history.replaceState(window.history.state, "", current);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, [location, hashCategory]);

  function select(id: string) {
    const next = new URL(window.location.href);
    next.searchParams.set("escolar", id);
    next.hash = `${prefix}-${id}`;
    if (next.href === window.location.href) return;
    window.history.pushState(window.history.state, "", next);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  function choose(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    select(id);
  }

  function navigate(event: KeyboardEvent<HTMLAnchorElement>, index: number) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? levels.length - 1
      : (index + (event.key === "ArrowRight" ? 1 : -1) + levels.length) % levels.length;
    document.getElementById(`${prefix}-${levels[next].id}-choice`)?.focus();
    select(levels[next].id);
  }

  return <div className={styles.explorer} data-graduates-explorer data-school-ready={ready || undefined} data-expanded={expanded || undefined}>
    <div className={styles.selector}>
      <span className={styles.prompt}>¿Con quién viajás?</span>
      <div ref={choices} className={styles.choices} role={ready ? "tablist" : "navigation"} aria-label="Categorías de viajes escolares">
        <span className={styles.pill} data-glide-pill aria-hidden="true" />
        {levels.map((level, index) => <a key={level.id} className={styles.choice}
          id={`${prefix}-${level.id}-choice`} href={`?escolar=${level.id}#${prefix}-${level.id}`}
          data-choice={level.id} data-glide-item data-glide-active={active === level.id || undefined} role={ready ? "tab" : undefined}
          aria-selected={ready ? active === level.id : undefined}
          aria-controls={ready ? `${prefix}-${level.id}` : undefined}
          tabIndex={ready && active !== level.id ? -1 : undefined}
          onClick={event => choose(event, level.id)} onKeyDown={event => navigate(event, index)}>
          {level.label}
        </a>)}
      </div>
    </div>
    <div className={styles.panels}>
      {levels.map(level => <article key={level.id} className={styles.panel} data-level={level.id}
        id={`${prefix}-${level.id}`} data-school-active={ready && active === level.id || undefined}
        role={ready ? "tabpanel" : undefined} aria-labelledby={ready ? `${prefix}-${level.id}-choice` : `${prefix}-${level.id}-title`}>
        <figure className={styles.visual} data-photographic={level.photographic || undefined}>
          <div className={styles.imageFrame}>{level.visual}</div>
          <figcaption className={styles.caption}>{level.caption}</figcaption>
        </figure>
        <div className={styles.copy}>
          <p className={styles.kicker}>{level.kicker}</p>
          <h3 id={`${prefix}-${level.id}-title`}>{level.title}</h3>
          <p className={styles.description}>{level.description}</p>
          {expanded && <p className={styles.detail}>{level.detail}</p>}
          <div className={styles.conversation}>
            <p>Para empezar, contanos</p>
            <ul>{level.topics.map(topic => <li key={topic}>{topic}</li>)}</ul>
          </div>
          <div className={styles.actions}>
            <a className={styles.primary} href={level.href} target="_blank" rel="noreferrer">{level.cta} <Arrow /></a>
            {!expanded && <Link className={styles.more} href={`/destinos?escolar=${level.id}#escolares-${level.id}`}>Conocer {level.id === "maestros" ? "El Maestrazo" : `la propuesta de ${level.id}`} <Arrow diagonal={false} /></Link>}
          </div>
        </div>
      </article>)}
    </div>
  </div>;
}
