import Link from "next/link";
import Image from "next/image";
import { site, whatsappUrl } from "@/config/site";
import { Arrow, Plane } from "./icons";
import { Parallax, RevealText } from "./motion";
import { BoardingPass, Passport, Postcard } from "./travel-objects";
import { navigation } from "@/config/navigation";

export function Hero() {
  return (
    <section className="hero section-pad" aria-labelledby="hero-title">
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-copy">
        <p className="section-index">/ CADA VIAJE, UNA NUEVA HISTORIA</p>
        <h1 id="hero-title">
          <RevealText>EL MUNDO TE ESPERA.</RevealText>
          <span className="script hero-script">es tu momento</span>
        </h1>
        <div className="hero-description">
          <p>
            Salí de lo de siempre.
            <br />
            Encontrá tu próximo destino.
            <br />
            Empezá a vivirlo con Travel Days.
          </p>
          <a className="text-link" href="#destinos">
            Explorá destinos <Arrow />
          </a>
        </div>
      </div>
      <div className="hero-objects" aria-hidden="true">
        <Parallax className="hero-ticket" distance={85} rotation={7}>
          <BoardingPass />
        </Parallax>
        <Parallax className="hero-passport" distance={130} rotation={-6}>
          <Passport />
        </Parallax>
        <Parallax className="hero-postcard" distance={45} rotation={4}>
          <Postcard name="Nos vemos allá" />
        </Parallax>
      </div>
      <div className="hero-bottom">
        <div>
          <span>DESDE VILLA DOLORES</span>
          <span>HACIA NUEVAS HISTORIAS</span>
        </div>
        <div>
          <span>TURISMO NACIONAL</span>
          <span>INTERNACIONAL Y RECEPTIVO</span>
        </div>
        <a href={site.instagram} target="_blank" rel="noreferrer">
          INSTAGRAM <Arrow />
        </a>
        <a className="scroll-cue" href="#destinos">
          SEGUÍ EXPLORANDO <span>↓</span>
        </a>
      </div>
    </section>
  );
}

export function LocationSection() {
  return (
    <section
      className="location light-section section-pad"
      id="encontranos"
      aria-labelledby="location-title"
    >
      <span className="section-index">/ CERCA, ANTES DE IR LEJOS</span>
      <div className="clock-layout">
        <div className="location-copy">
          <h2 id="location-title">
            SIEMPRE ES
            <br />
            BUEN MOMENTO<span className="script">para salir</span>
          </h2>
          <p>
            El primer paso puede ser una charla.
            <br />
            Te esperamos en nuestra oficina
            <br />
            en Villa Dolores, Córdoba.
          </p>
          <Link className="text-link" href="/contacto">
            Encontranos <Arrow />
          </Link>
        </div>
        <div className="travel-clock" aria-hidden="true">
          <div className="clock-face">
            {Array.from({ length: 60 }, (_, i) => (
              <i
                key={i}
                className={i % 5 === 0 ? "hour-tick" : ""}
                style={{ transform: `rotate(${i * 6}deg)` }}
              />
            ))}
            {Array.from({ length: 12 }, (_, i) => {
              const angle = ((i + 1) * Math.PI) / 6;
              return (
                <span
                  className="clock-number"
                  key={i}
                  style={{
                    left: `${50 + Math.sin(angle) * 39}%`,
                    top: `${50 - Math.cos(angle) * 39}%`,
                  }}
                >
                  {i + 1}
                </span>
              );
            })}
            <Parallax className="clock-airplane" distance={35} rotation={32}>
              <Plane />
            </Parallax>
            <span className="clock-center">HORA DE VIAJAR</span>
          </div>
        </div>
      </div>
      <div className="location-bottom">
        <p>{site.address}</p>
        <p>{site.hours}</p>
        <a
          className="text-link"
          href={whatsappUrl()}
          target="_blank"
          rel="noreferrer"
        >
          Coordinemos una charla <Arrow />
        </a>
      </div>
    </section>
  );
}

