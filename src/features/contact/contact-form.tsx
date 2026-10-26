"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { whatsappUrl } from "@/config/site";
import { Arrow } from "@/components/icons";
import { contactLimits, prepareMessage, type ContactField, type MessageKind } from "./messages";
import { StarRating } from "./star-rating";
import styles from "./contact.module.css";

function isContactControl(target: EventTarget): target is HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement {
  return target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement;
}

export function ContactForm({ kind, destinations }: { kind: MessageKind; destinations: readonly string[] }) {
  const inquiry = kind === "inquiry";
  const prefix = inquiry ? "inquiry" : "experience";
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState<{ field: ContactField; message: string } | null>(null);
  const errorId = `${prefix}-error`;
  const formElement = useRef<HTMLFormElement>(null);
  const result = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (draft) result.current?.focus({ preventScroll: true });
  }, [draft]);

  function accessibility(field: ContactField, help?: string) {
    const invalid = error?.field === field;
    return {
      "aria-invalid": invalid || undefined,
      "aria-describedby": [help, invalid ? errorId : null].filter(Boolean).join(" ") || undefined,
    };
  }

  function clearRatingFeedback() {
    setDraft(null);
    if (error?.field === "message" || error?.field === "rating") setError(null);
    formElement.current?.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[name="rating"], [name="message"]').forEach(field => field.setCustomValidity(""));
  }

  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const next = prepareMessage(new FormData(form), kind);
    if (!next.ok) {
      const named = form.elements.namedItem(next.field);
      const field = named instanceof RadioNodeList ? form.querySelector<HTMLInputElement>('[name="rating"]') : named;
      if (field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement) {
        const disclosure = field.closest("details");
        if (disclosure) disclosure.open = true;
        field.setCustomValidity(next.error);
        field.focus();
        field.reportValidity();
      }
      setDraft(null);
      setError({ field: next.field, message: next.error });
      return;
    }
    setError(null);
    setDraft(next.message);
  }

  const nameField = <div className={styles.field}>
    <label htmlFor={`${prefix}-name`}>Tu nombre {!inquiry && <span>(opcional)</span>}</label>
    <input id={`${prefix}-name`} name="name" autoComplete="name" required={inquiry} maxLength={contactLimits.name} {...accessibility("name")} />
  </div>;

  return <>
    <form ref={formElement} method="post" className={`${styles.form} contact-message-form`}
      aria-label={inquiry ? "Consulta de viaje" : "Compartir experiencia de viaje"}
      aria-describedby={`${prefix}-privacy`} onSubmit={prepare}
      onInvalid={event => {
        const field = event.target;
        if (!isContactControl(field)) return;
        if (event.currentTarget.querySelector("input:invalid,select:invalid,textarea:invalid") !== field) return;
        const disclosure = field.closest("details");
        if (disclosure) disclosure.open = true;
        setDraft(null);
        setError({ field: field.name as ContactField, message: field.validationMessage });
      }}
      onChange={event => {
        setDraft(null);
        const field = event.target;
        if (!isContactControl(field)) return;
        field.setCustomValidity("");
        if (error?.field === field.name) setError(null);
        if (field.name === "rating") clearRatingFeedback();
      }}
      onInput={event => { if (isContactControl(event.target)) event.target.setCustomValidity(""); }}>

      {inquiry ? nameField : <StarRating onClear={clearRatingFeedback} errorId={error?.field === "rating" ? errorId : undefined} />}

      <div className={styles.field}>
        <label htmlFor={`${prefix}-message`}>{inquiry ? "Contanos qué tenés en mente" : "Contanos tu experiencia"}</label>
        <textarea id={`${prefix}-message`} name="message" rows={4} required={inquiry} maxLength={contactLimits.message}
          {...accessibility("message", `${prefix}-message-help`)} />
        <p id={`${prefix}-message-help`}>
          {inquiry ? "Destino, fecha o con quién te gustaría viajar." : "El comentario es opcional. Evitá datos personales de otras personas."}
        </p>
      </div>

      <details className={styles.optionalFields}>
        <summary>{inquiry ? "Sumar destino y teléfono" : "Agregar mi nombre y viaje"} <span>(opcional)</span><span className={styles.disclosureIcon} aria-hidden="true">+</span></summary>
        <div className={styles.optionalGrid}>
          {!inquiry && nameField}
          <div className={styles.field}>
            <label htmlFor={`${prefix}-destination`}>{inquiry ? "¿Adónde te gustaría ir?" : "¿Qué viaje hiciste?"} <span>(opcional)</span></label>
            <input id={`${prefix}-destination`} name="destination" list={`${prefix}-destinations`} maxLength={contactLimits.destination}
              autoComplete="off" {...accessibility("destination")} />
            <datalist id={`${prefix}-destinations`}>{destinations.map(name => <option value={name} key={name} />)}</datalist>
          </div>
          {inquiry && <div className={styles.field}>
            <label htmlFor={`${prefix}-phone`}>Teléfono de contacto <span>(opcional)</span></label>
            <input id={`${prefix}-phone`} name="phone" type="tel" autoComplete="tel" inputMode="tel" maxLength={contactLimits.phone}
              {...accessibility("phone", "inquiry-phone-help")} />
            <p id="inquiry-phone-help">Incluí el código de área.</p>
          </div>}
        </div>
      </details>

      <p id={`${prefix}-privacy`} className={styles.privacy}>
        {inquiry ? "Esta web prepara tu consulta; no guarda tus datos." : "Tu opinión es privada. Esta web no la guarda ni la publica."}{" "}
        Revisás el mensaje antes de enviarlo por WhatsApp.
      </p>
      <button className={styles.submit} type="submit">{inquiry ? "Preparar mi consulta" : "Preparar mi opinión"}<Arrow /></button>
      {error && <p id={errorId} className={styles.error} role="alert">{error.message}</p>}
      {draft && <div className={styles.draft} ref={result} tabIndex={-1} role="status" aria-live="polite">
        <strong>Mensaje preparado. Falta enviarlo.</strong>
        <p>Revisá los datos y continuá a WhatsApp para confirmar el envío.</p>
        <details><summary>Revisar mi mensaje</summary><p className={styles.preview}>{draft}</p></details>
        <a className={styles.submit} href={whatsappUrl(draft)} target="_blank" rel="noopener noreferrer">Revisar y enviar en WhatsApp<Arrow /></a>
      </div>}
    </form>
    <noscript>
      <style>{".contact-message-form{display:none}"}</style>
      <p>Para {inquiry ? "consultar por un viaje" : "compartir tu experiencia"} sin JavaScript,{" "}
        <a className="text-link" href={whatsappUrl(inquiry ? "Hola Travel Days, quiero organizar un viaje." : "Hola Travel Days, ya viajé con ustedes y quiero compartir mi experiencia.")}
          target="_blank" rel="noopener noreferrer">escribinos por WhatsApp<Arrow /></a>.
      </p>
    </noscript>
  </>;
}
