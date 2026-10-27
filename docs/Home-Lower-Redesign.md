# Home inferior — auditoría y rediseño

Fecha: 26/10/2026. Alcance: desde el final de `#destinos` hasta el footer del Home.

## Diagnóstico con el sitio real

Se inspeccionaron el árbol del Home, sus estilos, el catálogo, las rutas de contacto, el manifiesto de medios y los tests. Se capturó el estado previo en Chromium a 375, 768 y 1440 px.

El Home renderizaba `Hero → Destinations → GraduatesSection (preview) → ConsultationSection`, seguido por el footer global. Debajo de destinos no había otro catálogo de servicios: había dos cards casi idénticas para primaria/secundaria, un módulo separado para familias y una gran composición azul de consulta, con otra card interna y un enlace de regreso a destinos. El footer repetía la invitación a conversar.

Problemas observados:

- La escala del rótulo EGRESADOS competía con la información del servicio; las dos ilustraciones repetían la misma escena.
- Cada nivel y las preguntas de familias parecían piezas independientes. En mobile, había que recorrer ambas cards antes de llegar a las preguntas.
- El cierre azul cambiaba bruscamente de lenguaje y utilizaba un listado de destino/fecha/compañía sin aportar opciones concretas.
- Turismo nacional/internacional, viajes educativos y receptivo no tenían entradas propias en esta parte del Home.
- La trayectoria y la oficina física no respaldaban la consulta en el mismo recorrido.
- No se detectó overflow inicial a los tres anchos. La altura por sí sola no era la causa del problema.

## Decisiones implementadas

1. Una composición de Egresados con dos niveles seleccionables. Una sola historia visible, ilustración, descripción, temas para la primera charla y consulta con mensaje específico. Las preguntas de familias están dentro del mismo contenedor.
2. Tres servicios legibles como una lista editorial, sin nuevas cards o carruseles. En desktop se distribuyen en columnas; en mobile forman filas. Cada enlace prepara una consulta de WhatsApp relacionada con el servicio.
3. Reemplazo del cierre azul por oficina real, trayectoria de Javier, dirección y contacto directo. Los enlaces de historia, ubicación y horarios llevan a las rutas existentes.
4. Continuidad de fondo, ancho máximo de 1200 px y ritmo vertical compartido. Se conservan Inter, los tokens de marca y el footer existente.

La página ahora tiene más información útil: no se afirma que sea más corta. El espacio adicional presenta servicios y respaldo que antes faltaban en el Home. Se eliminaron las cards duplicadas y la composición de contacto anidada.

## Arquitectura y soluciones reutilizadas

- `src/features/graduates/graduates-preview.tsx` y su CSS Module: vista breve del Home; el módulo ampliado de `/destinos` mantiene su composición.
- `src/components/sections.tsx` y su CSS Module: `ConsultationSection` conserva el ancla `#consulta` y reúne servicios, confianza y contacto.
- `tests/premium.spec.ts`: adapta las expectativas del Home al selector y conserva las comprobaciones del catálogo.
- `tests/home-lower.spec.ts`: tres tamaños, agrupación/selección, foco por teclado, accesibilidad de los dos niveles, mensajes, rutas, ausencia de overflow y funcionamiento sin JavaScript/zoom.

Se reutilizan `graduates.levels`, `whatsappUrl`, `site`, `credentials`, `resolveMedia` y `MediaContent`. No se instalan paquetes, ni se añade JavaScript de cliente para el selector. Los radios nativos y CSS `:has()` permiten la selección con click, teclado o sin JavaScript. Las transiciones se desactivan con `prefers-reduced-motion`.

Referencias consultadas para la decisión REUSE/ADAPT:

- W3C, agrupación de controles: https://www.w3.org/WAI/tutorials/forms/grouping/
- Next.js, componentes de servidor y cliente: https://nextjs.org/docs/app/getting-started/server-and-client-components
- Documentación instalada de Next.js 16.4.2 para Server Components, Image y Link, en `node_modules/next/dist/docs/`.

No hace falta una librería de tabs o animación para este comportamiento.

## Medios y contenido

No hay fotos aprobadas de egresados en el manifiesto actual. Se conservaron las ilustraciones existentes con rótulo visible; no representan viajes realizados. La foto de oficina ya cuenta con autorización y variantes WebP en el manifiesto. No se añadieron retratos, pasajeros, imágenes externas, precios, itinerarios, disponibilidad o testimonios.

