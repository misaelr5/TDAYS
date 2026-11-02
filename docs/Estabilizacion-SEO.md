# Estabilización técnica y preparación SEO — 28/10/2026

Nota histórica: el estado vigente del Release 1.0 y las ejecuciones posteriores están en [04-QA-RESULTS](04-QA-RESULTS.md). Se conserva íntegro el registro de esta etapa; sus conteos y pendientes no describen por sí solos el cierre actual.

## Alcance y decisiones

Base: `226b78884199765f4a0cb0011dcc9b79c0a83600`, rama main. Trabajo local, sin commits, push, despliegue ni cambios en hosting. `.claude/skills/apple-design/` y `skills-lock.json` se preservaron intactos y no forman parte de esta entrega.

Se reutilizan Next 16.4.2, React, History API, View Transitions con alternativa nativa, Playwright, Axe y el manifiesto de medios. Se consultaron las guías de la versión instalada sobre Link/hash, Metadata API, robots, sitemap, imágenes sociales y JSON-LD. No se instalaron dependencias. No se modificaron las afirmaciones comerciales, los términos existentes ni el flujo de WhatsApp sin persistencia.

## Fallos corregidos y causas

| Problema | Causa | Cambio |
|---|---|---|
| `/nosotros#%` rompe la página; Destinos registra URIError | `decodeURIComponent` recibía texto externo sin manejo de errores | `src/lib/fragment.ts` centraliza una decodificación segura; desconocidos usan el primer panel/tarjeta |
| Footer cambia la URL, pero no el capítulo | Next Link modifica History API sin disparar el hashchange esperado; el listener solo reconocía enlaces que empezaban por `#` | Captura acotada a enlaces del mismo documento antes de Next; el estado visible se resuelve desde la URL y escucha hashchange/popstate |
| Encabezados dentro de capítulos ocultos | Se buscaba únicamente coincidencia con el ID del capítulo | Se resuelve el panel que contiene el destino; se muestra antes de desplazar la vista |
| Saltos tardíos al cambiar rápido de URL | Una transición anterior podía terminar después de la navegación más reciente | Versionado y cancelación de transiciones; se maneja el rechazo esperado de `ready` al cancelarlas |
| Teclado desde una pestaña enfocada no seleccionada | Se calculaba la siguiente desde la selección, no desde el foco | Se parte de la pestaña enfocada; se conservan flechas, Home/End y foco |
| Capítulos sin JS que seguían ocultos | La alternativa dependía de sobrescribir la semántica nativa de `[hidden]` en este Chromium | Ocultación mediante atributo de estado y CSS; noscript expande el contenido sin depender del atributo nativo |
| Test de escape ENOENT en una descarga limpia | `mkdtempSync` suponía que `output/migration` ya existía | El propio test crea su directorio padre; sigue comprobando el rechazo del junction |
| 29 fallos visuales históricos | Contratos de tarjetas retiradas, reemplazo de hero y eliminación de H1/narrativa | Comparación histórica informativa separada de 36 regresiones actuales sobre DOM real |

La URL es la fuente de selección de capítulos; el estado React representa esa URL para renderizar y animar. No se parchea globalmente `history.pushState`, no hay polling ni librería de routing adicional. La captura de clics solo actúa sobre destinos existentes dentro de esos capítulos, del mismo origen/ruta/query; respeta otros enlaces, targets, descargas y modificadores. Los clics de pestañas agregan una entrada de historial, por lo que Atrás/Adelante recupera la selección.

## CSS concurrente conservado y revisado

Durante la etapa aparecieron cambios ajenos en trece hojas de estilo. El usuario indicó explícitamente **“Conservar el CSS nuevo y revisar sus diferencias”**. Se preservaron superficies más oscuras sobre el hero, reducción de blur redundante y alternativas opacas con `prefers-reduced-transparency` o `prefers-contrast`.

Las 36 comparaciones contra el build de `226b788` conservaron dimensiones de página. Las diferencias incluyen fondos opacos, tintes, composición y rasterización de texto tras retirar filtros; no se cambiaron textos, fotografías, estructura ni tamaño de página. Se guardaron capturas reales y mapas de diferencias en `output/playwright/css-review/`. Este Windows solicita transparencia reducida, lo que activa las alternativas opacas.

La revisión detectó texto blanco sobre fondo blanco en el CTA de catálogo de escritorio bajo esas preferencias. Se corrigió solo su color a `var(--action)` sobre el fondo blanco. Cuatro regresiones de Axe/capturas verifican el catálogo a 390/1440 px tanto con transparencia reducida como sin esa preferencia. La regla de ocultación de capítulos sin JS también se incorporó conservando el CSS concurrente.

