"use client";

import { useState } from "react";
import { Arrow } from "@/components/icons";
import styles from "./narrative.module.css";

// The live map is a third-party embed: it only loads after an explicit click.
export function OfficeMap({ address, directions }: { address: string; directions: string }) {
  const [live, setLive] = useState(false);
  const embed = `https://www.google.com/maps?q=${encodeURIComponent(address)}&z=16&output=embed`;
  return <div className={styles.map} data-office-map>
    {live ? <iframe className={styles.mapFrame} src={embed} title={`Mapa de ${address}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /> : <>
      <svg className={styles.mapArt} viewBox="0 0 480 360" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
        <rect width="480" height="360" fill="#e8f0f8" />
        <path d="M-20 300C80 260 120 300 210 250S360 170 500 190" fill="none" stroke="#c6dcf2" strokeWidth="26" strokeLinecap="round" />
        <g stroke="#fff" strokeWidth="10" strokeLinecap="round">
          <path d="M0 70h480M0 150h480M0 230h480M60 0v360M170 0v360M290 0v360M400 0v360" />
        </g>
        <g stroke="#ffffffb3" strokeWidth="4">
          <path d="M0 110h480M0 190h480M115 0v360M230 0v360M345 0v360" />
        </g>
        <path d="M230 150h60v80h-60z" fill="#d4e4f5" />
        <path d="M60 70h55v40H60zM345 190h55v40h-55zM170 230h60v-40h-60z" fill="#dbe7f4" />
      </svg>
      <span className={styles.pin} aria-hidden="true"><span /></span>
      <div className={styles.mapCard}>
        <span>Nuestra oficina</span>
        <strong>{address}</strong>
        <div className={styles.mapActions}>
          <button type="button" onClick={() => setLive(true)}>Ver mapa interactivo</button>
          <a href={directions} target="_blank" rel="noopener noreferrer">Cómo llegar <Arrow /></a>
        </div>
        <small>El mapa interactivo se carga desde Google Maps.</small>
      </div>
    </>}
  </div>;
}
