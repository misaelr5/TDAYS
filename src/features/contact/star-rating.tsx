"use client";

import { useState } from "react";
import styles from "./contact.module.css";

const ratings = ["Muy mala", "Mala", "Regular", "Buena", "Muy buena"] as const;

export function StarRating({ onClear, errorId }: { onClear: () => void; errorId?: string }) {
  const [rating, setRating] = useState("");
  return (
    <fieldset className={styles.rating} aria-describedby={errorId} aria-invalid={errorId ? true : undefined}>
      <legend>¿Cómo estuvo tu viaje? <span>(opcional)</span></legend>
      <div className={styles.stars}>
        {ratings.map((description, index) => {
          const value = String(index + 1);
          return <label key={value} className={styles.star}>
            <input type="radio" name="rating" value={value} checked={rating === value}
              onChange={() => setRating(value)} aria-label={`${value} ${index === 0 ? "estrella" : "estrellas"}: ${description}`} />
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2.5 2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.52l-5.88 3.09 1.12-6.55-4.76-4.64 6.58-.96z" /></svg>
          </label>;
        })}
      </div>
      <div className={styles.ratingFeedback}>
        <span>{rating ? `${rating}/5 · ${ratings[Number(rating) - 1]}` : "Elegí tus estrellas"}</span>
        {rating && <button type="button" onClick={() => { setRating(""); onClear(); }}>Quitar puntuación</button>}
      </div>
    </fieldset>
  );
}
