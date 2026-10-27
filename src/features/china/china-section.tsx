import { Arrow } from "@/components/icons";
import { whatsappUrl } from "@/config/site";
import styles from "./china-section.module.css";

// Reply from the Foreign Ministry received on 02/10/2026 (screenshot shared by the user on 27/10/2026).
const reply = {
  sender: "Cancillería argentina · Turismo y Marca País",
  date: "2 de octubre de 2026",
  dateTime: "2026-10-02",
  text: "Las sedes consulares en la República Popular China ya cuentan con la información sobre su registro.",
};

/** Credential strip: the agreement to receive Chinese tourists, backed by the official reply. */
export function ChinaSection() {
  return (
    <section id="turismo-chino" className={styles.section} aria-labelledby="china-title" data-china>
      <div className={styles.card}>
        <span className={styles.glyph} lang="zh-Hans" aria-hidden="true">欢迎</span>
        <div className={styles.copy}>
          <p className={styles.badge}><span aria-hidden="true">1.ª</span> Primera empresa traslaserrana</p>
          <h2 id="china-title">Traslasierra recibe al turismo chino.</h2>
          <p className={styles.lead}>Somos la primera empresa de Traslasierra en firmar convenio para la recepción de turismo chino.</p>
          <p className={styles.welcome}><span lang="zh-Hans">欢迎来到阿根廷</span> · Bienvenidos a la Argentina</p>
        </div>
        <div className={styles.proof}>
          <figure className={styles.quote}>
            <blockquote><p>“{reply.text}”</p></blockquote>
            <figcaption><strong>{reply.sender}</strong> · <time dateTime={reply.dateTime}>{reply.date}</time></figcaption>
          </figure>
          <a className={styles.primary} href={whatsappUrl("Hola Travel Days, quiero consultar por turismo receptivo desde China.")} target="_blank" rel="noreferrer">Consultar por turismo receptivo <Arrow /></a>
        </div>
      </div>
    </section>
  );
}
