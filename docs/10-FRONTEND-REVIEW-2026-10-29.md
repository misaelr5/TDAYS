# Revisión frontend, UX y SEO — 29/10/2026

Revisión de código del estado local existente, con cambios previos sin confirmar. No se ejecutaron builds, navegadores ni Lighthouse desde esta revisión paralela: la ejecución central de QA y sus resultados actuales corresponden al informe de cierre. Los informes Lighthouse citados aquí son del 28/10 y sirven como diagnóstico histórico, no como mediciones nuevas.

## Conclusión y prioridades

No se identificó un P0 funcional nuevo mediante esta lectura. El principal P1 técnico pendiente sigue siendo rendimiento móvil: los informes previos no alcanzan Performance 90 ni LCP 2,5 s. Preservar ocho destinos, diseño, identidad, imágenes autorizadas y estados sin JavaScript. No justificar un rediseño por la puntuación.

| Prioridad | Hallazgo comprobado | Acción concreta |
|---|---|---|
| P1 | Los reportes móviles anteriores dan Inicio 67 y Destinos 70; sus LCP simulados superan el objetivo. | Medir el build actual y optimizar el recurso o demora que realmente determine LCP. |
| P1 de validación | Falta 430 px en la matriz compartida (`tests/fixtures.ts:4`). | Añadir cobertura funcional separada a 430: cinco rutas, 404, menú móvil y consultas; no alterar snapshots aprobados. |
| P2 | Las fichas son anclas dentro de `/destinos`, no ocho páginas independientes. | Probar los ocho hashes y sus consultas. Crear rutas propias solo si se aprueba una ampliación editorial con contenido específico suficiente. |
| P2 | No hay BreadcrumbList; el JSON-LD global es TravelAgency (`src/app/layout.tsx:32`). | La jerarquía actual es plana. Mantener esta decisión explícita; si se crean páginas de detalle, incorporar navegación visible y schema acorde. No agregar breadcrumbs invisibles como relleno. |
| P2 comercial | La consulta tiene todos los campos acordados, pero teléfono/destino/mes/pasajeros/localidad son opcionales y están en un desplegable (`contact-form.tsx:102`). | Validar con cliente si se prioriza menor fricción o exigir esos datos. No endurecer campos unilateralmente. |

La evaluación legal de exclusividades, legajo y condiciones se trata en la revisión de contenido/seguridad; que un texto esté aprobado visualmente no acredita su veracidad.

## Topología y recorrido real

- Cinco páginas públicas: `/`, `/destinos`, `/nosotros`, `/contacto`, `/terminos`.
- Ocho fichas HTML en `/destinos#brasil`, `#caribe`, `#carnavales-de-jujuy`, `#cataratas-del-iguazu`, `#los-tuneles`, `#festival-de-jesus-maria`, `#bayahibe`, `#valeria-del-mar`.
- Inicio enlaza cada imagen del carrusel a su ficha. Cada ficha del catálogo enlaza a WhatsApp con mensaje específico (`src/components/destination-cards.tsx:21`). En móvil el primer toque abre una ficha cerrada; el siguiente sigue el enlace. El teclado enfoca y abre la ficha.
- No existen ocho rutas de detalle ni ocho modales. Su ausencia no se presenta como ocho páginas comprobadas. Las fichas y sus consultas sí constituyen los ocho detalles existentes.
- Viajes escolares forma parte de Inicio y Destinos, con Primaria, Secundaria y Maestros/El Maestrazo. Cada categoría tiene texto y consulta propios; sus FAQs aclaran que el catálogo general no equivale a paquetes escolares.
- Contacto genera un borrador revisable y abre WhatsApp. No hay envío al servidor, reserva, pagos ni persistencia. Los textos visibles explican este alcance; no hace falta simular loading o éxito de una petición inexistente.

## Rendimiento: evidencia y opciones sin rediseño

Los archivos `output/production-readiness/lighthouse-after.json` y `lighthouse-destinos-final.json` son evidencias locales históricas. Lectura de sus auditorías:

