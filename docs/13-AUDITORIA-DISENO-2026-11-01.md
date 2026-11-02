# Auditoría de la web y foco en Egresados — 01/11/2026

**Antecedente superado en su propuesta visual.** El usuario pidió restaurar el video original del hero y reemplazar por completo este módulo. El estado vigente está en [revisión de Egresados y video](14-REVISION-EGRESADOS-Y-VIDEO-2026-11-01.md). Las capturas, pruebas y mediciones de este documento corresponden a la versión anterior y no acreditan el diseño vigente.

## Objetivo

Dar prioridad a los viajes de egresados de primaria y secundaria, mejorar la navegación móvil y ordenar la presentación con una identidad más joven. El diseño se evalúa sobre el sitio local real, no sobre el dominio público ni una maqueta. La aceptación visual del propietario no puede sustituirse por una puntuación arbitraria de 10/10.

## Estado inicial y alcance

Next 16.4.2, React 19.3.1, TypeScript, npm/Node 24, CSS Modules, Motion y GSAP. Cinco páginas públicas, ocho destinos, consultas mediante borrador de WhatsApp, sin backend de reservas, pagos, autenticación o base de datos. El repositorio ya contenía numerosos cambios de preparación de producción, SEO, medios y diseño sin publicar. Se conservaron; este informe no se atribuye ese trabajo previo.

Se inspeccionaron README, AGENTS, scripts, configuración, componentes y pruebas. Se recorrieron Inicio, Destinos, Nosotros, Contacto y Términos a 390 y 1440 px con capturas completas, revisión de encabezados, metadata, imágenes y anclas. En ese recorrido las cinco rutas respondieron 200, sin imágenes visibles rotas, anclas locales faltantes ni desborde horizontal. La validación automatizada amplía los anchos y estados.

El menú local inicial ya era azul, no blanco. Eso puede indicar una diferencia con la versión que vio el cliente; esta tarea no verificó ni modificó el sitio público. El hero también decía Egresados en grande antes de esta intervención. El problema comprobado era la prioridad del recorrido y la presentación del módulo.

## Hallazgos y cambios implementados

| Prioridad | Hallazgo comprobado | Resultado |
|---|---|---|
| Alta | El catálogo general aparecía antes de Egresados, aunque ese es el servicio prioritario. | Inicio muestra hero, Egresados, destinos, otros servicios y turismo receptivo. Se conservan los ocho destinos. |
| Alta | No había acceso Egresados en la navegación principal. | Nuevo enlace en header y footer; en el menú móvil se destaca con naranja y la aclaración Primaria y secundaria. |
| Alta | En mobile, la propuesta y su foto aparecían antes del selector de grupos. | Selector primero en el DOM y en la composición visual. Primaria y Secundaria son las dos opciones principales; Maestros ocupa una fila secundaria. |
| Media | El módulo combinaba tres filas de selección con una tarjeta, dentro de un panel gris y con el título solapado. | Encabezado independiente, Egresados grande, aclaración del nivel, panel azul claro y una propuesta con foto y texto. La selección conserva su URL y el historial. |
| Alta | El hero y los títulos grandes desbordaban al aplicar zoom al 200%. | Grid con columna reducible, tipografía limitada por el contenedor y límites/quiebre de texto para el zoom de WebKit. Reproducción local Chromium: scrollWidth de 999 a 625 px con viewport de 640 px y scrollbar; WebKit final: 640/640 en las cuatro páginas principales. Se permite que la cabecera del catálogo envuelva su enlace. |
| Media | Dos stickers del hero competían con la ayuda de la consulta en mobile. | Se retiraron esos dos elementos decorativos. Se mantiene la identidad y el resto del material existente. |
| Media | Título y descripción de Inicio no nombraban el servicio prioritario. | Metadata de Inicio centrada en Egresados de primaria y secundaria; no se activó indexación. |
| Media | Egresados figuraba al final de las opciones de consulta del hero. | Ahora es la primera propuesta tras la opción de indecisión. No se inventan fechas, precios ni paquetes escolares. |
| Media | El módulo ampliado tenía un título extenso y decoraciones adyacentes. | Egresados como título grande, primaria/secundaria explícitas en el texto contiguo y sin stickers superpuestos. |
| Alta | El hero anunciaba egresados sobre un video de docentes. La medición móvil identificó ese video como LCP, con 4,7 s. | Foto escolar P170 ya autorizada, renderizada en servidor con variantes responsive y prioridad alta, sin zoom de entrada. Inicio no descarga video. El video de la historia se mantiene en Nosotros. |

## Dirección visual y arquitectura

Paleta: azul Travel Days `#006cf9`, azul de acción `#0053c7`, naranja `#f58634`, tinta `#142333`, blanco y azul claro `#e8f1ff`. Se conserva Inter local y la escala tipográfica se ajusta al espacio real. La energía se concentra en el menú y la palabra Egresados; la lectura de propuestas y preguntas mantiene una composición tranquila.

