"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { site, whatsappUrl } from "@/config/site";
import { Arrow } from "./icons";
import { navigation } from "@/config/navigation";
import styles from "./header.module.css";
export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 60);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    if (!open) return;
    const modal = dialog.current;
    const trigger = opener.current;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modal?.showModal();
    return () => {
      document.body.style.overflow = previous;
      modal?.close();
      trigger?.focus({ preventScroll: true });
    };
  }, [open]);
  return (
    <>
      <header
        className={`site-header ${styles.header} ${scrolled || pathname !== "/" ? "header-solid" : ""}`}
      >
        <nav className={styles.nav} aria-label="Navegación principal">
          {navigation.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/" className={styles.brand} aria-label="Travel Days, inicio">
          <Image
            className={styles.logo}
            src="/media/logos/travel-days-color.png"
            alt="Travel Days"
            width={126}
            height={52}
            priority
          />
        </Link>
        <Link className={styles.contact} href="/contacto#consulta">
          Hablemos <Arrow />
        </Link>
        <button
          type="button"
          ref={opener}
          className={`menu-toggle ${styles.toggle}`}
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="main-menu"
        >
          Menú <span>＋</span>
        </button>
        <noscript>
          <style>{".site-header>button.menu-toggle{display:none!important}"}</style>
          <a className={`menu-toggle ${styles.toggle}`} href="#navegacion">Menú <span aria-hidden="true">＋</span></a>
        </noscript>
      </header>
      <dialog
        id="main-menu"
        ref={dialog}
        className="menu-dialog"
        aria-label="Navegación Travel Days"
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const controls = event.currentTarget.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex="0"]',
          );
          const first = controls[0];
          const last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
      >
        <div className="menu-top">
          <Image src="/media/logos/travel-days-color.png" alt="Travel Days" width={126} height={52} loading="eager" />
          <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar menú">
            Cerrar ×
          </button>
        </div>
        <nav aria-label="Menú móvil">
          {navigation.map((link, i) => (
            <Link
              style={{ animationDelay: `${i * 0.07}s` }}
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {link.label}
              <Arrow />
            </Link>
          ))}
        </nav>
        <a href={whatsappUrl()} target="_blank" rel="noreferrer">
          Consultanos por WhatsApp <Arrow />
        </a>
        <p>{site.address}</p>
      </dialog>
    </>
  );
}
