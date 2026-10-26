const palettes = {
  sunset: { sky: ["#a1bbb9", "#ead8b7", "#eeaa71"], sea: ["#719e9a", "#244c55"], sun: { cy: 310, fill: "#fff0cb" }, moment: "al atardecer" },
  morning: { sky: ["#9fc0d6", "#d9e6e8", "#f2e2c4"], sea: ["#6d9fb0", "#20485c"], sun: { cy: 196, fill: "#fff8e6" }, moment: "por la mañana" },
} as const;

/** Original editorial illustration. Does not depict an actual group or offered destination. */
export function GraduatesScene({ variant = "sunset" }: { variant?: keyof typeof palettes }) {
  const palette = palettes[variant];
  const sky = `graduates-sky-${variant}`;
  const sea = `graduates-sea-${variant}`;
  return (
    <svg viewBox="0 0 720 860" preserveAspectRatio="xMidYMid slice" fill="none" role="img"
      aria-label={`Ilustración de cuatro amigos mirando el mar ${palette.moment}; no representa un viaje realizado`}>
      <defs>
        <linearGradient id={sky} x2="0" y2="650" gradientUnits="userSpaceOnUse">
          <stop stopColor={palette.sky[0]} /><stop offset=".66" stopColor={palette.sky[1]} /><stop offset="1" stopColor={palette.sky[2]} />
        </linearGradient>
        <linearGradient id={sea} x1="360" y1="420" x2="360" y2="860" gradientUnits="userSpaceOnUse">
          <stop stopColor={palette.sea[0]} /><stop offset="1" stopColor={palette.sea[1]} />
        </linearGradient>
      </defs>
      <path fill={`url(#${sky})`} d="M0 0h720v860H0z" />
      <circle cx="450" cy={palette.sun.cy} r="79" fill={palette.sun.fill} />
      <path d="M0 418c180-17 343 8 720-10v452H0z" fill={`url(#${sea})`} />
      <path d="m0 140 52 74 26 99 57 37 62 155L0 590z" fill="#587474" />
      <path d="m0 275 45 62 15 104 75 68L0 614z" fill="#385b60" />
      <path d="m720 308-56 41-16 74-49 36-44 79 165-12z" fill="#a3a88e" />
      <path d="m720 370-43 35-9 56-62 54 114 30z" fill="#758979" />
      <g stroke="#d8e3cb" strokeLinecap="round" opacity=".55">
        <path d="M371 439h149m-182 19h196m-129 22h99m-235 29h307m-394 27h224m43 0h155m-345 31h144m-193 28h338" />
        <path d="M74 631q132-46 274-11t347-12M38 677q176-35 315-3t367-25" strokeWidth="3" />
      </g>
      <path d="M0 719q140-56 303-4t417-53v198H0z" fill="#c1ac87" />
      <path d="M0 785q141-42 313-2t407-50v127H0z" fill="#a18c70" />
      <path d="M0 826q130-35 270 0t450-42v76H0z" fill="#7c7866" />
      <g stroke="#c8b791" strokeWidth="13" strokeLinecap="round">
        <path d="m135 674 7 147m416-143-7 143M80 689q245-21 533 0" />
      </g>
      <g>
        <path d="m235 642-11 142m37-140 6 140" stroke="#263e4b" strokeWidth="23" strokeLinecap="round" />
        <path d="m231 783-14 6m53-5 10 4" stroke="#eee1c7" strokeWidth="16" strokeLinecap="round" />
        <path d="M215 536q28-20 57 1l14 109q-43 18-83-2z" fill="#df8a50" />
        <path d="m217 550-23 92m76-94 31 34" stroke="#df8a50" strokeWidth="24" strokeLinecap="round" />
        <path d="M220 517q-5-48 26-47 32 0 27 48l-7 20h-38z" fill="#273d42" />
        <path d="M224 526q22 15 44 0" stroke="#c87545" strokeWidth="8" />
      </g>
      <g>
        <path d="m325 643-5 144m35-145 12 145" stroke="#dfd2ad" strokeWidth="24" strokeLinecap="round" />
        <path d="m316 788-13 2m64-2 12 2" stroke="#293f48" strokeWidth="16" strokeLinecap="round" />
        <path d="M307 535q27-18 57 2l15 117q-34 11-78-1z" fill="#f4e5c8" />
        <path d="m312 549-17 43-31-26m95-16 32 32" stroke="#f4e5c8" strokeWidth="23" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M317 497q0-24 21-24 24 0 24 25v26q-23 21-45-1z" fill="#b47f5c" />
        <path d="M312 506q-4-42 26-43 31-1 28 41l-15-17-38 21" fill="#5a5140" />
      </g>
      <g>
        <path d="m414 654-7 131m36-133 11 134" stroke="#293e4d" strokeWidth="24" strokeLinecap="round" />
        <path d="m404 787-12 2m63-1 13 2" stroke="#eee1c7" strokeWidth="16" strokeLinecap="round" />
        <path d="M397 544q27-19 54 0l14 117q-31 10-77-3z" fill="#748a72" />
        <path d="m400 556-16 29-28-16m89-11 26 22 23-18" stroke="#748a72" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M406 531q-8-64 20-65 35 1 30 74l-18 20-27-11z" fill="#334547" />
      </g>
      <g>
        <path d="m505 647-8 136m37-137 8 138" stroke="#a7b8b0" strokeWidth="23" strokeLinecap="round" />
        <path d="m494 787-12 2m61-2 12 3" stroke="#eee1c7" strokeWidth="16" strokeLinecap="round" />
        <path d="M491 539q27-20 55 1l13 110q-33 13-77-1z" fill="#304d5c" />
        <path d="m496 552-19 26-28-17m91-8 25 73" stroke="#304d5c" strokeWidth="23" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M500 497q0-23 19-23 24 0 24 23v28q-20 20-43-1z" fill="#c39572" />
        <path d="M495 505q-3-39 26-40 29 1 26 39l-16-17-36 18" fill="#374340" />
      </g>
      <g stroke="#f7edda" strokeWidth="2" opacity=".7">
        <path d="M45 60V40h20m590 0h20v20M45 800v20h20m590 0h20v-20" />
      </g>
    </svg>
  );
}
