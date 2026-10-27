"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { useGlide } from "@/components/use-glide";
import styles from "./chapters.module.css";

export type Chapter = { id: string; label: string; content: ReactNode };

const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Nosotros as four small pages: a sticky glass tab bar (the navbar's sliding pill)
 * swaps one chapter in place. Where view transitions exist the chapters slide
 * sideways in the direction of travel. `#id` links still reach their chapter.
 */
export function Chapters({ chapters, label }: { chapters: Chapter[]; label: string }) {
  const [current, setCurrent] = useState(0);
  const latest = useRef(0);
  const root = useRef<HTMLDivElement>(null);
  const bar = useGlide<HTMLDivElement>(current);

  // Where the page sits when the bar is stuck right above the chapter.
  function stuckTop() {
    const wrapper = root.current, tabs = bar.current;
    if (!wrapper || !tabs) return null;
    return wrapper.getBoundingClientRect().top + scrollY - parseFloat(getComputedStyle(tabs).top || "0");
  }

  function reveal(index: number) {
    const tabs = bar.current;
    const tab = tabs?.querySelectorAll<HTMLElement>("[role=tab]")[index];
    if (!tabs || !tab) return;
    // Keeps the active tab visible when the bar scrolls sideways on phones.
    if (tab.offsetLeft < tabs.scrollLeft || tab.offsetLeft + tab.offsetWidth > tabs.scrollLeft + tabs.clientWidth) {
      tabs.scrollTo({ left: tab.offsetLeft - (tabs.clientWidth - tab.offsetWidth) / 2, behavior: reducedMotion() ? "instant" : "smooth" });
    }
  }

  function select(index: number, animate = true) {
    const from = latest.current;
    const top = stuckTop();
    latest.current = index;
    history.replaceState(history.state, "", `#${chapters[index].id}`);
    reveal(index);
    if (index === from) {
      if (top !== null) scrollTo({ top, behavior: animate && !reducedMotion() ? "smooth" : "instant" });
      return;
    }
    const stuck = top !== null && scrollY >= top - 1;
    const update = () => {
      flushSync(() => setCurrent(index));
      // Already reading: the new chapter starts under the bar, like a fresh page.
      if (stuck) scrollTo({ top: top!, behavior: "instant" });
    };
    const settle = () => { if (!stuck && top !== null) scrollTo({ top, behavior: animate && !reducedMotion() ? "smooth" : "instant" }); };
    if (!animate || typeof document.startViewTransition !== "function" || reducedMotion()) { update(); settle(); return; }
    const html = document.documentElement;
    html.dataset.chapterTransition = index > from ? "forward" : "back";
    document.startViewTransition(update).finished.finally(() => {
      delete html.dataset.chapterTransition;
      settle();
    });
  }

  useEffect(() => {
    const find = (hash: string) => chapters.findIndex(chapter => `#${chapter.id}` === decodeURIComponent(hash));
    const initial = find(location.hash);
    if (initial > 0) select(initial, false);
    else if (initial === 0) scrollTo({ top: stuckTop() ?? 0, behavior: "instant" });
    const onHash = () => { const index = find(location.hash); if (index >= 0) select(index); };
    // In-page links to a chapter (e.g. "Conocé la historia") open it instead of jumping.
    const onClick = (event: globalThis.MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element).closest<HTMLAnchorElement>("a[href^='#']");
      const index = link ? find(link.getAttribute("href")!) : -1;
      if (index < 0 || link!.getAttribute("role") === "tab") return;
      event.preventDefault();
      select(index);
    };
    addEventListener("hashchange", onHash);
    document.addEventListener("click", onClick);
    return () => {
      removeEventListener("hashchange", onHash);
      document.removeEventListener("click", onClick);
    };
    // `chapters` is static content; the listeners only need to exist once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function click(event: MouseEvent<HTMLAnchorElement>, index: number) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    select(index);
  }

  function key(event: KeyboardEvent<HTMLDivElement>) {
    const moves: Record<string, number> = { ArrowRight: current + 1, ArrowLeft: current - 1, Home: 0, End: chapters.length - 1 };
    if (!(event.key in moves)) return;
    event.preventDefault();
    const index = (moves[event.key] + chapters.length) % chapters.length;
    select(index);
    bar.current?.querySelectorAll<HTMLElement>("[role=tab]")[index]?.focus();
  }

  return <div ref={root} className={styles.chapters}>
    <div ref={bar} className={styles.tabs} role="tablist" aria-label={label} onKeyDown={key}>
      <span className={styles.pill} data-glide-pill aria-hidden="true" />
      {chapters.map((chapter, index) => <a
        key={chapter.id}
        id={`tab-${chapter.id}`}
        href={`#${chapter.id}`}
        role="tab"
        aria-selected={current === index}
        aria-controls={chapter.id}
        tabIndex={current === index ? 0 : -1}
        data-glide-item
        data-glide-active={current === index || undefined}
        onClick={event => click(event, index)}
      >{chapter.label}</a>)}
    </div>
    <div className={styles.panels}>
      {chapters.map((chapter, index) => <div
        key={chapter.id}
        id={chapter.id}
        role="tabpanel"
        aria-labelledby={`tab-${chapter.id}`}
        hidden={current !== index}
        data-chapter-panel
      >{chapter.content}</div>)}
    </div>
    {/* Without JavaScript the tabs are plain anchors, so every chapter stays visible. */}
    <noscript><style>{"[data-chapter-panel][hidden]{display:block!important}"}</style></noscript>
  </div>;
}