export function StorySection() {
  return (
    <section
      className="story section-pad"
      id="nosotros"
      aria-labelledby="story-title"
    >
      <span className="section-index">/ NUESTRA FORMA DE VIAJAR</span>
      <h2 id="story-title">
        <RevealText>LA VIDA SIGUE. QUE LAS GANAS DE VIAJAR TAMBIÉN.</RevealText>
      </h2>
      <div className="floating-stamps" aria-hidden="true">
        {["DESCUBRÍ", "EXPLORÁ", "VIVÍ", "VOLVÉ", "SOÑÁ", "VIAJÁ"].map(
          (word, i) => (
            <Parallax
              key={word}
              className={`floating-stamp stamp-${i}`}
              distance={40 + i * 14}
              rotation={i % 2 ? 20 : -16}
            >
              <span>TRAVEL DAYS</span>
              <b>{word}</b>
              <span>EL MUNDO TE ESPERA</span>
            </Parallax>
          ),
        )}
      </div>
      <Parallax className="story-passport" distance={100} rotation={14}>
        <Passport />
      </Parallax>
      <div className="story-copy">
        <span className="section-index">/ DESDE 2018</span>
        <p>
          Travel Days nace en Villa Dolores de la mano de Javier Garay. Una
          agencia para conversar sobre viajes, escuchar lo que buscás y ayudarte
          a elegir.
        </p>
        <p>
          Turismo nacional, internacional y receptivo. Viajes educativos y de
          egresados. La atención empieza con vos.
        </p>
        <Link className="text-link" href="/nosotros">
          Conocé nuestra historia <Arrow />
        </Link>
      </div>
      <span className="story-note">
        MENOS RUTINA.
        <br />
        MÁS HISTORIAS
        <br />
        PARA CONTAR.
      </span>
    </section>
  );
}

export function ConsultationSection() {
  return (
    <section
      className="consultation section-pad"
      id="consulta"
      aria-labelledby="consultation-title"
    >
      <div className="consultation-orbit" aria-hidden="true" />
      <div className="consultation-background" aria-hidden="true">
        <Parallax
          className="closing-postcard first"
          distance={100}
          rotation={-10}
        >
          <Postcard name="El próximo recuerdo" kind="mountains" />
        </Parallax>
        <Parallax
          className="closing-postcard second"
          distance={70}
          rotation={12}
        >
          <Postcard name="Un poco más lejos" />
        </Parallax>
        <Plane className="closing-plane" />
      </div>
      <h2 id="consultation-title">
        TU PRÓXIMO VIAJE.
        <br />
        EMPIEZA HOY.
      </h2>
      <Parallax className="receipt-wrap" distance={50} rotation={-3}>
        <div className="receipt">
          <div className="receipt-printer" />
          <div className="receipt-paper">
            <span className="receipt-brand">travel days</span>
            <span className="micro">EL COMIENZO DE UNA GRAN HISTORIA</span>
            <Postcard name="Tu próximo destino" />
            <div className="receipt-line">
              <span>PASAJERO</span>
              <b>Vos y tus ganas</b>
            </div>
            <div className="receipt-line">
              <span>DESTINO</span>
              <b>Lo elegimos juntos</b>
            </div>
            <div className="receipt-line">
              <span>FECHA</span>
              <b>La que tengas en mente</b>
            </div>
            <div className="receipt-rule" />
            <p>
              NO LO DEJES
              <br />
              PARA ALGÚN DÍA.
            </p>
            <a
              className="receipt-button"
              href={whatsappUrl()}
              target="_blank"
              rel="noreferrer"
            >
              Hablemos de tu viaje <Arrow />
            </a>
            <div className="barcode" aria-hidden="true" />
            <span className="micro">ESTO ES UNA INVITACIÓN A CONVERSAR</span>
          </div>
        </div>
      </Parallax>
      <div className="consultation-bottom">
        <p>
          NOSOTROS PONEMOS
          <br />
          LA EXPERIENCIA.
          <br />
          VOS, LAS GANAS.
        </p>
        <div>
          <p>
            Contanos adónde querés ir, cuándo
            <br />y con quién. Empecemos por ahí.
          </p>
          <a
            className="text-link"
            href={whatsappUrl()}
            target="_blank"
            rel="noreferrer"
          >
            Escribinos por WhatsApp <Arrow />
          </a>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer section-pad">
      <div className="footer-top">
        <Link href="/" className="wordmark">
          <Image
            className="brand-logo"
            src="/media/logos/1.png"
            alt="Travel Days, inicio"
            width={126}
            height={44}
          />
        </Link>
        <div>
          <span>EXPLORÁ</span>
          {navigation.slice(0, 2).map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
        <div>
          <span>NOSOTROS</span>
          {navigation.slice(2).map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
        <div>
          <span>CONVERSEMOS</span>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a href={whatsappUrl()} target="_blank" rel="noreferrer">
            {site.phone}
          </a>
        </div>
        <a href={site.instagram} target="_blank" rel="noreferrer">
          Instagram <Arrow />
        </a>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} TRAVEL DAYS</span>
        <span>{site.address}</span>
        <Link href="/#contenido">VOLVER AL INICIO ↑</Link>
      </div>
    </footer>
  );
}
