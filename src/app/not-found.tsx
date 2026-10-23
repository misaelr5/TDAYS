import Link from "next/link";
export default function NotFound() {
  return (
    <main id="contenido" className="not-found section-pad">
      <span className="section-index">ERROR 404</span>
      <h1>
        Por acá
        <br />
        no era.
      </h1>
      <p>Esta página no está disponible. Volvamos a elegir un destino.</p>
      <Link className="text-link" href="/">
        Volver al inicio ↗
      </Link>
    </main>
  );
}
