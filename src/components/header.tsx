"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { flushSync } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { site, whatsappUrl } from "@/config/site";
import { Arrow, Facebook } from "./icons";
import { useGlide } from "./use-glide";
import { navigation } from "@/config/navigation";
import styles from "./header.module.css";

gsap.registerPlugin(useGSAP);

const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const header = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const nav = useGlide<HTMLElement>(pathname);

  // The toggle morphs into the glass panel (and back) through a view transition.
  function setMenu(next: boolean) {
    if (next === open) return;
    if (typeof document.startViewTransition !== "function" || reducedMotion()) { setOpen(next); return; }
    const root = document.documentElement;
    root.dataset.menuTransition = next ? "open" : "close";
    const transition = document.startViewTransition(() => flushSync(() => setOpen(next)));
    transition.finished.finally(() => { delete root.dataset.menuTransition; });
  }

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 60);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  // Layout effect: the dialog must be open inside the view transition's update.
  useLayoutEffect(() => {
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

  // Header slides away while reading down and returns on any upward scroll.
  useGSAP((_, contextSafe) => {
    const bar = header.current;
    if (!bar || reducedMotion() || !contextSafe) return;
    let last = window.scrollY;
    let hidden = false;
    const show = (visible: boolean) => {
      if (visible === !hidden) return;
      hidden = !visible;
      gsap.to(bar, { yPercent: visible ? 0 : -130, duration: visible ? .5 : .4, ease: visible ? "power3.out" : "power2.in", overwrite: true });
    };
    const onScroll = contextSafe(() => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 6) return;
      show(y < last || y < 160 || bar.contains(document.activeElement));
      last = y;
    });
    const onFocus = contextSafe(() => show(true));
    window.addEventListener("scroll", onScroll, { passive: true });
    bar.addEventListener("focusin", onFocus);
    return () => {
      window.removeEventListener("scroll", onScroll);
      bar.removeEventListener("focusin", onFocus);
    };
  }, { scope: header });

  // Liquid sheen: a specular highlight that trails the pointer over the glass.
  useGSAP((_, contextSafe) => {
    const bar = nav.current;
    if (!bar || reducedMotion() || !contextSafe) return;
    const x = gsap.quickTo(bar, "--sheen-x", { duration: .6, ease: "power3.out" });
    const y = gsap.quickTo(bar, "--sheen-y", { duration: .6, ease: "power3.out" });
    const move = contextSafe((event: PointerEvent) => {
      const box = bar.getBoundingClientRect();
      x((event.clientX - box.left) / box.width * 100);
      y((event.clientY - box.top) / box.height * 100);
    });
    bar.addEventListener("pointermove", move);
    return () => bar.removeEventListener("pointermove", move);
  }, { scope: header });

  // Menu content arrives in a soft stagger while the panel is still morphing.
  useGSAP(() => {
    if (!open || !panel.current || reducedMotion()) return;
    const morphing = document.documentElement.dataset.menuTransition === "open";
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .from("[data-menu-item]", { y: 26, autoAlpha: 0, filter: "blur(6px)", duration: .6, stagger: .055, delay: morphing ? .18 : 0, clearProps: "filter" })
      .from("[data-menu-foot]", { y: 14, autoAlpha: 0, duration: .5, stagger: .06 }, "-=.35");
  }, { scope: panel, dependencies: [open], revertOnUpdate: true });

  return (
    <>
      <header
        ref={header}
        className={`site-header ${styles.header} ${scrolled || pathname !== "/" ? "header-solid" : ""}`}
      >
        <nav className={styles.nav} aria-label="Navegación principal" ref={nav} style={{ "--sheen-x": 50, "--sheen-y": 0 } as CSSProperties}>
          <span className={styles.pill} data-glide-pill aria-hidden="true" />
          {navigation.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              data-glide-item
              data-glide-active={pathname === link.href || undefined}
            >
              {link.label}
            </Link>
          ))}
          <a className={styles.social} href={site.facebook} target="_blank" rel="noreferrer" aria-label="Facebook de Travel Days">
            <Facebook />
          </a>
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
          onClick={() => setMenu(true)}
          // Shared with the panel: only one element may carry the name at a time.
          style={{ viewTransitionName: open ? "none" : "menu-surface" }}
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
        className={`menu-dialog ${styles.dialog}`}
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
        onCancel={(event) => { event.preventDefault(); setMenu(false); }}
        onClose={() => setOpen(false)}
        onClick={(event) => { if (event.target === event.currentTarget) setMenu(false); }}
      >
        <div ref={panel} className={styles.panel} style={{ viewTransitionName: "menu-surface" }}>
          <div className={styles.panelTop}>
            <Image src="/media/logos/travel-days-color.png" alt="Travel Days" width={126} height={52} loading="eager" />
            <button type="button" className={styles.close} onClick={() => setMenu(false)} aria-label="Cerrar menú">
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <nav className={styles.menuNav} aria-label="Menú móvil">
            {navigation.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-menu-item
                aria-current={pathname === link.href ? "page" : undefined}
                onClick={() => setMenu(false)}
              >
                <span>{link.label}</span>
                <Arrow />
              </Link>
            ))}
          </nav>
          <div className={styles.panelFoot}>
            <p data-menu-foot>{site.address}</p>
            <a data-menu-foot className={styles.whatsapp} href={whatsappUrl()} target="_blank" rel="noreferrer">
              Consultanos por WhatsApp <Arrow />
            </a>
            <a data-menu-foot className={styles.facebook} href={site.facebook} target="_blank" rel="noreferrer">
              <span><Facebook /> Seguinos en Facebook</span> <Arrow />
            </a>
          </div>
        </div>
      </dialog>
    </>
  );
}
