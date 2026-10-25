import { Plane } from "./icons";
import type { MediaSlot } from "@/config/media";
import { ApprovedMedia } from "@/features/media/approved-media";

export function Passport({ className = "" }: { className?: string }) {
  return (
    <div className={`passport ${className}`} aria-hidden="true">
      <div className="passport-edge" />
      <div className="passport-inside">
        <span className="small-brand">travel days</span>
        <span className="passport-top">EL MUNDO TE ESPERA</span>
        <div className="globe-mark">
          <svg
            viewBox="0 0 120 120"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <circle cx="60" cy="60" r="46" />
            <ellipse cx="60" cy="60" rx="23" ry="46" />
            <path d="M14 60h92M21 37h78M21 83h78M60 14v92" />
          </svg>
          <Plane />
        </div>
        <span className="passport-label">
          PASAPORTE
          <br />A TU PRÓXIMA HISTORIA
        </span>
        <span className="passport-bottom">TRAVEL DAYS · DESDE 2018</span>
        <span className="passport-chip">▣</span>
      </div>
    </div>
  );
}

export function BoardingPass({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`boarding-pass ${compact ? "boarding-compact" : ""}`}
      aria-hidden="true"
    >
      <div className="boarding-header">
        <span>TRAVEL DAYS</span>
        <Plane />
      </div>
      <span className="micro">TU PRÓXIMA HISTORIA</span>
      <div className="boarding-route">
        <b>VOS</b>
        <span>✈</span>
        <b>MUNDO</b>
      </div>
      <div className="boarding-details">
        <span>
          DESTINO
          <br />
          <b>Por descubrir</b>
        </span>
        <span>
          ASIENTO
          <br />
          <b>El tuyo</b>
        </span>
      </div>
      <div className="boarding-divider" />
      <span className="script boarding-script">allá vamos</span>
      <p>
        MENOS RUTINA.
        <br />
        MÁS RECUERDOS.
      </p>
      <div className="barcode" />
      <span className="micro">UN VIAJE EMPIEZA CON UNA CHARLA</span>
    </div>
  );
}

/** Original vector illustration, not a photograph or representation of a purchased trip. */
export function Landscape({ kind = "coast" }: { kind?: string }) {
  const mountains = kind === "mountains" || kind === "road";
  const falls = kind === "falls";
  return (
    <svg
      className={`landscape landscape-${kind}`}
      viewBox="0 0 400 300"
      role="img"
      aria-label="Ilustración editorial de paisaje; fotografía del destino pendiente"
    >
      <rect
        width="400"
        height="300"
        fill={mountains ? "#d4bca2" : falls ? "#b6c8b6" : "#b7d3d4"}
      />
      <circle cx="302" cy="68" r="32" fill="#f5e6ba" />
      {mountains ? (
        <>
          <path
            d="M-40 255 95 58 225 270 325 85 450 255v80H-40"
            fill="#9c6455"
          />
          <path d="m-20 300 170-190 119 190 85-125 80 125" fill="#b67b56" />
          <path d="m-30 330 200-133L320 330" fill="#d1a575" />
          <path d="m100 300 80-68 7 68" fill="#eadbc4" />
        </>
      ) : falls ? (
        <>
          <path d="M0 65q90-45 160 10t240-15v240H0" fill="#3b5b48" />
          <path d="M0 127q80-27 140 3t260-14v184H0" fill="#64856d" />
          <path d="M70 117q70 20 145 9v143H70" fill="#d5e4d8" />
          <path
            d="M90 127v143m30-140v140m50-135v135m25-140v140"
            stroke="#a2c4be"
            strokeWidth="10"
          />
          <ellipse cx="175" cy="275" rx="150" ry="35" fill="#9abfb6" />
        </>
      ) : (
        <>
          <path d="M0 145q80-13 200 0t200 0v155H0" fill="#3e999e" />
          <path d="M0 212q120-50 230-11t170-5v104H0" fill="#72b5ae" />
          <path d="M0 270q130-65 250-25t150-8v63H0" fill="#e9d6b1" />
          <path
            d="M285 300q-24-112-14-162"
            fill="none"
            stroke="#5c6550"
            strokeWidth="9"
          />
          <path
            d="M270 145q-65-60-110-14 65-8 110 14m0 0q-30-80-75-58 50 15 75 58m0 0q35-75 79-47-57 11-79 47m0 0q75-40 110 12-66-20-110-12"
            fill="#466952"
          />
        </>
      )}
      <path
        d="M20 20h35m-35 0v35m360-35h-35m35 0v35M20 280h35m-35 0v-35m360 35h-35m35 0v-35"
        stroke="#fff"
        strokeOpacity=".5"
        fill="none"
      />
    </svg>
  );
}

export function Postcard({
  name,
  kind = "coast",
  className = "",
  mediaSlot,
}: {
  name: string;
  kind?: string;
  className?: string;
  mediaSlot?: MediaSlot;
}) {
  return (
    <div className={`postcard ${className}`}>
      {mediaSlot ? <ApprovedMedia slot={mediaSlot}><Landscape kind={kind} /></ApprovedMedia> : <Landscape kind={kind} />}
      <div className="postcard-caption">
        <span className="script">{name}</span>
        <span>
          TRAVEL DAYS
          <br />
          POSTALES POR VIVIR
        </span>
      </div>
    </div>
  );
}