Las nuevas referencias registran el commit base y los ajustes autorizados, con sus hashes. Los originales de la primera etapa permanecen intactos. Ver [Referencias visuales](Referencias-Visuales.md).

Después aparecieron también encuadres escolares, P130 para Maestros y V067 para Historia, con permisos específicos registrados en el manifiesto. El usuario confirmó **“Conservarlos e incluirlos en la revisión visual”**. Se preservaron y revisaron en una copia aislada (`RECREAR-stabilization-20261028`), sin tocar el servidor de desarrollo ajeno del puerto 3210. El inventario del snapshot permite distinguir lo probado de ediciones posteriores. El verificador pasa de 38 a **42 variantes**; los tests de conteo y selección de la oficina se ajustaron al contenido real, manteniendo el límite de tamaño de las imágenes.

## SEO preparado

- Origen único: `src/config/seo.ts`, `https://traveldays.tur.ar`, sin www ni barra final en el origen.
- Canonical propio, OG con URL/locale/siteName y Twitter `summary_large_image` en las cinco páginas públicas. Las imágenes usan URL absoluta. Twitter utiliza la URL canónica/OG de la página y su imagen explícita; no se agregan identificadores de cuenta no confirmados.
- `metadataBase` en layout. Sitemap con cinco URLs, sin fechas inventadas ni `/quienes-somos`. La ruta retirada sigue siendo 404 y sin canonical.
- Imagen social estática de 1200×630: derivada de `page:nosotros` (oficina autorizada, sin personas) y copy existente. La generación usa el procesador ya suministrado por Next y una fuente local para producir píxeles; no distribuye la fuente ni añade dependencias.
- JSON-LD `Organization` con nombre, URL, teléfono, email, dirección textual y redes de `site.ts`. Se omiten calificaciones, precios, ofertas, certificaciones, horarios estructurados y legajo como acreditación. Estos campos no se infieren ni se completan con datos nuevos.
- Un único interruptor: solo `SITE_INDEXING=true` habilita indexación. El valor se toma durante build. Ausente/cualquier otro valor bloquea HTML y agrega X-Robots-Tag global, incluido sitemap y recursos. robots mantiene Disallow y no anuncia sitemap.
- Se verifican ambos modos mediante build de producción real en `.next-qa` y HTTP/navegador locales. No se activó indexación en un entorno real. `.env.example` conserva false.

