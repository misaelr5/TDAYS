# QA del release — 28/10/2026

Ejecuciones de esta entrega sobre el working tree preservado, no resultados históricos del documento Estabilizacion-SEO. Artefactos: `output/production-readiness/` y `output/playwright/`. Estado inicial y evidencias previas no se borran.

## Verificación

| Control | Resultado |
|---|---|
| Lint inicial y tras cambios | exit 0; cierre final en lint-delivery.log |
| TypeScript tras cambios | exit 0, cierre en typecheck-delivery.log; primer intento detectó dos casts en el nuevo test, corregidos y repetidos. Builds finales también completan TypeScript estricto |
| Build de producción inicial | exit 0, cinco rutas públicas y metadata prerenderizadas |
| Build final / suite completa | exit 0: **436 aprobadas, 0 fallidas, 8 omitidas, 0 flaky**, 444 casos, 11 min 15 s, 3 workers. release-qa.log / release-results.json / release-report/index.html |
| Último ajuste de prioridad de imagen | Build y TypeScript exit 0; **72/72 aprobadas**, cero omitidas/flaky, 1,6 min. Incluye medios en tres motores y 36 comparaciones visuales. lcp-qa.log |
| Chromium / Firefox / WebKit, suite completa | 172 aprobadas / 132 aprobadas + 4 omitidas / 132 aprobadas + 4 omitidas |
| Política SEO indexable en copia aislada | **12/12 aprobadas**, tres motores, build real en 3213, exit 0. indexable-build.log / indexable-seo.log. No hubo despliegue |
| npm audit completo / producción | ambos 0 vulnerabilidades informadas |
| Escaneo de secretos | 257 archivos de texto examinados, 0 coincidencias en patrones definidos e historial; alcance limitado |
| Inventario privado | 340 originales: 146 JPG, 21 PNG, 4 HEIC, 167 MP4, 2 PDF. No se publican ni modifican. |
| Medios | Verificador de build inicial: 42 variantes aprobadas; no son 42 fotos distintas |
| Dominio | HTTPS válido al hacer fetch; sitio público distinto al repo, ver 05 |
| Schema Markup Validator | Fragmento real renderizado: 1 TravelAgency, 0 errores, 0 advertencias; evidencia TXT/PNG, sin publicación |

## Cobertura diseñada

Chromium ejecuta suite y 36 referencias visuales existentes. Firefox/WebKit ejecutan comportamiento sin comparar píxeles contra Chromium. Se instalan únicamente los motores correspondientes a Playwright 1.64.1, sin añadir paquetes a package.json.

Los tests existentes abarcan rutas, ocho destinos y sus mensajes, menú/escape/foco, errores y borrador de contacto, imágenes, navegación/historial/hash, alternativas sin JS, movimiento reducido/normal, zoom y Axe. Anchos existentes: 320, 360, 375, 390, 768, 1024, 1440 px. Nuevos tests cubren campos opcionales manipulados, privacidad de eventos y CSP/headers con hidratación real. Guardas bloquean envío/persistencia y conexiones externas inesperadas.

No se reescriben referencias para ocultar regresiones. WebKit automatizado en Windows no acredita iPhone/Safari físico, VoiceOver ni lectores de pantalla reales.

Las ocho omisiones de la suite son los cuatro escenarios de emulación de transparencia/contraste mediante CDP en Firefox y WebKit. Los mismos casos se ejecutan en Chromium y el resto de accesibilidad/funcionalidad se ejecuta en los tres. Las 36 comparaciones visuales de Chromium aprobaron tanto en la suite completa como tras el último ajuste de prioridad, sin cambiar tolerancias.

La suite completa fue anterior al único cambio final de atributos loading/fetchpriority de la primera imagen del catálogo. Tras ese cambio se reconstruyó producción y se ejecutó la selección de 72 casos sobre el nuevo código; no se confunden ambas ejecuciones ni se afirma una segunda suite global de 444 sobre esa modificación. Las fuentes de aplicación/configuración quedaron registradas por SHA-256.

