import "./reac-signature.css";

/* Reac Studio authorship line, copied from the studio's reviewed signature kit
   (PIE DE PAGINA MARCA DE AGUA, 28/10/2026). Markup and CSS stay verbatim so the
   mark matches every Reac site; only JSX attribute names change. */
export function ReacSignature({ theme = "dark" }: { theme?: "dark" | "light" | "inherit" }) {
  return <div className="reac-signature" data-theme={theme}>
    <span className="reac-signature__label">Diseño y desarrollo por</span>
    <a className="reac-signature__link" href="https://reacstudio.com/">
      <svg className="reac-signature__logo" xmlns="http://www.w3.org/2000/svg" viewBox="200 258 642 514" width="22" height="18" aria-hidden="true" focusable="false">
        <path d="M207 394 306 291c17-17 34-25 61-25h339c55 0 99 45 99 100v46c0 31-12 59-35 82L668 583l166 179h-84L601 601l66-68 52-51c12-12 18-27 18-45v-50c0-28-23-50-51-50H418c-11 0-20 4-28 12l-34 38-149 7Z" />
        <path d="M649 383H495c-18 0-31 6-45 20L319 535c-29 29-45 59-45 91v137l89-94v-51l162-175c31-34 70-54 124-60Z" />
        <path d="M516 527v52c0 20 7 36 21 50l135 133h-104l-90-94c-16-17-24-35-24-57v-20l62-64Z" />
      </svg>
      <span className="reac-signature__name">Reac Studio</span>
      <span className="reac-signature__arrow" aria-hidden="true">↗</span>
    </a>
  </div>;
}
