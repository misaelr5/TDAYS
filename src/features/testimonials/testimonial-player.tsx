"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { PublicVideo } from "@/config/media";
import { Arrow } from "@/components/icons";
import styles from "./testimonials.module.css";

export type Testimonial = {
  id: string;
  title: string;
  description: string;
  durationSeconds: number;
  width: number;
  height: number;
  video: PublicVideo;
};

function duration(seconds: number) {
  const total = Math.round(seconds);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

function PlayIcon() {
  return <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="m8 5 11 7-11 7V5Z" fill="currentColor" /></svg>;
}

export function TestimonialPlayer({ testimonials, contactHref, reviewsHref }: {
  testimonials: readonly Testimonial[];
  contactHref: string;
  reviewsHref: string;
}) {
  const [selected, setSelected] = useState(0);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const posterRef = useRef<HTMLImageElement>(null);
  const active = testimonials[selected];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onHidden = () => { if (document.hidden) video.pause(); };
    document.addEventListener("visibilitychange", onHidden);
    const observer = typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) video.pause(); })
      : null;
    observer?.observe(video);
    return () => {
      document.removeEventListener("visibilitychange", onHidden);
      observer?.disconnect();
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, []);

  if (!active) return null;

  function play() {
    const video = videoRef.current;
    if (!video || !active) return;
    setFailed(false);
    setLoading(true);
    setStarted(true);
    // Assign and play inside the gesture, including on Safari. Until this action
    // the element has no src: even speculative metadata cannot fetch the MP4.
    if (video.getAttribute("src") !== active.video.desktop.src || video.error) {
      video.poster = posterRef.current?.currentSrc || active.video.desktop.poster.src;
      video.src = active.video.desktop.src;
      video.load();
    }
    video.muted = false;
    video.focus({ preventScroll: true });
    void video.play().catch(error => {
      // Selecting another clip/unmounting can cancel an in-flight play promise.
      if (error instanceof DOMException && error.name === "AbortError") return;
      setLoading(false);
      setFailed(true);
    });
  }

  function choose(index: number) {
    if (index === selected) return;
    const video = videoRef.current;
    video?.pause();
    video?.removeAttribute("src");
    video?.removeAttribute("poster");
    video?.load();
    setStarted(false);
    setLoading(false);
    setFailed(false);
    setSelected(index);
  }

  return <section id="testimonios" className={`${styles.section} section-pad`} aria-labelledby="testimonials-title" data-testimonials>
    <div className={styles.inner}>
      <header className={styles.intro}>
        <p className={styles.eyebrow}>Experiencias en primera persona</p>
        <h2 id="testimonials-title">El viaje, contado por quienes lo vivieron.</h2>
        <p className={styles.lead}>Hay cosas que se cuentan mejor al volver. Escuchá a quienes viajaron con Travel Days.</p>
      </header>

      <div className={styles.playerColumn}>
        <div className={styles.frame} data-testimonial-frame>
          <Image ref={posterRef} key={active.id} src={active.video.desktop.poster.src} alt="" fill
            sizes="(max-width: 767px) 75vw, 360px" className={styles.poster} />
          <video ref={videoRef} className={`${styles.video} ${started && !failed ? styles.visible : ""}`}
            width={active.width} height={active.height} controls playsInline preload="none"
            tabIndex={started && !failed ? 0 : -1} aria-hidden={!started || failed}
            aria-label={`Testimonio: ${active.title}`} aria-describedby="testimonial-current"
            onPlay={event => {
              for (const other of document.querySelectorAll("video")) if (other !== event.currentTarget) other.pause();
            }}
            onPlaying={() => { setLoading(false); videoRef.current?.focus({ preventScroll: true }); }} onWaiting={() => setLoading(true)}
            onPause={() => setLoading(false)} onEnded={() => setLoading(false)}
            onError={() => { setLoading(false); setFailed(true); }}>
            Tu navegador no permite reproducir este video.
          </video>
          {(!started || failed) && <button type="button" className={styles.playButton} data-testimonial-action
            onClick={play} aria-label={`${failed ? "Reintentar" : "Reproducir"} testimonio: ${active.title}`}>
            <span className={styles.playCircle}><PlayIcon /></span>
            <span>{failed ? "Reintentar" : "Escuchar su experiencia"}</span>
          </button>}
          <span className={styles.duration} aria-hidden="true">{duration(active.durationSeconds)}</span>
        </div>
        <p id="testimonial-current" className={styles.current}>{active.title}<span>Video completo · {duration(active.durationSeconds)}</span></p>
        <p className={styles.status} role="status">{loading ? "Cargando video…" : failed ? "No pudimos reproducirlo. Podés reintentar o abrir el video completo." : ""}</p>
        {failed && <a className={styles.directLink} href={active.video.desktop.src} target="_blank" rel="noopener noreferrer">Abrir video completo en otra pestaña <Arrow /></a>}
      </div>

      <div className={styles.details}>
        <div className={styles.selection}>
          <h3>Elegí una experiencia</h3>
          <ul className={styles.choices}>
            {testimonials.map((item, index) => <li key={item.id}>
              <button type="button" onClick={() => choose(index)} aria-pressed={selected === index}
                aria-label={`Seleccionar testimonio: ${item.title}`} data-testimonial-action>
                <span className={styles.thumbnail}><Image src={item.video.desktop.poster.src} alt="" fill sizes="64px" /></span>
                <span className={styles.choiceCopy}><strong>{item.title}</strong><span>{item.description}</span><span className={styles.choiceMeta}>{duration(item.durationSeconds)}{selected === index ? " · Seleccionado" : " · Ver video"}</span></span>
                <span className={styles.choicePlay}><PlayIcon /></span>
              </button>
            </li>)}
          </ul>
        </div>
        <div className={styles.contact}>
          <h3>Ahora, pensemos en tu viaje.</h3>
          <p>Contanos qué tiene en mente tu grupo. Lo conversamos por WhatsApp.</p>
          <a className={styles.cta} href={contactHref} target="_blank" rel="noopener noreferrer">Consultar por mi viaje <Arrow /></a>
          <a className={styles.reviews} href={reviewsHref} target="_blank" rel="noopener noreferrer">Ver reseñas en Google <Arrow /></a>
        </div>
      </div>
      <noscript>
        <style>{"[data-testimonial-action] { display: none !important; }"}</style>
        <div className={styles.noScript}><p>Abrí los videos completos para escucharlos:</p><ul>{testimonials.map(item => <li key={item.id}><a href={item.video.desktop.src}>{item.title} ({duration(item.durationSeconds)})</a></li>)}</ul></div>
      </noscript>
    </div>
  </section>;
}