Se conserva la separación servidor/cliente: el servidor resuelve medios autorizados y contenido; el cliente aporta selección, URL, historial y teclado. El orden del DOM coincide con lo que se ve: primero elegir grupo, después leer. Esto beneficia tanto a mobile como a quien recorre la página con teclado o lector de pantalla. La altura compartida de los paneles evita saltos al cambiar de grupo.

Ubicaciones principales de la revisión:

- `src/app/page.tsx:12`: prioridad de Egresados antes del catálogo.
- `src/config/navigation.ts:3` y `src/components/header.tsx:203`: acceso directo y presentación móvil.
- `src/features/graduates/graduates-preview.tsx:12`: encabezado y aclaración del nivel.
- `src/features/graduates/graduates-explorer.tsx:97`: selector antes del contenido.
- `src/features/hero/scenic-hero.module.css:2` y `src/features/graduates/graduates-preview.module.css:2`: ancho del contenedor para reflow y tipografía.
- `src/app/layout.tsx:18`: metadata alineada con Egresados.
- `src/features/hero/scenic-hero.tsx:11`: foto escolar autorizada en el hero, sin video ni una autorización nueva inferida para originales privados.

## Soluciones existentes usadas

- **REUSE:** Next, React, CSS Modules, tipografía local y pipeline de medios del proyecto. Ninguna dependencia añadida al repositorio.
- **ADAPT:** Header, GraduatesExplorer, GraduatesPreview, módulo ampliado y consulta existentes. No se incorpora un segundo sistema de navegación ni de formularios.
- **REUSE:** `<dialog>`, enlaces reales y patrón de pestañas. Los enlaces conservan utilidad sin JavaScript; los controles mantienen Escape, foco e historial.
- **BUILD:** CSS específico de esta presentación y una regresión del recorrido desde el menú móvil a Secundaria.

Referencias consultadas: [Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines/blob/main/command.md) y [WAI: patrón de pestañas](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/). También se leyeron las guías de CSS y componentes servidor/cliente incluidas en la versión instalada de Next. No se copió una plantilla ni se añadió código externo de diseño.

## Revisión por página

| Página | Evaluación y alcance |
|---|---|
| Inicio | Se corrigió el recorrido comercial y la entrada a Egresados. El hero muestra una foto escolar autorizada; se conservan catálogo, otros servicios y bloque China. |
| Destinos | Ocho consultas y fichas existentes. Egresados ampliado conserva categorías, mensajes específicos y guía para familias. El catálogo general no se presenta como paquete escolar contratado. |
| Nosotros | Oficina e historia reales; equipo, acompañamiento y ubicación mediante sus capítulos. Se revisó la composición; no se reescribieron datos institucionales. |
| Contacto | Formulario con validación, campos opcionales y borrador revisable. No se envió un WhatsApp real ni una reseña; no se simularon reservas. |
| Términos | Se revisó estructura y navegación. Su aprobación contractual y comercial sigue pendiente según la documentación del proyecto. No se redactaron condiciones nuevas. |

## Validación

Lint y `npm run typecheck`: exit 0. El último build de producción aislado compiló y generó las rutas correctamente, con verificación de 42 variantes de medios aprobadas. `git diff --check`: exit 0.

**256 casos únicos aprobados por etapas:** 88 Chromium, 84 Firefox y 84 WebKit. No es una corrida única de 256 ni la suite completa del repositorio. `coverage.json` calcula la unión por proyecto, archivo y nombre de prueba, sin sumar repeticiones. No se usaron retries para conseguir el resultado.

| Ejecución | Resultado y finalidad |
|---|---|
| Diagnóstico inicial Chromium | 64 aprobadas, 7 fallos: tres expectativas conservaban el orden anterior y cuatro casos expusieron desbordes al 200%. |
| Matriz amplia de diez archivos, tres motores | 204 aprobadas, 4 fallos de reflow en WebKit y 8 omitidas; estas ocho corresponden a emulación CDP de transparencia, exclusiva de Chromium. |
| Cierre de zoom y composición | **72 aprobadas, exit 0**, en los tres motores, después de corregir los límites y quiebre de texto. |
| Hero escolar, medios y fuentes | **81 aprobadas, exit 0**, en los tres motores. Incluye foto prioritaria sin descarga de video y reproducción/póster lento o fallido del video de Nosotros. |
| Último ajuste de imagen crítica | **3 aprobadas, exit 0**: confirma en los tres motores que el hero no tiene animación de entrada ni descarga video. |
| Composición final del título | **24 aprobadas, exit 0**: comprueba el texto EGRESADOS en un solo renglón de 320 a 1440 px, además de la imagen crítica. Corrige el quiebre de la S final detectado en la inspección de escritorio. |

La matriz incluye 320, 360, 375, 390, 430, 768, 1024, 1366, 1440 y 1920 px según el escenario, cinco páginas y 404, teclado, ciclo de foco/Escape, movimiento reducido, zoom, categorías con y sin JavaScript, mensajes de consulta, medios autorizados, formularios antes de hidratar y SEO de revisión. No todos los escenarios se repiten en todos los anchos. No se relajaron aserciones ni tolerancias.

