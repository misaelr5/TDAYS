"use client";

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import styles from "./expand-group.module.css";

export type ExpandItem = { key: string; content: ReactNode };

// Must match the breakpoint in expand-group.module.css.
const STACKED = "(max-width: 767px)";

/**
 * A list whose items become collapsible strips on phones: one strip is open at a
 * time; the first tap opens a strip and the next one follows its link. Wider
 * screens keep whatever layout `className` gives the list. Content stays in the
 * DOM, so nothing is hidden from assistive technology.
 */
export function ExpandGroup({ items, className, label }: { items: ExpandItem[]; className?: string; label?: string }) {
  const [current, setCurrent] = useState(0);
  const root = useRef<HTMLUListElement>(null);
  const pointer = useRef("");

  useEffect(() => {
    const list = root.current;
    if (!list) return;
    // Opens the strip holding element `id` without animating. A hash link re-anchors
    // only when the opening pushed the target out of view; `expand-group:open`
    // (dispatched by callers that position the target themselves) never scrolls.
    const open = (id: string, anchor: boolean) => {
      const target = id ? document.getElementById(id) : null;
      const item = target?.closest<HTMLElement>("[data-expand-index]");
      if (!target || !item || !list.contains(item)) return;
      list.dataset.instant = "";
      setCurrent(Number(item.dataset.expandIndex));
      requestAnimationFrame(() => {
        const top = target.getBoundingClientRect().top;
        if (anchor && (top < 0 || top > innerHeight * .6)) target.scrollIntoView({ block: "start", behavior: "instant" });
        requestAnimationFrame(() => { delete list.dataset.instant; });
      });
    };
    const fromHash = () => open(decodeURIComponent(location.hash.slice(1)), true);
    const fromEvent = (event: Event) => open(String((event as CustomEvent<string>).detail ?? ""), false);
    const frame = requestAnimationFrame(fromHash);
    window.addEventListener("hashchange", fromHash);
    window.addEventListener("expand-group:open", fromEvent);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", fromHash);
      window.removeEventListener("expand-group:open", fromEvent);
    };
  }, []);

  function tap(event: MouseEvent<HTMLLIElement>, index: number) {
    const touch = pointer.current === "touch";
    pointer.current = "";
    if (touch && current !== index && matchMedia(STACKED).matches) { event.preventDefault(); setCurrent(index); }
  }

  return <><ul ref={root} className={`${styles.group} ${className ?? ""}`} aria-label={label} data-expand-group>
    {items.map((item, index) => <li
      key={item.key}
      className={styles.item}
      style={{ "--i": index } as CSSProperties}
      data-expand-index={index}
      data-current={current === index || undefined}
      onPointerDown={event => { pointer.current = event.pointerType; }}
      onFocus={() => { if (pointer.current !== "touch") setCurrent(index); }}
      onClickCapture={event => tap(event, index)}
    >{item.content}</li>)}
  </ul>
  {/* Without JavaScript nothing can open, so every strip stays open. */}
  <noscript><style>{`@media ${STACKED} { [data-expand-group] > li { --open: 1 !important; height: var(--tile-open) !important; } }`}</style></noscript>
  </>;
}
