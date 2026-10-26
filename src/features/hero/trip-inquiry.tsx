"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import Link from "next/link";
import { whatsappUrl } from "@/config/site";
import { Arrow } from "@/components/icons";
import { useGlide } from "@/components/use-glide";
import styles from "./trip-inquiry.module.css";

type Panel = "destination" | "date" | "travelers";
type Travelers = number | "grupo" | null;

const shortLabels: Record<Panel, string> = { destination: "Destino", date: "Fecha aproximada", travelers: "Viajeros" };
const weekdays = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];
const monthTitle = new Intl.DateTimeFormat("es-AR", { month: "long", year: "numeric" });
const dayLabel = new Intl.DateTimeFormat("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
const shortMonth = new Intl.DateTimeFormat("es-AR", { month: "short" });
const shortDate = (date: Date) => `${date.getDate()} ${shortMonth.format(date).replace(".", "")} ${date.getFullYear()}`;

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const addDays = (date: Date, days: number) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
const addMonths = (date: Date, months: number) => new Date(date.getFullYear(), date.getMonth() + months, 1);
const sameDay = (a: Date | null, b: Date | null) => !!a && !!b && a.toDateString() === b.toDateString();
const dayKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const travelersText = (value: Travelers) => value === "grupo" ? "Un grupo" : value ? `${value} ${value === 1 ? "persona" : "personas"}` : null;

export function TripInquiry({ destinations }: { destinations: readonly string[] }) {
  const options = [...destinations, "Egresados"];
  const id = useId();
  const [open, setOpen] = useState<Panel | null>(null);
  const [destination, setDestination] = useState<string | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [travelers, setTravelers] = useState<Travelers>(null);
  const [draft, setDraft] = useState<string | null>(null);
  const bar = useRef<HTMLDivElement>(null);
  const search = useGlide<HTMLFormElement>(open);
  const result = useRef<HTMLDivElement>(null);
  const triggers = useRef<Partial<Record<Panel, HTMLButtonElement | null>>>({});

  function change(update: () => void) { update(); setDraft(null); }
  function close(returnFocus = true) {
    if (returnFocus && open) triggers.current[open]?.focus();
    setOpen(null);
  }

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => { if (!bar.current?.contains(event.target as Node)) setOpen(null); };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setOpen(null);
    const message = ["Hola Travel Days, quiero consultar por un viaje."];
    if (destination && options.includes(destination)) message.push(`Destino o tipo de viaje: ${destination}.`);
    if (date) message.push(`Fecha que tengo en mente: ${dayKey(date).split("-").reverse().join("/")}.`);
    if (travelers) message.push(travelers === "grupo" ? "Viajamos en grupo." : `Cantidad de viajeros: ${travelers}.`);
    message.push("¿Podemos conversar sobre opciones, disponibilidad y condiciones?");
    setDraft(message.join("\n"));
    requestAnimationFrame(() => result.current?.focus({ preventScroll: true }));
  }

  function field(panel: Panel, label: string, value: string | null, placeholder: string, icon: ReactNode, extra: Record<string, unknown> = {}) {
    const expanded = open === panel;
    return <button
      type="button"
      ref={element => { triggers.current[panel] = element; }}
      className={styles.field}
      data-open={expanded || undefined}
      data-glide-item
      data-glide-active={expanded || undefined}
      data-filled={value ? "" : undefined}
      aria-haspopup={panel === "destination" ? "listbox" : "dialog"}
      aria-expanded={expanded}
      aria-controls={expanded ? `${id}-${panel}` : undefined}
      aria-labelledby={panel === "destination" ? `${id}-${panel}-label ${id}-${panel}-value` : undefined}
      onClick={() => setOpen(expanded ? null : panel)}
      {...extra}
    >
      {icon}
      <span className={styles.fieldText}>
        <span className={styles.fieldLabel} aria-hidden={panel === "destination" || undefined}>{shortLabels[panel]}</span>
        {panel === "destination" && <span className="sr-only" id={`${id}-${panel}-label`}>{label}</span>}
        <span className={styles.fieldValue} id={`${id}-${panel}-value`}>{value ?? placeholder}</span>
      </span>
      <svg className={styles.chevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
    </button>;
  }

  return <div className={styles.inquiry}>
    <div className={styles.bar} ref={bar} data-trip-inquiry onBlur={event => { if (open && !bar.current?.contains(event.relatedTarget as Node)) setOpen(null); }}>
      <form className={styles.search} onSubmit={prepare} aria-label="Prepará tu consulta de viaje" data-open={open ?? undefined} ref={search}>
        <span className={styles.pill} data-glide-pill aria-hidden="true" />
        <DestinationField
          id={`${id}-destination`}
          options={options}
          value={destination}
          open={open === "destination"}
          setOpen={value => setOpen(value ? "destination" : null)}
          onSelect={value => { change(() => setDestination(value)); setOpen(null); }}
          render={extra => field("destination", "Destino o tipo de viaje", destination, "¿A dónde vamos?", <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2" /></svg>, extra)}
        />
        <div className={styles.slot}>
          {field("date", "Fecha aproximada del viaje", date ? shortDate(date) : null, "¿Cuándo?", <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M7 2v6m10-6v6M3 11h18" /></svg>)}
          {open === "date" && <DatePanel id={`${id}-date`} value={date} onSelect={value => { change(() => setDate(value)); close(); }} onClose={() => close()} />}
        </div>
        <div className={styles.slot}>
          {field("travelers", "Cantidad de viajeros", travelersText(travelers), "¿Cuántos?", <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="12" cy="7" r="4" /><path d="M4 22v-2a8 8 0 0 1 16 0v2" /></svg>)}
          {open === "travelers" && <TravelersPanel id={`${id}-travelers`} value={travelers} onChange={value => change(() => setTravelers(value))} onClose={() => close()} />}
        </div>
        <button type="submit" className={styles.submit}>Consultar <Arrow diagonal={false} /></button>
      </form>
    </div>

    {draft ? <div className={styles.draft} role="status" tabIndex={-1} ref={result}>
      <div className={styles.draftHead}>
        <span className={styles.check} aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg></span>
        <p>Tu consulta está lista para revisar.</p>
      </div>
      <p className={styles.message}>{draft}</p>
      <div className={styles.draftActions}>
        <a href={whatsappUrl(draft)} target="_blank" rel="noreferrer">Abrir WhatsApp <Arrow /></a>
        <button type="button" onClick={() => { setDraft(null); triggers.current.destination?.focus(); }}>Editar consulta</button>
      </div>
    </div> : <p className={styles.helper} data-trip-help>Elegí lo que tengas definido. Consultamos las opciones con vos.</p>}
    <noscript><style>{"[data-trip-inquiry],[data-trip-help]{display:none!important}"}</style><div className={styles.nojs}><Link href="/contacto#consulta">Consultá por tu viaje <Arrow /></Link><Link href="/destinos">Explorá destinos</Link></div></noscript>
  </div>;
}

function DestinationField({ id, options, value, open, setOpen, onSelect, render }: {
  id: string;
  options: string[];
  value: string | null;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSelect: (value: string | null) => void;
  render: (extra: Record<string, unknown>) => ReactNode;
}) {
  const items: (string | null)[] = [null, ...options];
  const [active, setActive] = useState(0);
  const list = useRef<HTMLUListElement>(null);

  function show() { setActive(Math.max(0, items.indexOf(value))); setOpen(true); }
  useEffect(() => { list.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" }); }, [active, open]);

  function keys(event: KeyboardEvent<HTMLButtonElement>) {
    const move = (index: number) => { event.preventDefault(); setActive(Math.min(items.length - 1, Math.max(0, index))); };
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) { event.preventDefault(); show(); }
      return;
    }
    if (event.key === "ArrowDown") move(active + 1);
    else if (event.key === "ArrowUp") move(active - 1);
    else if (event.key === "Home") move(0);
    else if (event.key === "End") move(items.length - 1);
    else if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelect(items[active]); }
    else if (event.key === "Escape" || event.key === "Tab") { if (event.key === "Escape") event.preventDefault(); setOpen(false); }
    else if (event.key.length === 1) {
      const start = items.findIndex((item, index) => index > active && item?.toLowerCase().startsWith(event.key.toLowerCase()));
      const match = start >= 0 ? start : items.findIndex(item => item?.toLowerCase().startsWith(event.key.toLowerCase()));
      if (match >= 0) move(match);
    }
  }

  return <div className={styles.slot}>
    {render({ role: "combobox", onKeyDown: keys, onClick: () => open ? setOpen(false) : show(), "aria-activedescendant": open ? `${id}-${active}` : undefined })}
    {open && <div className={`${styles.panel} ${styles.panelDestination}`}>
      <ul className={styles.options} role="listbox" id={id} ref={list} aria-label="Destino o tipo de viaje">
        {items.map((item, index) => <li
          key={item ?? "any"}
          id={`${id}-${index}`}
          data-index={index}
          role="option"
          aria-selected={item === value}
          data-active={index === active || undefined}
          className={item === "Egresados" ? styles.optionSpecial : undefined}
          onPointerMove={() => setActive(index)}
          onPointerDown={event => event.preventDefault()}
          onClick={() => onSelect(item)}
        >
          <span>{item ?? "Todavía no lo sé"}</span>
          {item === "Egresados" && <small>Primaria y secundaria</small>}
          {item === value && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>}
        </li>)}
      </ul>
    </div>}
  </div>;
}

function DatePanel({ id, value, onSelect, onClose }: { id: string; value: Date | null; onSelect: (value: Date | null) => void; onClose: () => void }) {
  const today = startOfDay(new Date());
  const [focus, setFocus] = useState(value ?? today);
  const [month, setMonth] = useState(addMonths(value ?? today, 0));
  const grid = useRef<HTMLDivElement>(null);
  const moved = useRef(false);

  useEffect(() => {
    grid.current?.querySelector<HTMLButtonElement>(`[data-day="${dayKey(focus)}"]`)?.focus({ preventScroll: !moved.current });
    moved.current = true;
  }, [focus]);

  function moveTo(next: Date) {
    const target = next < today ? today : next;
    setFocus(target);
    if (target.getMonth() !== month.getMonth() || target.getFullYear() !== month.getFullYear()) setMonth(addMonths(target, 0));
  }
  function changeMonth(step: number) {
    const next = addMonths(month, step);
    setMonth(next);
    setFocus(next < today ? today : next);
  }
  function keys(event: KeyboardEvent<HTMLDivElement>) {
    const steps: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (event.key in steps) { event.preventDefault(); moveTo(addDays(focus, steps[event.key])); }
    else if (event.key === "PageUp" || event.key === "PageDown") { event.preventDefault(); const next = addMonths(focus, event.key === "PageUp" ? -1 : 1); moveTo(new Date(next.getFullYear(), next.getMonth(), Math.min(focus.getDate(), new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate()))); }
  }

  const offset = (month.getDay() + 6) % 7;
  const total = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = Array.from({ length: Math.ceil((offset + total) / 7) * 7 }, (_, index) => index - offset + 1);
  const canGoBack = month > addMonths(today, 0);

  return <div className={`${styles.panel} ${styles.panelDate}`} role="dialog" id={id} aria-label="Elegí una fecha aproximada" onKeyDown={event => { if (event.key === "Escape") { event.preventDefault(); onClose(); } }}>
    <div className={styles.calendarHead}>
      <button type="button" className={styles.iconButton} onClick={() => changeMonth(-1)} disabled={!canGoBack} aria-label="Mes anterior"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m15 6-6 6 6 6" /></svg></button>
      <p aria-live="polite">{monthTitle.format(month)}</p>
      <button type="button" className={styles.iconButton} onClick={() => changeMonth(1)} aria-label="Mes siguiente"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg></button>
    </div>
    <div className={styles.weekdays} aria-hidden="true">{weekdays.map(day => <span key={day}>{day}</span>)}</div>
    <div className={styles.days} ref={grid} onKeyDown={keys}>
      {cells.map(number => {
        if (number < 1 || number > total) return <span key={number} />;
        const day = new Date(month.getFullYear(), month.getMonth(), number);
        return <button
          type="button"
          key={number}
          data-day={dayKey(day)}
          tabIndex={sameDay(day, focus) ? 0 : -1}
          disabled={day < today}
          aria-pressed={sameDay(day, value)}
          aria-current={sameDay(day, today) ? "date" : undefined}
          aria-label={dayLabel.format(day)}
          onClick={() => onSelect(day)}
        >{number}</button>;
      })}
    </div>
    <div className={styles.panelFoot}>
      <button type="button" onClick={() => onSelect(null)} disabled={!value}>Sin fecha definida</button>
      <button type="button" onClick={() => moveTo(today)}>Hoy</button>
    </div>
  </div>;
}

function TravelersPanel({ id, value, onChange, onClose }: { id: string; value: Travelers; onChange: (value: Travelers) => void; onClose: () => void }) {
  const count = typeof value === "number" ? value : 0;
  const group = value === "grupo";
  const first = useRef<HTMLButtonElement>(null);
  useEffect(() => { first.current?.focus({ preventScroll: true }); }, []);

  return <div className={`${styles.panel} ${styles.panelTravelers}`} role="dialog" id={id} aria-label="Cantidad de viajeros" onKeyDown={event => { if (event.key === "Escape") { event.preventDefault(); onClose(); } }}>
    <div className={styles.stepper} data-disabled={group || undefined}>
      <div><p id={`${id}-people`}>Personas</p><small>Hasta 10 viajeros</small></div>
      <div className={styles.stepperControls} role="group" aria-labelledby={`${id}-people`}>
        <button type="button" className={styles.iconButton} ref={first} onClick={() => onChange(count > 1 ? count - 1 : null)} disabled={group || count === 0} aria-label="Quitar una persona"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M6 12h12" /></svg></button>
        <output aria-live="polite" aria-label={`${count} ${count === 1 ? "persona" : "personas"}`}>{count}</output>
        <button type="button" className={styles.iconButton} onClick={() => onChange(Math.min(10, count + 1))} disabled={group || count >= 10} aria-label="Sumar una persona"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 6v12M6 12h12" /></svg></button>
      </div>
    </div>
    <button type="button" role="switch" aria-checked={group} className={styles.switchRow} onClick={() => onChange(group ? null : "grupo")}>
      <span><span className={styles.switchTitle}>Viajamos en grupo</span><small>Más de 10, colegios o contingentes</small></span>
      <span className={styles.switch} aria-hidden="true" />
    </button>
    <div className={styles.panelFoot}>
      <button type="button" onClick={() => onChange(null)} disabled={!value}>Limpiar</button>
      <button type="button" className={styles.done} onClick={onClose}>Listo</button>
    </div>
  </div>;
}