| Evidencia anterior | Lectura técnica |
|---|---|
| Inicio: VIDEO del hero es candidato LCP; resourceLoadDelay ~1203 ms y elementRenderDelay ~995 ms en el desglose observado. | `<picture>` ya se renderiza en servidor eager/high. El poster del VIDEO se asigna posteriormente en efecto (`ambient-video.tsx:31–33`); la auditoría del candidato video no lo considera descubrible inicialmente. |
| Destinos: IMG de Brasil es LCP; eager/high y descubrimiento inicial pasan. elementRenderDelay ~1801 ms. | Repetir fetchpriority no resuelve la demora restante. Examinar render, fuente y tareas del hilo principal. |
| Fuente Inter: 352.240 bytes de recurso, 353.054 transferidos. | `next/font/local` ya evita Google Fonts y usa swap; la fuente variable completa sigue siendo un recurso importante. |
| Inicio: video móvil ~574.550 bytes transferidos; imagen Brasil del carrusel ~168.434. | No quitar video o imágenes aprobados. La carga de media y el primer frame deben medirse sin ocultar funcionalidad. |

Orden recomendado de experimentos:

1. Evaluar un subconjunto local de la misma Inter que conserve todos los caracteres españoles, signos y glifos usados, con licencia y comparación de métricas/píxeles. No sustituir fuente ni añadir una librería de runtime.
2. Estudiar poster del video descubrible o comienzo de reproducción después del poster preparado, conservando selección responsive y preferencias de datos/movimiento. Comprobar que no se descarga poster desktop extra en móvil. Una implementación debe probarse antes de afirmar mejora.
3. Confirmar tamaños reales de `object-fit: cover` antes de reducir `sizes`. El carrusel utiliza fotos verticales altas: reducir a su ancho CSS sin considerar altura puede degradar nitidez.
4. Analizar chunks antes de retirar Motion/GSAP: ambos sostienen interacciones aprobadas. No hay justificación para cambiar framework o reescribir esas animaciones cerca de la entrega.

La carga diferida de las otras siete imágenes del catálogo ya existe. Los navegadores pueden anticipar imágenes próximas al viewport; ver solicitudes no demuestra que falte `loading=lazy`. TBT sintético no es INP de usuarios reales.

## Accesibilidad y resiliencia observadas en código

- Skip link al contenido, idioma `es-AR`, un H1 por ruta y estructura principal semántica.
- Menú móvil con diálogo nativo, bloqueo de scroll y restauración de foco; alternativa de navegación sin JS.
- Preferencia de movimiento reducido en CSS, MotionConfig y video; video con botón de pausa. Red lenta/Save-Data inhiben reproducción cuando la API del navegador lo informa.
- Formularios con labels, feedback de error, `aria-invalid`, asociaciones de ayuda y foco sobre el borrador; editar invalida el mensaje preparado.
- Tabs escolares con teclado y anclas útiles antes de hidratación; Nosotros conserva enlaces a capítulos y encabezados internos.
- Imagen/mapa no dispara iframe de terceros hasta solicitud explícita del visitante.
- Las pruebas existentes incluyen Axe, no-JS, navegación, transparencia reducida y 404. Son cobertura diseñada; esta lectura no acredita su ejecución actual ni reemplaza evaluación con lector de pantalla o dispositivo físico.

## Alcance de esta revisión

Archivos leídos: layout/páginas públicas, catálogo/datos/detalles/transición, carrusel/expansión, header, motion/transiciones, video/imagen, contacto/validación, escolares y capítulos/mapa de Nosotros; matriz y contratos de tests; auditorías previas. Consultadas las guías de la versión instalada de Next en `node_modules/next/dist/docs/01-app/02-guides/production-checklist.md` y `01-getting-started/13-fonts.md`.

No se modificó ningún componente, estilo, catálogo, snapshot o medio durante esta revisión. Los cambios posteriores de la ejecución central deben documentarse y validarse allí.

## Cobertura añadida después de la revisión

Se creó `tests/review-breakpoints.spec.ts`, sin alterar la matriz compartida ni referencias aprobadas. Contiene diez casos por motor: cinco casos que recorren páginas y 404 en los cinco anchos solicitados, un caso para ocho enlaces profundos/fichas y mensajes a 430 px, tres para menú móvil/foco/Escape/navegación y uno para formulario expandido/borrador/reflow a 430 px. No abre WhatsApp ni envía datos. Su ejecución queda a cargo del QA central; este documento no declara esos nuevos casos aprobados.
