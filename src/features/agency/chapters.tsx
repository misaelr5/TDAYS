"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { useGlide } from "@/components/use-glide";
import { decodeFragment } from "@/lib/fragment";
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
  const navigation = useRef(0);
  const activeTransition = useRef<ViewTransition | null>(null);
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

  function chapterFor(hash: string) {
    const id = decodeFragment(hash);
    const target = id ? document.getElementById(id) : null;
    const panel = target && root.current?.contains(target) ? target.closest<HTMLElement>("[data-chapter-panel]") : null;
    const index = chapters.findIndex(chapter => chapter.id === id || chapter.id === panel?.id);
    return { index, target };
  }

  // Selection is a projection of the URL, including a heading inside a hidden panel.
  function syncLocation(animate = true, focusTarget = false) {
    const version = ++navigation.current;
    activeTransition.current?.skipTransition();
    activeTransition.current = null;
    const found = chapterFor(location.hash);
    const index = Math.max(0, found.index);
    const from = latest.current;
    const top = stuckTop();
    latest.current = index;
    reveal(index);
    const stuck = top !== null && scrollY >= top - 1;
    const nested = found.index >= 0 && found.target?.id !== chapters[index].id;
    const settle = () => {
      if (version !== navigation.current || found.index < 0) return;
      if (nested) found.target?.scrollIntoView({ block: "start", behavior: "instant" });
      else if (top !== null) scrollTo({ top, behavior: animate && !reducedMotion() ? "smooth" : "instant" });
      if (focusTarget) document.getElementById(chapters[index].id)?.focus({ preventScroll: true });
    };
    if (index === from) { settle(); return; }
    const update = () => {
      if (version !== navigation.current) return;
      flushSync(() => setCurrent(index));
      // Already reading: the new chapter starts under the bar, like a fresh page.
      if (stuck) scrollTo({ top: top!, behavior: "instant" });
    };
    if (!animate || typeof document.startViewTransition !== "function" || reducedMotion()) { update(); settle(); return; }
    const html = document.documentElement;
    html.dataset.chapterTransition = index > from ? "forward" : "back";
    const transition = document.startViewTransition(update);
    // A newer URL may intentionally skip this visual effect. `ready` rejects
    // on cancellation even when the update and navigation themselves succeed.
    void transition.ready.catch(() => {});
    activeTransition.current = transition;
    transition.finished.catch(() => {}).then(() => {
      if (version !== navigation.current) return;
      activeTransition.current = null;
      delete html.dataset.chapterTransition;
      settle();
    });
  }

  function navigate(hash: string, focusTarget = false) {
    if (location.hash !== hash) history.pushState(history.state, "", hash);
    syncLocation(true, focusTarget);
  }

  useEffect(() => {
    const frame = requestAnimationFrame(() => syncLocation(false));
    const onHash = () => syncLocation(false);
    // Capture same-document anchors before Next Link handles its click. Native
    // history does not emit hashchange for pushState; this path synchronizes once.
    const onClick = (event: globalThis.MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!link || link.closest("[data-graduates-help]") || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
      const url = new URL(link.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search || chapterFor(url.hash).index < 0) return;
      event.preventDefault();
      navigate(url.hash, link.getAttribute("role") !== "tab");
    };
    addEventListener("hashchange", onHash);
    addEventListener("popstate", onHash);
    document.addEventListener("click", onClick, true);
    const cancelNavigation = () => {
      navigation.current++;
      activeTransition.current?.skipTransition();
      delete document.documentElement.dataset.chapterTransition;
    };
    return () => {
      cancelAnimationFrame(frame);
      cancelNavigation();
      removeEventListener("hashchange", onHash);
      removeEventListener("popstate", onHash);
      document.removeEventListener("click", onClick, true);
    };
    // `chapters` is static content; the listeners only need to exist once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function key(event: KeyboardEvent<HTMLDivElement>) {
    const focused = Array.from(bar.current?.querySelectorAll("[role=tab]") ?? []).indexOf(event.target as Element);
    const indexFrom = focused >= 0 ? focused : current;
    const moves: Record<string, number> = { ArrowRight: indexFrom + 1, ArrowLeft: indexFrom - 1, Home: 0, End: chapters.length - 1 };
    if (!(event.key in moves)) return;
    event.preventDefault();
    const index = (moves[event.key] + chapters.length) % chapters.length;
    navigate(`#${chapters[index].id}`);
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
      >{chapter.label}</a>)}
    </div>
    <div className={styles.panels}>
      {chapters.map((chapter, index) => <div
        key={chapter.id}
        id={chapter.id}
        role="tabpanel"
        tabIndex={-1}
        aria-labelledby={`tab-${chapter.id}`}
        data-chapter-hidden={current !== index || undefined}
        data-chapter-panel
      >{chapter.content}</div>)}
    </div>
    {/* Without JavaScript the tabs are plain anchors, so every chapter stays visible. */}
    <noscript><style>{"[data-chapter-panel][data-chapter-hidden]{display:block!important}"}</style></noscript>
  </div>;
}
