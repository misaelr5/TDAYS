"use client";

import { useSyncExternalStore, type MouseEvent, type ReactNode } from "react";
import { Arrow } from "@/components/icons";
import styles from "./graduates.module.css";

type HelpTopic = { id: string; label: string; content: ReactNode };

function subscribe(listener: () => void) {
  window.addEventListener("hashchange", listener);
  window.addEventListener("popstate", listener);
  return () => {
    window.removeEventListener("hashchange", listener);
    window.removeEventListener("popstate", listener);
  };
}
const serverHash = () => null;
const currentHash = () => window.location.hash.slice(1);

/** Original category rail. Server-rendered content and real anchors also work
 * without JS; hydration adds current-link semantics and preserves scroll.
 */
export function GraduatesHelpCenter({ topics }: { topics: readonly HelpTopic[] }) {
  const hash = useSyncExternalStore(subscribe, currentHash, serverHash);
  const active = topics.find(topic => topic.id === hash)?.id ?? topics[0]?.id;

  function choose(event: MouseEvent<HTMLAnchorElement>, id: string) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (window.location.hash === `#${id}`) return;
    window.history.pushState(window.history.state, "", `#${id}`);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }

  return <div className={styles.helpCenter} id="egresados-preguntas" data-graduates-help data-help-ready={hash !== null || undefined}>
    <nav className={styles.helpNav} aria-label="Temas de la guía de viajes escolares">
      <p className={styles.helpNavLabel}>Elegí un tema</p>
      <ul>
        {topics.map(topic => <li key={topic.id}>
          <a className={styles.helpLink} href={`#${topic.id}`} onClick={event => choose(event, topic.id)}
            aria-current={hash !== null && active === topic.id ? "location" : undefined}>
            <span>{topic.label}</span><Arrow diagonal={false} />
          </a>
        </li>)}
      </ul>
    </nav>
    <div className={styles.helpPanels}>
      {topics.map(topic => <section className={styles.helpPanel} key={topic.id} id={topic.id}
        data-help-active={active === topic.id || undefined} aria-labelledby={`${topic.id}-title`}>
        <h4 id={`${topic.id}-title`}>{topic.label}</h4>
        {topic.content}
      </section>)}
    </div>
  </div>;
}
