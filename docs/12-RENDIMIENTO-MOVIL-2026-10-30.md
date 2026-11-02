# Rendimiento móvil — 30/10/2026

Continuación local de [la entrega anterior](11-ENTREGA-2026-10-29.md). Alcance: diagnosticar Inicio y Destinos, mejorar la carga preservando diseño y contenido y validar lo afectado. Sin commit, push, deploy ni cambios de indexación.

## Diagnóstico e implementación

- **Póster del hero descargado dos veces.** En conexión fría, `img.currentSrc` todavía podía estar vacío al hidratar. El video usaba entonces el WebP original, además de la imagen responsive de Next ya solicitada. Ahora espera `load` o `error` del póster: reutiliza la URL optimizada si cargó y permite iniciar el video si la imagen falló. Mantiene pausa por visibilidad, pausa manual, movimiento reducido y políticas de ahorro de datos/red. En Lighthouse desaparece la solicitud al WebP original (63.150 bytes transferidos en la primera base).
- **Precarga responsive.** Las imágenes marcadas `eager` usan hints nativos con `srcset`, `sizes` y consultas de ancho que coinciden con el `<picture>`. No se agregan precargas al carrusel ni a las imágenes diferidas. La primera imagen del catálogo ya tenía prioridad alta y descubrimiento en HTML: no se atribuye toda su demora a falta de prioridad. La muestra intermedia, antes de reducir la fuente, dio 59 en Inicio y 66 en Destinos: no acredita que la precarga aislada mejore ambos puntajes.
- **Fuente inicial.** El generador existente conserva las funciones estándar de composición de fontTools y los números tabulares (`tnum`) usados por el CSS. Limita la cara inicial a Latin-1 (incluido español), marcas combinantes, puntuación y símbolos usados por la interfaz. InterLatin pasa de **209.252 a 97.988 bytes**, una reducción del **53,2 %**. InterVariable original (352.240 bytes), licencia, ejes variables y respaldo por `unicode-range` se conservan. Los caracteres de latín extendido, griego y cirílico siguen pudiendo cargar la fuente original. No se agregaron dependencias de aplicación ni se instalaron herramientas: se reutilizó fontTools del cierre anterior.

Archivos de aplicación: `src/features/media/approved-media.tsx`, `ambient-video.tsx`, `src/app/fonts/InterLatin.woff2`, `inter.ts` y `scripts/subset-inter.py`. Regresiones: `tests/media.spec.tsx` y `tests/fonts.spec.ts`.

## Mediciones

Lighthouse **13.5.0**, Chromium de Playwright **1.64.1**, preset móvil predeterminado (red y CPU simuladas), build Next de producción aislado en `.next-qa`, puerto **3214**, `SITE_INDEXING=false`, `SITE_ENV=review`. Tres muestras secuenciales por ruta y fase, perfiles nuevos y misma herramienta/configuración; los resultados anteriores del 29/10 no se usan como base de esta comparación. Los builds y las pruebas de navegador no corrieron durante Lighthouse.

| Ruta | Performance antes → después (mediana) | LCP antes → después (mediana) | TBT antes → después (mediana) |
|---|---:|---:|---:|
| Inicio | 48 → 52 | 5,796 → 5,105 s | 1.445 → 1.209 ms |
| Destinos | 67 → 74 | 6,176 → 5,811 s | 430 → 204 ms |

Muestras completas, en el orden ejecutado:

| Ruta/fase | Performance | LCP (segundos) |
|---|---|---|
| Inicio/antes | 46, 48, 53 | 6,139; 5,796; 5,754 |
| Inicio/final | 53, 52, 51 | 5,122; 5,105; 5,090 |
| Destinos/antes | 68, 67, 67 | 6,363; 6,175; 6,176 |
| Destinos/final | 75, 74, 74 | 5,811; 5,847; 4,420 |

El equipo seguía ejecutando aplicaciones del usuario y un preview ajeno de Cloudflare en `RECREAR-refactor`; no se detuvieron. No se detectaron otras suites activas al comenzar. Las seis mediciones finales terminaron con exit 0 y sin advertencias de Lighthouse; la primera muestra del candidato sin `tnum` sí había advertido CPU lenta. Se conservan todas las muestras, sin elegir las de mejor puntaje. Son resultados locales descriptivos; no prueban una mejora causal aislada de cada cambio, no son datos de usuarios reales y no miden INP. El candidato previo a corregir `tnum` había dado medianas superiores (63/82), pero no conservaba la tipografía y no se utiliza para declarar el resultado de esta entrega.

Las seis muestras finales dieron 100 en accesibilidad y buenas prácticas y 69 en SEO con `noindex` deliberado. CLS mediano se conservó en 0,00136 en Inicio y 0 en Destinos. No se activó indexación para elevar el puntaje.