Además se comprobó el menú a 320 × 568: scroll vertical funcional, último enlace alcanzable, sin desborde lateral y cierre por Escape.

### Rendimiento móvil local

Lighthouse 13.6, build de producción, perfil móvil simulado y sin suite de navegador ejecutándose en paralelo. Una pasada por estado; no se presenta como mediana ni dato de usuarios reales.

| Estado medido | Performance | LCP | CLS | Accesibilidad automática | Buenas prácticas | SEO |
|---|---:|---:|---:|---:|---:|---:|
| Inicio, video previo al cambio de medio | 73 | 4,7 s | 0,001 | 100 | 100 | 69 |
| Inicio, foto escolar y título finales | **77** | **4,7 s** | **0** | 100 | 100 | 69 |
| Destinos, recorrido de esta auditoría | **73** | **5,8 s** | **0** | 100 | 100 | 69 |

El resultado final de Inicio tiene FCP 2,1 s y TBT 120 ms. Las pasadas intermedias de la foto dieron 77/LCP 4,5 s; el último build dio 77/LCP 4,7 s. No se atribuye una mejora adicional a retirar el zoom ni una reducción concluyente de LCP frente al video. La foto sí representa la audiencia escolar y elimina su descarga de video. El descubrimiento de la imagen final pasa las comprobaciones de HTML inicial, prioridad alta y carga no diferida. Su render sigue siendo el tramo lento; requiere un perfil de estilos/layout y trabajo inicial de JavaScript antes de ampliar cambios. Destinos fue medido antes del último ajuste exclusivo de Inicio; su implementación no cambió después de esa medición. Reportes: `lighthouse-release-final.report.json` y `lighthouse-destinos-mobile.report.json` en la carpeta de evidencia.

El SEO 69 se debe al bloqueo de indexación intencional. No se activa indexación para elevar una puntuación. El 100 de accesibilidad es el resultado ponderado de Lighthouse, no una certificación manual completa: su auditoría informativa de nombres accesibles también señaló enlaces de servicios cuyo aria-label no incluye la descripción visible. Es un seguimiento menor de semántica que conviene tratar junto con el copy de esos enlaces.

Se preservan los hashes de 29 referencias originales y 36 referencias previas. Esas imágenes documentan el diseño anterior: no se afirma que este rediseño coincida píxel a píxel con ellas, ni se actualizaron silenciosamente para hacer pasar pruebas.

Evidencia local y copias de los archivos antes de intervenir: `output/playwright/design-audit-2026-11-01/`. Las capturas son material de revisión, no recursos públicos del sitio.

## Riesgos y deuda que sigue abierta

El principal pendiente técnico medido es **rendimiento móvil**: Inicio 77/LCP 4,7 s y Destinos 73/LCP 5,8 s. No se alcanzó Performance 90 ni LCP 2,5 s. Mejorar la jerarquía y pasar pruebas funcionales no los sustituye.

1. **Aceptación visual:** revisar en un teléfono real la foto escolar del hero y el nuevo módulo. La foto proviene de la autorización existente de P170; no se agregó material de menores con permiso incierto ni se generaron pasajeros ficticios. El antiguo recurso del hero permanece en el manifiesto histórico, pero Inicio ya no lo utiliza.
2. **Contenido comercial:** siguen pendientes de respaldo o aprobación las exclusividades, alcances de acreditaciones y ciertas condiciones institucionales/contractuales documentadas en `07-CLIENT-PENDING-DECISIONS.md`. Las pruebas técnicas no los validan.
3. **Dependencias:** `npm audit --omit=dev` devuelve 5 avisos moderados, 0 altos y 0 críticos en la cadena de OpenNext/Glob/minimatch. Son cinco paquetes afectados, no necesariamente cinco causas independientes. El arreglo automático sugerido propone bajar el adaptador Cloudflare de 1.20.14 a 0.3.0; no se ejecutó `npm audit fix --force`. Requiere una actualización técnica separada y validación de Cloudflare.
4. **Producción:** esta entrega es local. No acredita despliegue, cambios de DNS, apertura real de WhatsApp, indexación ni recepción comercial de consultas. Se conserva el modo de revisión/noindex.
5. **Dispositivos:** emulación y WebKit automatizado no equivalen a una prueba en un iPhone físico. La aceptación visual del dueño sigue siendo necesaria para elegir la imagen principal.

## Próximo paso de mayor valor

Revisar con el propietario el menú, la foto escolar y el módulo de Egresados en un teléfono real. Después, cerrar la información comercial documentada y los pendientes de rendimiento antes de autorizar publicación.

## Qué aprender de este trabajo

1. **Jerarquía comercial:** destacar el servicio principal exige priorizar su recorrido y sus accesos, además de agrandar el título.
2. **Orden del DOM:** el selector antes del contenido permite descubrir opciones y recorrerlas con teclado de forma predecible.
3. **Ancho de contenedor frente a viewport:** `vw` puede sobredimensionar títulos bajo zoom. Combinar unidades de contenedor con límites de ancho y quiebre de texto evita depender de una sola medida. Verificarlo en más de un motor descubrió una diferencia real de WebKit.