## Evidencia

Capturas y scripts reproducibles: `output/playwright/home-lower/` (artefactos locales ignorados por Git).

- `before-{375,768,1440}-full.png` y `before-*-lower.png`.
- `after-{375,768,1440}-full.png` y `after-*-lower.png`.
- `before-metrics.json`, `after-metrics.json`.
- `protected-hashes.json`: hashes SHA-256 tomados antes de editar; todos los archivos protegidos conservan sus bytes.
- `destinations-comparison.json`: comparación del módulo completo de destinos, con el mismo estado del carrusel. Cero píxeles distintos a 375/1440; cinco píxeles a 768. Dimensiones idénticas en los tres anchos.

El Home y el catálogo conservan ocho destinos, enlaces, imágenes, estilos e interacciones previos a esta intervención. Los cambios que ya existían al comenzar en hero, carrusel y datos no se sobrescriben.

## Validación

- `npm run lint`: exit 0, sin errores.
- `npm run typecheck`: exit 0 (`next typegen` y TypeScript).
- Build de producción aislado mediante `npm test` y `.next-qa`: compilación, tipos y generación estática correctos. No se construyó encima del servidor de desarrollo.
- Verificación de medios: 22 recursos aprobados; referencias originales: 29 hashes intactos.
- `npm test`: exit 1; 93 pruebas pasaron y 34 fallaron en la primera ejecución. Cinco fallos pertenecían a los tests nuevos/adaptados de foco, que comprobaban `:focus-visible` después de activar con mouse. Se corrigieron para entrar explícitamente con teclado, sin cambiar el comportamiento del producto.
- Reejecución final sobre el build aislado con `npx playwright test --grep-invert 'referencia visual'`: **98 passed, exit 0, sin fallos ni flaky**, en 3 minutos.
- Los **29 tests de `tests/visual.spec.ts` siguen fallando**: Home se compara con un diseño anterior (y reemplaza el hero por un fixture histórico); Destinos espera elementos `.postcard` y rotaciones que ya no existen; la normalización de Nosotros elimina su narrativa y por tanto su H1; Contacto y menú difieren de sus PNG históricos. No se modificaron esos tests ni sus capturas para aparentar una suite completa verde. Se conserva la primera ejecución en `output/playwright/home-lower/full-suite-results.json` y `full-suite-report/`.
- Inspección visual de capturas reales a 375, 768 y 1440 px y de ambos niveles de Egresados. Sin overflow en las páginas reales; los tests generales también pasan a 320, 360, 390 y 1024 px.
- Axe: cero infracciones en ambos niveles y los servicios a los tres anchos, y en las rutas completas en la suite general.
- Teclado: foco visible, flechas entre radios y enlaces. Sin JavaScript: selector y acceso a preguntas conservados. Reflow a 200% correcto.
- Cambio de nivel: altura idéntica del bloque a 375, 768 y 1440 px, medida en navegador. Capturas y alturas quedan en `level-heights.json` y en los resultados de los tests.
- Enlaces a preguntas, historia y oficina verificados navegando a sus secciones. Los enlaces de WhatsApp apuntan al número configurado y contienen el mensaje correspondiente; las pruebas no envían mensajes externos.
- `git diff --check` de los archivos modificados en esta tarea: correcto. El check global detecta una línea vacía final preexistente en `src/features/destinations/data.ts:164`; se conserva porque ese archivo forma parte del módulo protegido.
- Se restauró el archivo generado `next-env.d.ts` al estado inicial, y se volvieron a verificar los hashes de los archivos protegidos.

## Límites y próximo paso

La validación de navegador utiliza Chromium local. No acredita Safari, Firefox, dispositivos físicos, métricas de campo de Core Web Vitals ni entrega de mensajes en WhatsApp. El sitio conserva su modo de revisión y no se realizó publicación.

El próximo paso de contenido de mayor valor es obtener una selección de fotos reales de egresados con autorización documentada. El resolver existente permite incorporarlas después sin cambiar la arquitectura.

Conceptos transferibles: mejora progresiva con controles HTML, separar datos y presentación, y distinguir pruebas de comportamiento de comparaciones visuales históricas.