El origen canónico está confirmado por el usuario; no se comprobó DNS/HTTPS ni se configuró su hosting. La guía de activación paso a paso está en [README](../README.md#activación-futura-en-producción). Cambiar solo la variable de ejecución no reemplaza el build prerenderizado. Google debe poder rastrear una URL para leer su meta noindex; robots no es un mecanismo de privacidad: [documentación oficial](https://developers.google.com/search/docs/crawling-indexing/block-indexing).

## Validación de esta etapa

La suite completa final terminó con **163 pruebas ejecutadas: 162 aprobadas y una fallida, cero omitidas y cero flaky**, salida 1. Duración de Playwright: aproximadamente 5 min 39 s. La única falla es el presupuesto del poster Florio: 111.760 bytes frente al límite de 110.000. La suite todavía no está verde y esta entrega no declara la web lista para publicación.

Evidencia en `output/playwright/stabilization/`: [reporte HTML completo](../output/playwright/stabilization/full-report/index.html), `full-results.json`, `full-review.log`, `validation.json`, inventario del snapshot, capturas y diferencias. Las 36 capturas reales finales son también **idénticas por SHA-256** a sus referencias revisadas; no solo pasan el comparador visual. Los archivos de aplicación y pruebas de la carpeta original coincidieron con los de la copia validada al cierre.

| Ejecución | Resultado comprobado |
|---|---|
| Lint | Aprobado sin errores ni advertencias tras las correcciones |
| TypeScript | Aprobado |
| Medios | 42 variantes verificadas en el snapshot final; 38 en el primer estado antes de los medios concurrentes |
| Foco inicial | 20 aprobadas / 3 fallidas; conservado como evidencia de los casos corregidos |
| Foco intermedio | 11 aprobadas / 1 fallida; cancelación de transición pendiente entonces |
| Foco final, navegación y SEO apagado | 13 aprobadas, cero fallidas/omitidas/flaky |
| Build indexable local y accesibilidad | 12 aprobadas, cero fallidas/omitidas/flaky |
| Snapshot indexable con medios concurrentes, primer control | 28 aprobadas / 3 fallidas: conteo y selector anteriores, más poster de 111.760 bytes frente a un límite de 110.000 |
| Suite completa final, SITE_INDEXING ausente | **162 aprobadas / 1 fallida**, cero omitidas/flaky; salida 1 |
| Visual final | **36/36 aprobadas**, con PNG reales idénticos por SHA-256 a las referencias |
| SEO indexable del snapshot | **4/4 aprobadas** dentro del build indexable; los tres fallos de esa ejecución fueron de medios, no de SEO |
| Fixture limpio | El snapshot comenzó sin `output/migration`; el test de escape pasó tras preparar su propio directorio |
| Diff final | `git diff --check` sin errores; índice sin staging; commit base sin cambios |
| Referencias | 29 históricas y 36 actuales con hashes comprobados |

Las pruebas cubren hashes inválidos y Unicode, carga directa/recarga, Next Link de otra ruta, footer de la misma ruta, destino dentro de panel oculto, Atrás/Adelante, teclado, movimiento normal/reducido, clic Ctrl/central, reflow 200% y navegación sin JS. SEO comprueba ambos modos, el opt-in literal, headers, canonical, OG/Twitter, respuesta de la imagen, contenido exacto del JSON-LD, robots, sitemap y la ruta retirada.

Las capturas son de Chromium local. No se verificaron Safari, Firefox, lectores de pantalla, dispositivos físicos, Search Console ni tráfico real. Las comprobaciones de esquema son locales (estructura y datos publicados); no se obtuvo una validación de Rich Results Test ni una garantía de resultados enriquecidos.

El servidor ajeno de desarrollo de 3210 se dejó activo. Los servidores de revisión creados por esta tarea se cerraron. No se alteraron configuraciones de hosting ni se activó indexación real. El archivo generado `next-env.d.ts` se devolvió a sus imports de desarrollo anteriores; los checks finales se ejecutaron en la copia aislada para no interferir con ese servidor.

## Pendientes antes del lanzamiento

1. **Comercial/legal, sin cambios en este sprint:**
   - `src/features/legal/terms.ts:14`: Ley 18.829, Decreto 2182/72, legajo y autoridad nombrada. La Ley 18.829 fue derogada por el artículo 349 del DNU 70/2023; agencia y asesoría deben resolver la redacción y documentación vigente.
   - `src/features/legal/terms.ts:43`: condiciones de confirmación de reserva/pago inicial.
   - `src/features/legal/terms.ts:77`: intermediación y alcance de responsabilidad con referencia al decreto.
   - `src/features/legal/terms.ts:90`: tratamiento y cesión de datos, coherente con la operación real de la agencia fuera de la web.
   - `src/features/hero/scenic-hero.tsx:16`: “La única agencia”.
   - `src/features/hero/trust-cards.tsx:19` y `:34`: atribución de “+23 años” y sustento de “Pioneros”.
   - `src/features/china/china-section.tsx:22`: alcance de “primera empresa” y convenio frente a la evidencia disponible.
   - Verificar el CTE vigente y el alcance de las credenciales con la agencia. No se asume que el legajo general lo acredita ni se publica documentación privada.
2. **Rendimiento medido:** revisar video móvil (~574 KB), Inter (~353 KB), poster horizontal del hero en caja alta y variantes del carrusel. El recurso concurrente `public/media/travel-days/trips/maestrazo-florio-desktop.webp` pesa 111.760 bytes en el snapshot y excede el presupuesto heredado de 110.000. No se relajó el test ni se recomprimió el recurso fuera de alcance. La auditoría anterior midió LCP local simulado de 5,12 s en Inicio y 4,67 s en Destinos; no se optimizaron ni se repitieron como métricas de producción aquí.
3. **Operación y medición:** CI en GitHub, monitorización de errores y analítica sin datos personales; distinguir borrador, apertura de WhatsApp y venta real.
4. **Contenido y enlaces externos:** comprobar manualmente la ficha/editor de reseñas, Instagram y Facebook; recursos pendientes de equipo/historia solo con permiso aprobado.
5. **Hosting y lanzamiento autorizado:** DNS, HTTPS, redirecciones HTTP/www que preserven ruta/query, headers efectivos, SEO real y publicación. La sincronización de Git no sustituye la evidencia de despliegue.

## Conceptos transferibles

1. Una URL puede ser fuente de estado de UI: el panel y el historial deben ser proyecciones coherentes de ella, incluso cuando una librería cambia cómo navega un enlace.
2. Una prueba reproducible crea su estado y registra su referencia. Una captura histórica conserva evidencia, pero no define un diseño nuevo aprobado.
3. La configuración de una página estática se materializa durante el build: habilitar SEO exige reconstruir y comprobar el resultado servido, no solo editar una variable.
