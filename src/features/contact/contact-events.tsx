"use client";

import { useEffect } from "react";
import { publicPaths } from "@/config/seo";
import { site } from "@/config/site";

type ContactEvent = "contact_whatsapp_click" | "destination_inquiry_click" | "contact_form_start" |
  "contact_form_whatsapp_open" | "phone_click" | "email_click" | "social_click";

/** Local event contract only. No cookies, persistence, provider or network requests.
 * Never forward link URLs, query/hash, form values or arbitrary DOM text.
 */
export function ContactEvents({ destinations }: { destinations: readonly string[] }) {
  useEffect(() => {
    const started = new WeakSet<HTMLFormElement>();
    function emit(event: ContactEvent, destination?: string) {
      const page = publicPaths.find(path => path === location.pathname);
      if (!page) return;
      window.dispatchEvent(new CustomEvent("traveldays:measurement", {
        detail: { event, page, ...(destination && destinations.includes(destination) ? { destination } : {}) },
      }));
    }
    function click(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || !(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;
      const url = new URL(link.href);
      if (url.origin === "https://wa.me" && url.pathname === `/${site.whatsapp}`) {
        emit("contact_whatsapp_click");
        const card = link.closest<HTMLElement>("[data-destination-consultation]");
        if (card && destinations.includes(card.id)) emit("destination_inquiry_click", card.id);
        if (link.closest("[data-inquiry-draft]")) emit("contact_form_whatsapp_open");
      } else if (url.protocol === "tel:") emit("phone_click");
      else if (url.protocol === "mailto:") emit("email_click");
      else if (link.href === site.instagram || link.href === site.facebook) emit("social_click");
    }
    function start(event: Event) {
      if (!(event.target instanceof Element) || !event.target.closest("input,select,textarea,button")) return;
      const form = event.target.closest<HTMLFormElement>("form[data-inquiry-form]");
      if (!form || started.has(form)) return;
      started.add(form);
      emit("contact_form_start");
    }
    document.addEventListener("click", click);
    document.addEventListener("focusin", start);
    // Safari pointer activation does not always focus a button.
    document.addEventListener("pointerdown", start);
    return () => {
      document.removeEventListener("click", click);
      document.removeEventListener("focusin", start);
      document.removeEventListener("pointerdown", start);
    };
  }, [destinations]);
  return null;
}
