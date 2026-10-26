"use client";

import { useSyncExternalStore, type MouseEvent, type ReactNode } from "react";
import { useGlide } from "@/components/use-glide";
import styles from "./contact.module.css";

const intents = [
  { id: "consulta", label: "Mi viaje" },
  { id: "oficina", label: "La agencia" },
  { id: "experiencia", label: "Mi experiencia" },
] as const;
type Intent = typeof intents[number]["id"];

function currentIntent(): Intent {
  const hash = window.location.hash.slice(1);
  return intents.find(intent => intent.id === hash)?.id ?? "consulta";
}
function subscribe(listener: () => void) {
  window.addEventListener("hashchange", listener);
  window.addEventListener("popstate", listener);
  return () => {
    window.removeEventListener("hashchange", listener);
    window.removeEventListener("popstate", listener);
  };
}
const serverIntent = () => null;

/** Real anchors and :target keep every choice usable without JavaScript.
 * Hydration adds the navbar's glass pill and switches panels without a scroll jump.
 */
export function ContactExplorer({ children }: { children: ReactNode }) {
  const current = useSyncExternalStore<Intent | null>(subscribe, currentIntent, serverIntent);
  const nav = useGlide<HTMLElement>(current ?? "consulta");
  function choose(event: MouseEvent<HTMLAnchorElement>, id: Intent) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    window.history.replaceState(window.history.state, "", `#${id}`);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }

  return (
    <div className={styles.workspace} data-contact-explorer data-contact-intent={current ?? undefined}>
      <nav ref={nav} className={styles.switcher} aria-label="Elegí cómo podemos ayudarte">
        <span className={styles.pill} data-glide-pill aria-hidden="true" />
        {intents.map(intent => (
          <a key={intent.id} href={`#${intent.id}`} onClick={event => choose(event, intent.id)}
            aria-current={current === intent.id ? "location" : undefined}
            data-glide-item data-glide-active={(current ?? "consulta") === intent.id || undefined}>
            {intent.label}
          </a>
        ))}
      </nav>
      <div className={styles.panels}>{children}</div>
    </div>
  );
}
