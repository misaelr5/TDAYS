# Validación audiovisual — 25/10/2026

## Resultado

**70/70 pruebas Playwright aprobadas**, cero fallidas, omitidas o flaky, sobre la selección y los recortes finales. Build de producción, TypeScript, ESLint, verificación de medios y `git diff --check` aprobados.

La validación usa una copia en `output/media-audit/qa-final/`, con fuentes separadas y una junction solo para las dependencias instaladas. Sus salidas Next, declaraciones generadas, resultados y puerto de pruebas 3229 son propios. La configuración de esa copia permite resolver las dependencias compartidas mediante las raíces de Turbopack/tracing; no se cambió la configuración del proyecto para conseguirlo.

Se compararon por SHA-256 las fuentes de `src/` y los archivos de `public/` con la copia probada: sin diferencias, excluyendo solamente originales privados e inspiración que no forman parte de la aplicación. Los diez manifiestos de tracing del build no incluyen referencias a la carpeta original de material.

## Checks ejecutados

| Check | Resultado / evidencia |
|---|---|
| `npm run lint` | Aprobado en el repositorio principal. |
| `npm run verify:media` | Diez variantes referenciadas válidas: desktop/móvil de cinco fuentes. Las cinco variantes small adicionales están preparadas, sin referencias obligatorias del manifiesto. |
| `npm run build:qa` | Build estático de producción aprobado en copia aislada. Se generaron las cuatro páginas, robots y 404. |
| `tsc --project tsconfig.qa.json --noEmit --incremental false` | Aprobado después del build, dentro de la copia. |
| Playwright: media, content, hero, site, accessibility | 70 aprobadas, Chromium, 102,17 s en la última ejecución. |
| Responsive | Cuatro rutas a 320, 360, 375, 390, 768, 1024 y 1440 px; sin desborde horizontal. |
| Accesibilidad | Axe a 390 y 1440 px en las cuatro rutas; foco, navegación sin JS y zoom CSS al 200%. |
| Privacidad y autorización | Pendientes/rechazados conservan fallback; no se exponen notas internas; no se solicitan MP4 en Inicio o Nosotros. |
| WebP públicos | Quince archivos, **372.042 bytes en total**, ninguno supera 110 KB; sin chunks EXIF/XMP/ICCP. Este total no equivale al peso descargado por página. |
| Originales | 336 rutas, tamaños y SHA-256 coinciden con el inventario inicial. |
| Video privado V068 | Ambos MP4 decodifican completos sin errores; sin audio ni etiquetas personales, faststart y posters inspeccionados. |
| `git diff --check` | Sin errores de whitespace. Git mantiene cambios previos ajenos. |

Resultado JSON de la ejecución final: `output/playwright/media-final-70-results.json`. El reporte HTML completo y los resultados de la copia están en `output/media-audit/qa-final/output/playwright/`.

## Revisión visual renderizada

Se inspeccionaron directamente los recursos optimizados y las capturas reales de Chromium. No se utilizó una imagen de referencia externa ni se sustituyó material por fotografías generadas.

- [Nosotros desktop, 1440 px](../output/playwright/media-about-desktop-final.png).
- [Nosotros móvil, 390 px](../output/playwright/media-about-mobile-final.png).
- [Equipo desktop](../output/playwright/media-team-desktop-final.png).
- [Equipo móvil](../output/playwright/media-team-mobile-final.png).

Las capturas aisladas del equipo ocultan solo la cabecera fija y el enlace de salto durante la captura para que no tapen el módulo al fotografiar toda su altura. Las capturas de presentación conservan la navegación real. No se aplicó esa modificación al sitio.

La primera pasada detectó un desborde de un píxel en Nosotros al 200%: la columna `1fr` de la grilla retenía el ancho mínimo del retrato. Se reprodujo y se verificó la corrección con `minmax(0, 1fr)`, manteniendo la prueba estricta. También se corrigió el recorte de cuerpo entero en avatares pequeños: ahora muestran rostro y hombros. Después se repitieron las 70 pruebas con los recursos definitivos.

Vista local de revisión de esta copia: **http://127.0.0.1:3228/nosotros**. No es un deploy ni modifica el servidor compartido del puerto 3210.

## Reparación del servidor habitual después de la entrega

El usuario reportó una foto expandida y módulos sin diseño en el puerto 3210.
Se reprodujo: el servidor de desarrollo entregaba clases vacías en el contenedor
de Nosotros y los cuatro retratos, aunque los archivos CSS respondían HTTP 200.
Los contenedores de los retratos medían 0 × 0 y su posición era `static`; las
imágenes con `fill` quedaban sin su referencia de tamaño y posición. El servidor
de la copia aislada entregaba las clases correctas.

Se reinició únicamente el proceso de desarrollo de este repositorio en el puerto
3210. Sin modificar componentes ni estilos, las clases se recompilaron y los
retratos volvieron a contenedores `position: relative`, de 240 × 300 y 56 × 56 px.
Esto confirma un estado inconsistente de compilación del servidor anterior;
no se determinó qué cambio previo disparó ese estado.

Se verificaron las cuatro rutas en el propio 3210, a 1440 y 390 px: sin desbordes,
imágenes rotas, retratos sin límite ni errores HTTP de CSS/JS/imágenes. Se abrieron
las [capturas desktop](../output/playwright/css-repair-1440.png) y
[móvil](../output/playwright/css-repair-390.png) para comprobar el resultado real.
Las pruebas de la entrega anterior correspondían a la copia aislada; faltaba
resolver este servidor compartido.

El arranque regeneró `next-env.d.ts` con referencias a `.next/dev/types/` y creó
las instrucciones `AGENTS.md` de Next.js. Son efectos del servidor de desarrollo;
no se modificaron los originales audiovisuales ni los módulos de Egresados.

## Límites

- Navegador real automatizado: Chromium. No se probaron Safari, Firefox ni dispositivos físicos.
- No se midieron Core Web Vitals de campo ni se declara un puntaje Lighthouse. La reducción de archivos, prioridad y carga responsive se verificaron; no se inventan resultados de LCP.
- No se ejecutó la suite histórica de comparación píxel a píxel ni se actualizaron sus baselines. El build de QA verificó que las 29 referencias originales mantienen sus hashes.
- La auditoría de videos usa cuatro muestras por archivo, sin reproducción continua ni escucha. La decodificación completa de los dos derivados privados es un check técnico, no una revisión editorial continua o permiso de pasajeros.
- Los permisos y edades pendientes siguen requiriendo confirmación humana. No se publicó material de pasajeros, eventos o menores.

## Alcance de archivos

Se añadieron derivados públicos, scripts locales e informes. La integración modifica de forma puntual `src/config/media.ts`, `src/features/agency/team-member.tsx`, `narrative.tsx` y `narrative.module.css`, y adapta los contratos de `tests/media.spec.tsx` al manifiesto institucional. README, el flujo de medios y `.gitignore` documentan la situación actual.

No se editaron los módulos de Egresados ni las páginas de Inicio/Destinos durante esta tarea. No se hicieron commits, push o deploy.
