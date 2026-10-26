---
name: travel-days-glass
description: Sistema visual liquid glass de Travel Days. Usar al crear o restilizar cualquier componente, sección o página de este proyecto (header, tarjetas, botones, pills, formularios, overlays) para mantener tokens, vidrio, tipografía y accesibilidad consistentes.
---

# Travel Days · Liquid Glass

Antes de diseñar, leé `docs/Linea-Visual.md` y los tokens de `src/app/globals.css`. Reutilizá tokens; no inventes colores nuevos.

## Tokens

| Token | Valor | Uso |
| --- | --- | --- |
| `--brand-blue` | `#006cf9` | Marca, acentos fríos |
| `--brand-orange` | `#f58634` | Único acento cálido; usarlo poco |
| `--action` | `#0053c7` | Texto de CTA sobre fondo claro (AA) |
| `--ink` / `--deep` | `#142333` / `#0c1b30` | Texto / tinte oscuro del vidrio |
| `--surface` | `rgba(255,255,255,.74)` | Vidrio claro sobre fondo claro |
| `--glass-border` | `rgba(255,255,255,.8)` | Borde de luz |
| `--glass-shadow` | `0 18px 50px -32px rgba(20,35,51,.3)` | Sombra flotante |
| `--radius-card` | `24px` | Tarjetas. Pills y botones: `40px` |
| `--ease` | `cubic-bezier(.16,1,.3,1)` | Transiciones |

Tipografía: solo Inter (`--font-body`), titulares en formato oración, peso moderado.

## Recetas de vidrio

Todas combinan cuatro capas: fondo translúcido en degradado, borde de luz, brillo interior arriba (`inset 0 1px 0`) y `backdrop-filter: blur() saturate()`.

**Vidrio claro** (sobre imagen u oscuro, con contenido en tinta o `--action`):
```css
border: 1px solid #ffffffb3;
background: linear-gradient(140deg, #ffffffeb, #ffffffbf);
box-shadow: inset 0 1px 0 #fff, inset 0 -1px 0 #ffffff59, 0 10px 28px -18px #0c1b3099;
backdrop-filter: blur(20px) saturate(170%);
```

**Vidrio transparente** (sobre imagen, texto blanco):
```css
border: 1px solid #ffffff38;
background: linear-gradient(140deg, #ffffff2e, #ffffff0d 55%, #ffffff1a);
box-shadow: inset 0 1px 0 #ffffff59, inset 0 -1px 0 #ffffff14, 0 12px 32px -20px #0c1b3099;
backdrop-filter: blur(22px) saturate(180%);
```

**Vidrio tintado** (texto blanco que puede quedar sobre fondo claro, por ejemplo el header tras scroll):
```css
background: linear-gradient(140deg, #1a2d4899, #0c1b3080 55%, #1a2d4899);
box-shadow: inset 0 1px 0 #ffffff40, inset 0 -1px 0 #ffffff0f, 0 14px 36px -18px #0c1b30b3;
```

**Estado activo** dentro de un grupo de vidrio: `background: linear-gradient(180deg, #ffffff38, #ffffff14); box-shadow: inset 0 1px 0 #ffffff66, 0 4px 12px -6px #0c1b3080;`

## Reglas

- El vidrio va en controles y tarjetas, no en barras de ancho completo. El header es transparente; sus pills llevan el vidrio.
- Si texto blanco puede quedar sobre fondo claro, usá vidrio tintado y `text-shadow: 0 1px 2px #0c1b3066`. El contraste debe pasar WCAG AA (los tests corren axe).
- Estilos en CSS Modules junto al componente; usá `:global(...)` solo para clases de estado existentes (`header-solid`).
- Respetá `prefers-reduced-motion`: anulá transiciones y animaciones.
- Responsive hasta 320px, foco visible (`outline-color: #fff` sobre vidrio oscuro).
- No cambies clases que usan los tests (`site-header`, `header-solid`, `menu-toggle`). Al terminar, corré `npx playwright test` sobre las specs afectadas.