**El objetivo LCP ≤2,5 s y Performance ≥90 sigue pendiente.** El siguiente diagnóstico debe distinguir hidratación, composición/render y descarga del primer cuadro del video usando red/CPU aplicadas en DevTools, además de observar la futura publicación en el hosting elegido. No se retiraron animaciones ni se sustituyeron medios para elevar el puntaje.

Artefactos ignorados por Git: `output/playwright/performance-20261030/`. `before-*.json` y `final-*.json` conservan los reportes, trazas y network logs aceptados para la comparación; `after-*.json` conserva el candidato anterior a `tnum`. `summary.json` contiene las muestras y medianas antes/final, `summarize.mjs` las recalcula; `summary-before-tnum.json` conserva el resumen descartado. Se guardaron copias de los archivos editados y hashes iniciales para distinguir este delta del trabajo heredado.

## Validación

Lint y TypeScript finales: exit 0 (`lint-final.log`, `typecheck-final.log`). El build aislado del cierre de navegador terminó con exit 0 antes de iniciar Playwright; verifica los 42 medios aprobados y la integridad de 29 referencias históricas y 36 actuales.

**141 casos únicos aprobados por etapas:** 71 Chromium (incluidas las 36 comparaciones visuales exactas), 35 Firefox y 35 WebKit. Incluyen las siete resoluciones de 320 a 1440 px, teclado, navegación/historial, movimiento reducido, hero sin JavaScript, preparación de consulta, imágenes autorizadas y tres casos nuevos de póster lento/fallido por motor. La prueba de fuentes conserva la entrada `Ωμέγα Жанна Łódź` y verifica que la cara original se solicite por uso. No se acredita una corrida única de 141 con exit 0 ni la suite completa del proyecto; WebKit automatizado no equivale a un iPhone físico.

La primera pasada con la fuente corregida dejó **106 aprobadas, 1 fallo de WebKit y 34 sin ejecutar** al detenerse por `--max-failures=1`; `tests-tnum.json` conserva ese resultado. El fallo fue del guard de errores de navegador durante `page.goto` de Inicio a Contacto: cuatro precargas `_rsc` del mismo origen notificaron `access control checks` aproximadamente 113 ms después de comenzar la navegación. La causa no quedó confirmada. El mismo caso pasó luego **3/3** sin modificar aplicación, fixture, aserciones ni límites (`tests-webkit-font.json`, exit 0). La pasada posterior completa de los **35 casos afectados de WebKit pasó con exit 0**, sin retries (`tests-webkit.json`). `coverage.json` computa la cobertura única de las dos etapas y no suma las repeticiones diagnósticas. La intermitencia de precargas queda pendiente de observación.

Comparación contra los 233 hashes iniciales de código, pruebas y recursos: cambiaron solo los dos componentes de medios, los dos archivos de fuente y los dos tests previstos. No cambió ningún archivo público de medios, dato del catálogo ni estilo. El generador y este informe son los otros archivos de esta continuación. Se inspeccionaron también las capturas reales del hero a 390 y 1440 px.

Cierre: `git diff --check` exit 0, sin lock QA restante. Se detuvo únicamente el servidor propio de mediciones del puerto 3214. HEAD permanece en `226b78884199765f4a0cb0011dcc9b79c0a83600`, rama `deploy/cloudflare-preview`, con trabajo heredado y actual local sin publicar. Evidencia en `final-check.json` y `git-status-final.txt`.

El primer candidato de fuente omitía `tnum`: las capturas detectaron diferencias reales en contadores y tarjetas (1.167 píxeles en Inicio a 320 px). Se interrumpió esa corrida después de confirmar el patrón, se conservaron log, capturas y traza, y se corrigió el generador para mantener la función que usa el CSS. No se actualizaron snapshots ni se ampliaron tolerancias o timeouts. `after-*.json` corresponde al candidato anterior a esa corrección y no debe presentarse como aceptación del artefacto final; las mediciones finales se registran por separado.

## Arquitectura y soluciones reutilizadas

Se mantiene Next, `getImageProps`, `<picture>`, el componente cliente de video y las herramientas de QA existentes. No se agrega un servicio de imágenes, biblioteca de lazy loading ni fuente externa. Separar los caracteres iniciales del respaldo conserva cobertura y reduce la descarga común.

Fuentes consultadas: [React: precarga y excepción de picture](https://react.dev/reference/react-dom/components/img), [web.dev: video y póster/LCP](https://web.dev/learn/performance/video-performance), [web.dev: buenas prácticas de fuentes](https://web.dev/articles/font-best-practices), [fontTools: subsetting](https://fonttools.readthedocs.io/en/stable/subset/). Se leyeron también las guías de Image, fuentes y componentes servidor/cliente incluidas en `node_modules/next/dist/docs/` de la versión instalada.

Conceptos para estudiar: medir medianas sin ocultar dispersión; distinguir descubrimiento/descarga/render en LCP; subsetting con respaldo para conservar caracteres.
