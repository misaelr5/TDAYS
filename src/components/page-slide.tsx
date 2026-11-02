"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";
import { slideDirection } from "./tab-slide";

// Menu order: moving right in it slides the page left, like switching macOS Spaces.
const ROUTES = ["/", "/destinos", "/nosotros", "/contacto", "/terminos"];
const WAIT_LIMIT = 1500;
const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Slides the whole page sideways between the site's routes; the header stays put.
 * Listens for link clicks in the capture phase, before next/link handles them, and
 * then navigates inside a view transition that waits for the new route to commit.
 * Links inside the menu dialog or marked `data-page-slide="off"` (destination morphs)
 * keep their own transition. Browser back/forward and unsupported browsers navigate
 * as usual.
 */
export function PageSlide() {
  const router = useRouter();
  const pathname = usePathname();
  const arrived = useRef<(() => void) | null>(null);

  // The new route is in the DOM: let the browser capture it.
  useLayoutEffect(() => { arrived.current?.(); }, [pathname]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(link instanceof HTMLAnchorElement) || (link.target && link.target !== "_self") || link.hasAttribute("download")) return;
      if (link.closest("dialog, [data-page-slide='off']")) return;
      const url = new URL(link.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      const direction = slideDirection(ROUTES.indexOf(location.pathname), ROUTES.indexOf(url.pathname));
      if (!direction || typeof document.startViewTransition !== "function" || reducedMotion()) return;
      event.preventDefault();
      const root = document.documentElement;
      root.dataset.pageSlide = direction;
      const transition = document.startViewTransition(() => new Promise<void>(resolve => {
        const done = () => { clearTimeout(timer); arrived.current = null; resolve(); };
        const timer = setTimeout(done, WAIT_LIMIT);
        arrived.current = done;
        router.push(url.pathname + url.search + url.hash);
      }));
      void transition.ready.catch(() => {});
      void transition.finished.catch(() => {}).then(() => { delete root.dataset.pageSlide; });
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return null;
}
