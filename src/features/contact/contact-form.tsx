"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { whatsappUrl } from "@/config/site";
import { Arrow } from "@/components/icons";
import { contactLimits, prepareMessage, type ContactField, type MessageKind } from "./messages";
import styles from "./contact.module.css";

function isContactControl(target: EventTarget): target is HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement {
  return target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement;
}

export function ContactForm({
  kind,
  destinations,
}: {
  kind: MessageKind;
  destinations: readonly string[];
}) {
  const inquiry = kind === "inquiry";
  const prefix = inquiry ? "inquiry" : "experience";
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState<{ field: ContactField; message: string } | null>(null);
  const errorId = `${prefix}-error`;
  function accessibility(field: ContactField, help?: string) {
    const invalid = error?.field === field;
    return {
      "aria-invalid": invalid || undefined,
      "aria-describedby": [help, invalid ? errorId : null].filter(Boolean).join(" ") || undefined,
    };
  }
  const result = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (draft) result.current?.focus({ preventScroll: true });
  }, [draft]);

  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const next = prepareMessage(new FormData(form), kind);
    if (!next.ok) {
      const field = form.elements.namedItem(next.field);
      if (
        field instanceof HTMLInputElement ||
        field instanceof HTMLSelectElement ||
        field instanceof HTMLTextAreaElement
      ) {
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

  return (
    <>
      <form
        method="post"
        className={`${styles.form} contact-message-form`}
        aria-label={
          inquiry ? "Consulta de viaje" : "Compartir experiencia de viaje"
        }
        onSubmit={prepare}
        onInvalid={(event) => {
          const field = event.target;
          if (!isContactControl(field)) return;
          // Native validation emits one event per invalid field. Keep the
          // message associated with the first field the browser will focus.
          if (event.currentTarget.querySelector("input:invalid,select:invalid,textarea:invalid") !== field) return;
          setDraft(null);
          setError({ field: field.name as ContactField, message: field.validationMessage });
        }}
        onChange={(event) => {
          setDraft(null);
          const field = event.target;
          if (!isContactControl(field)) return;
          field.setCustomValidity("");
          if (error?.field === field.name) setError(null);
        }}
        onInput={(event) => {
          const field = event.target;
          if (
            field instanceof HTMLInputElement ||
            field instanceof HTMLSelectElement ||
            field instanceof HTMLTextAreaElement
          )
            field.setCustomValidity("");
        }}
        aria-describedby={`${prefix}-privacy`}
      >
        <div className={styles.field}>
          <label htmlFor={`${prefix}-name`}>
            Tu nombre {!inquiry && <span>(opcional)</span>}
          </label>
          <input
            id={`${prefix}-name`}
            name="name"
            autoComplete="name"
            required={inquiry}
            maxLength={contactLimits.name}
            {...accessibility("name")}
          />
        </div>
        {inquiry && (
          <div className={styles.field}>
            <label htmlFor={`${prefix}-phone`}>
              Teléfono de contacto <span>(opcional)</span>
            </label>
            <input
              id={`${prefix}-phone`}
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              maxLength={contactLimits.phone}
              {...accessibility("phone", "inquiry-phone-help")}
            />
            <p id="inquiry-phone-help">
              Incluí el código de área. También podemos conversar por WhatsApp.
            </p>
          </div>
        )}
        <div className={styles.field}>
          <label htmlFor={`${prefix}-destination`}>
            {inquiry ? "¿Adónde te gustaría ir?" : "¿Qué viaje hiciste?"}{" "}
            <span>(opcional)</span>
          </label>
          <input
            id={`${prefix}-destination`}
            name="destination"
            list={`${prefix}-destinations`}
            maxLength={contactLimits.destination}
            autoComplete="off"
            {...accessibility("destination")}
          />
          <datalist id={`${prefix}-destinations`}>
            {destinations.map((name) => (
              <option value={name} key={name} />
            ))}
          </datalist>
        </div>
        {!inquiry && (
          <div className={styles.field}>
            <label htmlFor="experience-rating">
              ¿Cómo lo valorarías? <span>(opcional)</span>
            </label>
            <select id="experience-rating" name="rating" defaultValue="" {...accessibility("rating")}>
              <option value="">Sin puntuar</option>
              <option value="1">1 — Muy mala</option>
              <option value="2">2 — Mala</option>
              <option value="3">3 — Regular</option>
              <option value="4">4 — Buena</option>
              <option value="5">5 — Muy buena</option>
            </select>
          </div>
        )}
        <div className={styles.field}>
          <label htmlFor={`${prefix}-message`}>
            {inquiry
              ? "Contanos qué tenés en mente"
              : "Contanos tu experiencia"}
          </label>
          <textarea
            id={`${prefix}-message`}
            name="message"
            rows={5}
            required
            maxLength={contactLimits.message}
            {...accessibility("message", `${prefix}-message-help`)}
          />
          <p id={`${prefix}-message-help`}>
            {inquiry
              ? "Podés contarnos cuándo te gustaría viajar y cuántas personas serían."
              : "Qué disfrutaste, qué mejorarías o qué querés hacernos saber. Evitá datos personales de otras personas."}{" "}
            Hasta {contactLimits.message} caracteres.
          </p>
        </div>
        <p id={`${prefix}-privacy`} className={styles.privacy}>
          {inquiry
            ? "Tus datos se usan para preparar tu consulta. Esta web no los guarda."
            : "Tu opinión es privada: esta web no la guarda ni la publica."}{" "}
          Podés revisar el mensaje antes de enviarlo por WhatsApp.
        </p>
        <button className={styles.submit} type="submit">
          {inquiry ? "Preparar mi consulta" : "Preparar mi opinión"}
          <Arrow />
        </button>
        {error && (
          <p id={errorId} className={styles.error} role="alert">
            {error.message}
          </p>
        )}
        {draft && (
          <div
            className={styles.draft}
            ref={result}
            tabIndex={-1}
            role="status"
            aria-live="polite"
          >
            <strong>Mensaje preparado. Falta enviarlo.</strong>
            <p>
              Revisá los datos y continuá a WhatsApp para confirmar el envío.
            </p>
            <details>
              <summary>Revisar mi mensaje</summary>
              <p className={styles.preview}>{draft}</p>
            </details>
            <a
              className={styles.submit}
              href={whatsappUrl(draft)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Revisar y enviar en WhatsApp
              <Arrow />
            </a>
          </div>
        )}
      </form>
      <noscript>
        <style>{".contact-message-form{display:none}"}</style>
        <p>
          Para {inquiry ? "consultar por un viaje" : "compartir tu experiencia"}{" "}
          sin JavaScript,{" "}
          <a
            className="text-link"
            href={whatsappUrl(
              inquiry
                ? "Hola Travel Days, quiero organizar un viaje."
                : "Hola Travel Days, ya viajé con ustedes y quiero compartir mi experiencia.",
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            escribinos por WhatsApp
            <Arrow />
          </a>
          .
        </p>
      </noscript>
    </>
  );
}
