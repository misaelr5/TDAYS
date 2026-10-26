"use client";

import { useEffect, useState } from "react";
import { useGlide } from "@/components/use-glide";
import type { TermsSection } from "./terms";
import styles from "./terms.module.css";

export function TermsIndex({ sections }: { sections: Pick<TermsSection, "id" | "title">[] }) {
  const [active, setActive] = useState(sections[0]?.id);
  const list = useGlide<HTMLElement>(active);

  useEffect(() => {
    let frame = 0;
    // The active section is the last one whose top has passed under the fixed header.
    const update = () => {
      frame = 0;
      const passed = sections.filter(section => (document.getElementById(section.id)?.getBoundingClientRect().top ?? Infinity) <= 120);
      const atBottom = innerHeight + scrollY >= document.documentElement.scrollHeight - 2;
      setActive((atBottom ? sections.at(-1)?.id : passed.at(-1)?.id) ?? sections[0]?.id ?? "");
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [sections]);

  return <nav className={styles.index} aria-label="Índice de términos y condiciones" ref={list}>
    <span className={styles.indexPill} data-glide-pill aria-hidden="true" />
    <p className={styles.indexTitle}>En esta página</p>
    <ol>
      {sections.map((section, index) => <li key={section.id}>
        <a
          href={`#${section.id}`}
          data-glide-item
          data-glide-active={active === section.id || undefined}
          aria-current={active === section.id ? "location" : undefined}
        >
          <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{section.title}
        </a>
      </li>)}
    </ol>
  </nav>;
}
