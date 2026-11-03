"use client";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import type { PublicVideo } from "@/config/media";

export function videoPlaybackPolicy(preferences: { reducedMotion: boolean; mobile: boolean; saveData?: boolean; effectiveType?: string }): "off" | "mobile" | "desktop" {
  if (preferences.reducedMotion || preferences.saveData || /^(slow-2g|2g|3g)$/.test(preferences.effectiveType ?? "")) return "off";
  return preferences.mobile ? "mobile" : "desktop";
}
type Connection = EventTarget & { saveData?: boolean; effectiveType?: string };
function connection() { return (navigator as Navigator & { connection?: Connection }).connection; }
function subscribe(update: () => void) {
  const queries = [matchMedia("(prefers-reduced-motion: reduce)"), matchMedia("(max-width: 767px)")];
  queries.forEach(query => query.addEventListener("change", update));
  const network = connection();
  network?.addEventListener("change", update);
  return () => { queries.forEach(query => query.removeEventListener("change", update)); network?.removeEventListener("change", update); };
}
function policy() { return videoPlaybackPolicy({ reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches, mobile: matchMedia("(max-width: 767px)").matches, saveData: connection()?.saveData, effectiveType: connection()?.effectiveType }); }
export function AmbientVideo({ asset, children }: { asset: PublicVideo; children: ReactNode }) {
  const mode = useSyncExternalStore(subscribe, policy, () => "off");
  const ref = useRef<HTMLVideoElement>(null);
  const pausedByUser = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [hasFrame, setHasFrame] = useState(false);
  useEffect(() => {
    const video = ref.current;
    if (!video || !asset.decorative || mode === "off" || !window.IntersectionObserver) return;
    const source = mode === "mobile" ? asset.mobile ?? asset.desktop : asset.desktop;
    // Wait for responsive selection instead of falling back to the original:
    // currentSrc can still be empty at hydration on a cold or slow connection.
    const poster = video.parentElement?.querySelector<HTMLImageElement>("picture img");
    let visible = false;
    const prepare = () => {
      if (poster?.currentSrc && poster.naturalWidth > 0) video.poster = poster.currentSrc;
      video.src = source.src;
      if (visible && !pausedByUser.current) void video.play().catch(() => {});
    };
    if (!poster || poster.complete) prepare();
    else {
      poster.addEventListener("load", prepare, { once: true });
      poster.addEventListener("error", prepare, { once: true });
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) video.pause();
      else if (!pausedByUser.current && video.hasAttribute("src")) void video.play().catch(() => {});
    });
    observer.observe(video);
    return () => { observer.disconnect(); poster?.removeEventListener("load", prepare); poster?.removeEventListener("error", prepare); video.pause(); video.removeAttribute("src"); video.load(); };
  }, [mode, asset]);
  const focal = (mode === "mobile" ? asset.mobile ?? asset.desktop : asset.desktop).poster.focal;
  return <div className={`approved-media-video${hasFrame && mode !== "off" ? " has-frame" : ""}`}>
    {children}
    <video ref={ref} muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1}
      style={{ objectPosition: `${focal.x}% ${focal.y}%` }}
      onLoadStart={() => { setHasFrame(false); setPlaying(false); }}
      onPlaying={() => { setPlaying(true); setHasFrame(true); }} onPause={() => setPlaying(false)} onError={() => { setPlaying(false); setHasFrame(false); }} />
    {mode !== "off" && <button type="button" onClick={() => {
      const video = ref.current;
      if (!video) return;
      pausedByUser.current = !video.paused;
      if (video.paused) void video.play().catch(() => {}); else video.pause();
    }}>{playing ? "Pausar video de fondo" : "Reproducir video de fondo"}</button>}
  </div>;
}