El cierre de consola/CSP y Axe del formulario expandido se repitió también sobre el último build en 3212, con cero errores inesperados, cero violaciones CSP y cero hallazgos Axe en Chromium/Firefox/WebKit (`runtime-review-final.log` / `runtime-review.json`).

## Diagnóstico y correcciones entre ejecuciones

La primera suite funcional completa (sin comparaciones visuales) terminó con **378 aprobadas, 16 fallidas y 8 omitidas**, exit 1, 402 casos, 22,7 minutos, un worker. Evidencia preservada en `diagnostic-results.json`, `diagnostic-results/` y `functional-qa.log`. No se presenta como suite aprobada.

| Causa reproducida | Corrección |
|---|---|
| Firefox/WebKit reportan cancelaciones de navegación con códigos distintos de Chromium | La guarda reconoce únicamente los códigos explícitos de cancelación; sigue rechazando HTTP fallido y demás errores de red |
| Firefox con JS deshabilitado informa fuentes loaded, pero no ejecuta el callback de `document.fonts.ready.then` | `ready()` consulta estado nativo mediante polling, sin exigir callbacks de JS de la página |
| Rectángulo de 44 px reportado por Gecko como 43.9999847 | Medición del test a precisión de 0,001 px; no se reduce tamaño táctil ni se toca CSS |
| WebKit cierra el calendario al sustituir el día enfocado, antes de enfocar el siguiente | El blur sin destino real no cierra; pointerdown externo y foco externo real conservan cierre. Comprobación puntual: 12 meses seguidos sin cerrar |
| WebKit omite el skip link en Tab inicial | `tabIndex=0` explícito; comprobación puntual del primer Tab aprobada |
| Viajeros intenta enfocar el botón menos deshabilitado, o pierde foco al cambiar grupo/cantidad | Enfocar primer control habilitado al abrir o invalidar el foco; regresión real de Escape con cero pasajeros y grupo |
| WebKit reproduce video pero su loader nativo no siempre emite request de Playwright | Se verifica reproducción y currentSrc autorizado, además de rechazar URLs de video observadas adicionales. No se afirma interceptación total de su pila multimedia |
| WebKit Windows activa clic central en el mismo documento; Ctrl abre otra página | El test comprueba comportamiento nativo por motor, sin forzar una pestaña desde la aplicación |
| Hard reload inmediato cancela prefetch RSC y WebKit informa access-control checks | El test de cargas completas espera networkidle antes de recargar; la prueba de navegación real por Link y modificadores permanece. Diagnóstico rápido preservado separado |

Una revisión adicional de seis rutas estabilizadas en los tres motores dio cero errores de consola/ejecución inesperados, cero infracciones CSP y cero fallos Axe con el formulario opcional expandido (`runtime-review.json`). El primer diagnóstico de hard navigation rápida se conserva como `runtime-review-fast-navigation.json`; no se ocultan sus cancelaciones. Esta prueba no sustituye Safari físico.

Se probó el mapa con red real en Chromium: petición inicial 301, embed final 200, cero infracciones CSP, captura `map-render.png` muestra el mapa y la dirección Felipe Erdman 222. La espera del test por un texto dentro del componente de Google agotó su timeout (contenido encapsulado); se conserva ese límite junto al DOM y la captura en `map-render.json`. No se cambia la geocodificación ni se inventan coordenadas.

La corrida posterior de 441 casos terminó con 409 aprobadas, 24 fallidas, 8 omitidas (exit 1, 16,1 min). Evidencia `pre-close-results.json`/`pre-close-results/` y `final-qa.log`. Veintiún fallos provenían de un contrato que prohibía mencionar a Javier en la tarjeta; se actualizó al requisito explícito de esta entrega. Otro era el subtítulo visible detrás del menú (misma caja, diferencia limitada a y775–806); se revisó y registró su referencia. Firefox expuso 304 al revisitar una ruta cacheada sin JS: el test ahora desactiva caché igual que la fixture principal. El último fallo identificó el foco de Viajeros, corregido en la aplicación y cubierto con una nueva regresión. Los fallos no se presentan como aprobados: la corrida de cierre verifica todas las correcciones juntas.

