import { Arrow } from "@/components/icons";
import { whatsappUrl } from "@/config/site";
import styles from "./china-section.module.css";

// Reply from the Foreign Ministry received on 02/10/2026 (screenshot shared by the user on 27/10/2026).
const reply = {
  sender: "Cancillería argentina · Turismo y Marca País",
  date: "2 de octubre de 2026",
  dateTime: "2026-10-02",
  text: "En respuesta a su correo, fue informado por el área consular que las sedes consulares en la República Popular China ya cuentan con la información sobre su registro.",
};

/** Highlights the agreement to receive Chinese tourists, backed by the official reply. */
export function ChinaSection() {
  return (
    <section id="turismo-chino" className={`${styles.section} section-pad`} aria-labelledby="china-title" data-china>
      <div className={styles.card}>
        <span className={styles.glyph} lang="zh-Hans" aria-hidden="true">欢迎</span>
        <div className={styles.copy}>
          <p className={styles.badge}><span aria-hidden="true">1.ª</span> Primera empresa traslaserrana</p>
          <h2 id="china-title">Traslasierra recibe al turismo chino.</h2>
          <p className={styles.lead}>Somos la primera empresa de Traslasierra en firmar convenio para la recepción de turismo chino. Las sedes consulares argentinas en la República Popular China ya cuentan con nuestro registro.</p>
          <p className={styles.welcome}><span lang="zh-Hans">欢迎来到阿根廷</span> · Bienvenidos a la Argentina</p>
          <a className={styles.primary} href={whatsappUrl("Hola Travel Days, quiero consultar por turismo receptivo desde China.")} target="_blank" rel="noreferrer">Consultar por turismo receptivo <Arrow /></a>
        </div>
        <figure className={styles.mail}>
          <div className={styles.mailHead}>
            <span className={styles.avatar} aria-hidden="true">C</span>
            <div>
              <p className={styles.sender}>{reply.sender}</p>
              <p className={styles.meta}>Para Travel Days · <time dateTime={reply.dateTime}>{reply.date}</time></p>
            </div>
          </div>
          <blockquote className={styles.quote}><p>{reply.text}</p></blockquote>
          <figcaption>Respuesta oficial recibida por Travel Days</figcaption>
        </figure>
      </div>
    </section>
  );
}
