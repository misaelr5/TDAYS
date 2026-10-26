"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { whatsappUrl } from "@/config/site";
import { Arrow } from "@/components/icons";
import styles from "./scenic-hero.module.css";

export function TripInquiry({ destinations }: { destinations: readonly string[] }) {
  const [draft, setDraft] = useState<string | null>(null);
  const result = useRef<HTMLDivElement>(null);

  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const destination = String(data.get("destination") ?? "");
    const date = String(data.get("date") ?? "");
    const travelers = String(data.get("travelers") ?? "");
    const message = ["Hola Travel Days, quiero consultar por un viaje."];
    if (destinations.includes(destination) || destination === "Egresados") message.push(`Destino o tipo de viaje: ${destination}.`);
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) message.push(`Fecha que tengo en mente: ${date.split("-").reverse().join("/")}.`);
    if (/^(?:[1-9]|10|grupo)$/.test(travelers)) message.push(travelers === "grupo" ? "Viajamos en grupo." : `Cantidad de viajeros: ${travelers}.`);
    message.push("¿Podemos conversar sobre opciones, disponibilidad y condiciones?");
    setDraft(message.join("\n"));
    requestAnimationFrame(() => result.current?.focus({ preventScroll: true }));
  }

  return <div className={styles.inquiry}>
    <form className={styles.search} onSubmit={prepare} onChange={() => setDraft(null)} aria-label="Prepará tu consulta de viaje" data-trip-inquiry>
      <label className={styles.field}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2" /></svg>
        <span className="sr-only">Destino o tipo de viaje</span>
        <select name="destination" defaultValue=""><option value="">Destino</option>{destinations.map(name => <option key={name}>{name}</option>)}<option>Egresados</option></select>
      </label>
      <label className={styles.field}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M7 2v6m10-6v6M3 11h18" /></svg>
        <span className="sr-only">Fecha aproximada del viaje</span>
        <input type="date" name="date" aria-label="Fecha aproximada del viaje" />
      </label>
      <label className={styles.field}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="12" cy="7" r="4" /><path d="M4 22v-2a8 8 0 0 1 16 0v2" /></svg>
        <span className="sr-only">Cantidad de viajeros</span>
        <select name="travelers" defaultValue=""><option value="">Viajeros</option>{Array.from({ length: 10 }, (_, index) => <option key={index} value={index + 1}>{index + 1} {index === 0 ? "persona" : "personas"}</option>)}<option value="grupo">Un grupo</option></select>
      </label>
      <button type="submit">Consultar <Arrow diagonal={false} /></button>
    </form>
    {draft ? <div className={styles.draft} role="status" tabIndex={-1} ref={result}>
      <p>Tu consulta está lista para revisar.</p><p className={styles.message}>{draft}</p>
      <a href={whatsappUrl(draft)} target="_blank" rel="noreferrer">Abrir WhatsApp <Arrow /></a>
    </div> : <p className={styles.helper} data-trip-help>Elegí lo que tengas definido. Consultamos las opciones con vos.</p>}
    <noscript><style>{"[data-trip-inquiry],[data-trip-help]{display:none!important}"}</style><div className={styles.nojs}><Link href="/contacto#consulta">Consultá por tu viaje <Arrow /></Link><Link href="/destinos">Explorá destinos</Link></div></noscript>
  </div>;
}