La primera ejecución visual fue interrumpida por un build iniciado por error sobre el directorio de QA activo. Se conserva como diagnóstico y se excluye de aceptación. Las referencias se reconstruyeron desde el snapshot inicial: 32/35 páginas idénticas antes de aclarar la trayectoria; tres diferencias limitadas al poster optimizado. La firma del footer ya estaba en el estado de entrada. Después, siete vistas de Inicio cambian solo la atribución de +23 años a Javier, con idénticas dimensiones (clarified-home/comparison.json). Ver Referencias-Visuales para procedencia y hashes.

## Lighthouse móvil antes de optimizar

Lighthouse 13.5.0 existente en caché, Chromium headless de Playwright, build Next de producción local, preset móvil predeterminado, una muestra por ruta. Simulación de CPU/red de Lighthouse; no datos de usuarios ni percentil 75. El servidor local de revisión fue creado para la medición; no se mide el dev de 3210.

| Ruta | Performance | Accessibility | Best Practices | SEO | LCP simulado | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|---:|
| Inicio | 56 | 100 | 100 | 69 | 6,846 s | 539 ms | 0,00136 |
| Destinos | 65 | 100 | 100 | 69 | 7,072 s | 294 ms | 0 |

SEO penaliza el bloqueo de indexación deliberado. No se habilita indexación para mejorar un puntaje. TBT no equivale a INP. Los valores no cumplen el objetivo móvil de performance 90; no se adjudica cumplimiento CWV.

Optimizaciones verificables de esta entrega: poster Florio 111.760 → 109.758 bytes, 720×900, mismo encuadre; sharp ya instalado, WebP quality 79 effort 6. Copia anterior en `florio-before.webp` y snapshot inicial. No se relaja presupuesto de 110.000 bytes. Video reutiliza el poster responsive ya mostrado antes de pedir sus bytes. La comparación posterior se registra abajo; Lighthouse se ejecutó después de cerrar QA.

## Lighthouse posterior y resultado pendiente

Mismo Lighthouse/Chromium/preset móvil, ejecutado después de cerrar QA, una muestra por ruta. Comparación orientativa: cachés y carga del equipo no se controlaron experimentalmente, y no se atribuye toda diferencia al código.

| Ruta/fase | Performance | Accessibility | Best Practices | SEO | LCP simulado | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|---:|
| Inicio, después de ajustes | 67 | 100 | 100 | 69 | 6,547 s | 180 ms | 0,00136 |
| Destinos, antes del ajuste LCP final | 69 | 100 | 100 | 69 | 7,142 s | 271 ms | 0 |
| Destinos, ajuste LCP final | 70 | 100 | 100 | 69 | 7,461 s | 154 ms | 0 |

El último informe confirma las tres comprobaciones de descubrimiento LCP: recurso en HTML inicial, loading=eager y fetchpriority=high. Las otras siete imágenes y el carrusel de Inicio conservan carga diferida, probado en los tres motores. No se cambió diseño, imagen, encuadre, destino, orden o copy de esas tarjetas.

**No se alcanzó Performance 90 ni LCP 2,5 s.** El LCP de Destinos no mejoró en la muestra final; no se presenta el aumento del score como mejora causal de LCP. El costo restante requiere un trabajo medido sobre video/primer frame, fuente variable (~353 KB), tamaños de imagen, JS y demoras de aparición, con revisión visual de cualquier compromiso. No se elimina animación ni video aprobado para perseguir un score. INP y percentil 75 de usuarios reales no se midieron. SEO 69 refleja el bloqueo de indexación deliberado, que se conserva.

## Límites externos

Sin Search Console, datos de campo, prueba física de iPhone/Safari, Rich Results Test de la URL final, confirmación de recepción de mensajes, revisión contractual de asesoría ni despliegue autorizado. Schema.org Validator sí se ejecutó por fragmento. No se declara publicada esta versión.
