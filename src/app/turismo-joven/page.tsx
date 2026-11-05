import Link from "next/link";
import { pageMetadata } from "@/config/metadata";
import { publicOrigin, publicUrl } from "@/config/seo";
import { site, whatsappUrl } from "@/config/site";
import { Arrow } from "@/components/icons";
import styles from "./page.module.css";

const title = "Turismo joven en Villa Dolores y Traslasierra";
const description = "Consultá por turismo joven con Travel Days en Villa Dolores, Córdoba. Planificá con tu grupo y conocé los viajes de egresados de primaria y secundaria.";
export const metadata = pageMetadata(title, description, "/turismo-joven");

const questions = [
  { question: "¿Cómo consulto por un viaje con mi grupo?", answer: "Escribinos por WhatsApp con el destino que les interesa, una fecha aproximada y la cantidad de viajeros. Si todavía no tienen todo definido, pueden empezar por contarnos su idea." },
  { question: "¿Turismo joven y viaje de egresados son lo mismo?", answer: "Un viaje de egresados acompaña el cierre de una etapa escolar. Turismo joven es una consulta más amplia: contanos quiénes viajan y qué experiencia buscan para conversar sobre las opciones con la agencia." },
  { question: "¿Dónde veo los viajes de egresados?", answer: "En la sección de egresados podés conocer las propuestas para primaria y secundaria. Para un viaje educativo, contanos el colegio, el grupo y el objetivo de la salida." },
  { question: "¿Los destinos publicados tienen salida o precio confirmado?", answer: "La web presenta destinos para consultar. La fecha, el precio, la disponibilidad, los servicios incluidos y las condiciones de cada propuesta se confirman directamente con Travel Days antes de reservar." },
  { question: "¿Dónde está Travel Days?", answer: `Nuestra oficina está en ${site.address}. Podés escribirnos al ${site.phone} o a ${site.email}.` },
] as const;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebPage", "@id": `${publicUrl("/turismo-joven")}#webpage`, url: publicUrl("/turismo-joven"), name: title, description, inLanguage: "es-AR", isPartOf: { "@id": `${publicOrigin}/#website` }, about: { "@id": `${publicOrigin}/#organization` }, breadcrumb: { "@id": `${publicUrl("/turismo-joven")}#breadcrumb` } },
    { "@type": "BreadcrumbList", "@id": `${publicUrl("/turismo-joven")}#breadcrumb`, itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: publicOrigin },
      { "@type": "ListItem", position: 2, name: "Turismo joven", item: publicUrl("/turismo-joven") },
    ] },
  ],
};

export default function YouthTravelPage() {
  return <main id="contenido" className={`interior-page ${styles.page}`}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <nav aria-label="Ruta de navegación" className={styles.breadcrumb}><Link href="/">Inicio</Link><span aria-hidden="true">/</span><span>Turismo joven</span></nav>
    <header className={styles.intro}>
      <p className={styles.eyebrow}>Travel Days · Villa Dolores, Córdoba</p>
      <h1>Turismo joven.<br />El viaje empieza con tu grupo.</h1>
      <p>¿Están pensando en viajar juntos? En Travel Days, agencia de viajes de Villa Dolores, Traslasierra, podés consultar por turismo joven y conocer nuestras propuestas de egresados de primaria y secundaria.</p>
      <a className={styles.primary} href={whatsappUrl("Hola Travel Days, quiero consultar por turismo joven para nuestro grupo.")} target="_blank" rel="noreferrer">Consultar por turismo joven <Arrow /></a>
    </header>
    <section className={styles.section} aria-labelledby="planificar-title">
      <h2 id="planificar-title">Contanos cómo imaginan el viaje.</h2>
      <p>No hace falta tener todo resuelto para consultar. Estos datos nos ayudan a empezar la conversación:</p>
      <ul><li>Quiénes viajan y cuántas personas son aproximadamente.</li><li>Qué destino les gustaría conocer y en qué fecha.</li><li>Si se trata de un viaje de egresados, una salida educativa u otro viaje en grupo.</li><li>Qué necesitan saber sobre transporte, alojamiento y actividades.</li></ul>
      <p>Podés <Link href="/destinos">explorar los destinos nacionales e internacionales</Link> y consultar qué opciones se ajustan a tu grupo. Las condiciones y la disponibilidad se confirman con la agencia.</p>
    </section>
    <section className={styles.section} aria-labelledby="escolares-title">
      <h2 id="escolares-title">Egresados y viajes educativos.</h2>
      <p>Si están cerrando una etapa escolar, conocé los <Link href="/destinos#egresados">viajes de egresados de primaria y secundaria</Link>. Para preparar una consulta con el colegio y las familias, también podés leer nuestra <Link href="/nosotros#viajes-escolares">guía de preguntas sobre viajes escolares</Link>.</p>
      <p>Son consultas diferentes: aclarar el tipo de viaje desde el comienzo ayuda a conversar sobre una propuesta adecuada para el grupo.</p>
    </section>
    <section className={styles.section} aria-labelledby="preguntas-title">
      <h2 id="preguntas-title">Antes de salir, conversemos.</h2>
      {questions.map(({ question, answer }) => <div className={styles.answer} key={question}><h3>{question}</h3><p>{answer}</p></div>)}
    </section>
    <section className={styles.contact} aria-labelledby="oficina-title">
      <h2 id="oficina-title">Una agencia cerca de vos.</h2>
      <p>Te esperamos en {site.address}.</p><p>{site.hours}</p>
      <Link className="text-link" href="/contacto">Ver contacto y ubicación <Arrow /></Link>
    </section>
  </main>;
}
