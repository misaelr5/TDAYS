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
      .from("[data-menu-foot]", { y: 14, autoAlpha: 0, duration: .5, stagger: .06 }, "-=.35")
      // Stickers pop in on their own clock, alongside the links.
      .from("[data-menu-sticker]", { scale: .4, rotate: -24, autoAlpha: 0, duration: .55, stagger: .1, ease: "back.out(2.2)" }, morphing ? .35 : .15);
  }, { scope: panel, dependencies: [open], revertOnUpdate: true });

  return (
    <>
      <header
        ref={header}
        className={`site-header ${styles.header} ${scrolled || pathname !== "/" ? "header-solid" : ""}`}
      >
        <nav className={styles.nav} data-intro-drop="1" aria-label="Navegación principal" ref={nav} style={{ "--sheen-x": 50, "--sheen-y": 0 } as CSSProperties}>
          <span className={styles.pill} data-glide-pill aria-hidden="true" />
          {navigation.filter((link) => link.label !== "Egresados").map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-nav-egresados={link.label === "Egresados" || undefined}
              aria-current={pathname === link.href ? "page" : undefined}
              data-glide-item
              data-glide-active={pathname === link.href || undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href="/" className={styles.brand} data-intro-drop="0" aria-label="Travel Days, inicio">
          <Image
            className={styles.logo}
            src="/media/logos/travel-days-color.png"
            alt="Travel Days"
            width={126}
            height={52}
            priority
          />
        </Link>
        <Link className={styles.contact} data-intro-drop="2" href="/contacto#consulta">
          Hablemos <Arrow />
        </Link>
        <button
          type="button"
          ref={opener}
          className={`menu-toggle ${styles.toggle}`}
          data-intro-drop="2"
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
          <a className={`menu-toggle ${styles.toggle}`} data-intro-drop="2" href="#navegacion">Menú <span aria-hidden="true">＋</span></a>
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
            <FlightSticker />
            <button type="button" className={styles.close} onClick={() => setMenu(false)} aria-label="Cerrar menú">
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <nav className={styles.menuNav} aria-label="Menú móvil">
            {navigation.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-nav-egresados={link.label === "Egresados" || undefined}
                data-menu-item
                aria-current={pathname === link.href ? "page" : undefined}
                onClick={() => setMenu(false)}
              >
                <span className={styles.menuLabel}>
                  <span>{link.label}{pathname === link.href && <PinSticker />}</span>
                  {link.label === "Egresados" && <small>Primaria y secundaria</small>}
                </span>
                <Arrow />
              </Link>
            ))}
          </nav>
          <div className={styles.panelFoot}>
            <p data-menu-foot>{site.address}</p>
            <StampSticker />
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

// Decorative travel stickers for the mobile menu; the current page is still announced by aria-current.
function PinSticker() {
  return <svg className={styles.pin} viewBox="0 0 24 30" aria-hidden="true" data-menu-sticker>
    <path d="M12 28s-9-9.2-9-16a9 9 0 0 1 18 0c0 6.8-9 16-9 16Z" />
    <circle cx="12" cy="12" r="3.4" />
  </svg>;
}

function FlightSticker() {
  return <svg className={styles.flight} viewBox="0 0 140 44" aria-hidden="true" data-menu-sticker>
    <path className={styles.trail} d="M4 38C30 38 44 12 72 16s34 14 50 4" />
    <path className={styles.plane} d="m118 8 14-4c2-.6 3 1.4 1.6 2.6L122 15l1.6 9-3 1-4.4-8-6.8 3.2-.6 4-2.4.8-.6-6.6-5-4.6 2.4-.8 3.4 2.2 6.6-3.4-6-6.4 3-1Z" />
  </svg>;
}

function StampSticker() {
  return <svg className={styles.stamp} viewBox="0 0 92 92" aria-hidden="true" data-menu-sticker>
    <circle cx="46" cy="46" r="42" />
    <circle cx="46" cy="46" r="34" />
    <text x="46" y="42" textAnchor="middle">VILLA DOLORES</text>
    <text x="46" y="56" textAnchor="middle">TRASLASIERRA</text>
  </svg>;
}
