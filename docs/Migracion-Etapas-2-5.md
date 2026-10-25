# Migración Travel Days · etapas 2–5

Fecha: 25/10/2026. Base definitiva: RECREAR. La etapa 1 permanece aceptada.
Este documento describe implementación local; no acredita publicación.

## 1. Estado

| Etapa | Estado | Evidencia |
| --- | --- | --- |
| 2 · Medios | COMPLETADO | 8 pruebas y 29 referencias aprobadas antes de ampliar contenido |
| 3 · Institucional, destinos y contacto | COMPLETADO | 12 pruebas focalizadas aprobadas |
| 4 · Accesibilidad y SEO | COMPLETADO | Matriz/Axe y 9 pruebas focalizadas finales aprobadas |
| 5 · Validación y cierre | COMPLETADO | 96/96 pruebas, lint, tipos, medios, build, visuales e integridad aprobados |

## 2. Funcionalidades y arquitectura

Se ADAPTARON controles y datos del original, sin importar sus componentes visuales
ni CSS. Se REUTILIZARON Next, React, Motion, validación HTML, `getImageProps`,
Playwright y Axe existentes. No se añadieron dependencias en las etapas 2–5.
La inspección previa y las fuentes oficiales consultadas guiaron la integración;
no se reemplazó la arquitectura ni se creó otro proyecto.

La autorización y el filesystem se resuelven en servidor. Los componentes cliente
reciben sólo la información pública necesaria. La narrativa y el catálogo siguen
renderizados en servidor; el formulario conserva su estado temporal en cliente.
Los cambios editoriales usan flujo normal, estilos acotados y animaciones actuales.

## 3. Archivos

| Área | Archivos principales creados o modificados en etapas 2–5 |
| --- | --- |
| Medios | `src/config/media.ts`, `src/features/media/{files.ts,approved-media.tsx,ambient-video.tsx,media.css}`, `scripts/verify-media.mjs` |
| Integración | `src/components/{travel-objects.tsx,destination-cards.tsx,sections.tsx}`, `src/app/layout.tsx` |
| Institucional | `src/features/agency/{data.ts,narrative.tsx,narrative.module.css,team-member.tsx}`, `src/app/nosotros/page.tsx` |
| Catálogo | `src/features/destinations/{destination-details.tsx,details.css}`, `src/app/destinos/page.tsx`, selectores semánticos de `src/app/globals.css` |
| Contacto | `src/features/contact/{messages.ts,contact-form.tsx,contact.module.css}`, `src/config/site.ts` |
| SEO y navegación | `src/config/metadata.ts`, metadata de las tres rutas interiores, `src/components/header.tsx`, footer en `sections.tsx` |
| QA y configuración | `tests/{media.spec.tsx,content.spec.tsx,accessibility.spec.ts,contact.spec.ts,interactions.spec.ts,visual.spec.ts,visual-comparison.ts,baseline.sha256.json}`, `scripts/{qa.mjs,verify-baselines.mjs}`, scripts de `package.json`, `tsconfig.json` |
| Documentación | `README.md`, `docs/{Medios.md,Contacto-Navegacion.md,Bitacora.md,Migracion-Etapas-2-5.md}` |

La infraestructura QA, sus dependencias y archivos de la etapa 1 siguen presentes
sin commit; no deben confundirse con dependencias agregadas en esta continuación.
La lista completa del árbol se conserva en el reporte de integridad final.

## 4. Contenido institucional y catálogo

Fuente: documentación autorizada y `src/features/agency/data.ts` de TravelDays
original. Se incorporaron Javier Garay, inicio a los 17 años, recorrido por ventas,
supervisión, gerencia, operación y coordinación, experiencia personal declarada de
23 años y fundación en Villa Dolores en 2018. Los 23 años se atribuyen a su relato;
no se recalculan como antigüedad de la agencia.

Se muestran cuatro hitos, ocho valores, atención personalizada, tres áreas de
trabajo, tres temas de capacitación y CTA de WhatsApp/oficina. La formación se
atribuye a lo informado y no se presenta como certificación verificada. Los ocho
perfiles personales siguen pendientes y no se renderizan ni llegan al JS público.

Se conservan Brasil, Caribe, Carnavales de Jujuy, Cataratas del Iguazú, Los Túneles,
Festival de Jesús María, Bayahibe y Valeria del Mar, sin duplicaciones. Se muestran
sus descripciones existentes. Fechas, precios, moneda y servicios sólo aparecen
cuando existen datos válidos: actualmente no se cargaron esos campos ni se afirmó
disponibilidad. Las fechas y los importes sintéticos de las pruebas no se publican.

## 5. Controles audiovisuales

Manifiesto tipado con aprobación, evidencia, procedencia, variantes y focos;
validación de rutas locales, extensión, existencia y contención real frente a
symlinks/junctions. Los registros pendientes/rechazados no se publican. Un aprobado
inválido hace fallar el verificador antes del build; un archivo ausente en render
conserva el fallback. Las props públicas excluyen autorización y procedencia.

El manifiesto real está vacío: **cero medios nuevos publicados**. Se mantienen las
ilustraciones. Video decorativo disponible con activación explícita, poster,
reduced-motion, Save-Data, red lenta, visibilidad, pausa y manejo de error. No hay
video activo. En postales enlazadas se utiliza sólo poster para evitar controles
interactivos anidados. [Procedimiento y límites](Medios.md).

## 6. SEO, accesibilidad y formularios

Títulos y descripciones específicos, Open Graph y Twitter Cards coherentes en las
cuatro rutas. Se conservan `noindex` y robots `Disallow: /`. No se inventaron dominio,
canonical, imágenes sociales, certificaciones ni datos estructurados comerciales.

Jerarquía H1/H2, enlaces de historia útiles, errores asociados al campo y foco en
el primer inválido, borrador invalidado al editar, rechazo de mensajes invisibles
y codificación robusta de caracteres especiales. Se conserva el diálogo móvil,
Escape, ciclo/restauración de foco y bloqueo de scroll. Sin JS hay enlace móvil a
la navegación del footer y contactos directos. Una corrección de reflow permite
el título de Contacto al 200 % de ampliación por CSS.

## 7. Validación

Resultados integrados: **96 aprobadas, cero fallidas, cero omitidas y cero flaky**
en Chromium (150,5 segundos). Lint, TypeScript, verificación de medios y build
aprobados. `npm audit --json` reportó cero vulnerabilidades conocidas; esto no
equivale a una auditoría integral de seguridad. `git diff --check` sin errores.

Los reportes por etapa están en
`output/migration/stage{2,3,4}-*.json`; el cierre se guarda como
`output/migration/stage5-results.json`. El build usa `.next-qa/` y puerto 3211 para
preservar el servidor de desarrollo existente en 3210. Es un build de producción
real de Next con comprobación de tipos, no una prueba sobre `next dev`.

Integridad final: 849 archivos del proyecto original coinciden por SHA-256 con el
manifiesto de etapa 1; su estado Git conserva exactamente los cambios previos.
Logo público, video de referencia y datos de destinos de RECREAR sin alteraciones.
HEAD y remotos Git sin cambios. Evidencias: `output/migration/integrity-final.json`,
`audit-final.json`, `stage5-results.json` y `visual-summary.json`.

La suite cubre cuatro rutas por siete anchos (320, 360, 375, 390, 768, 1024, 1440),
navegación, carrusel, teclado, reduced-motion, ausencia de JS, formularios, medios,
datos condicionales, metadata, ausencia de filtración de perfiles y 29 visuales.
Axe comprueba WCAG 2 A/AA y 2.1 AA en rutas a 390/1440 y estados del formulario.
No equivale a certificación integral ni a pruebas con lectores de pantalla reales.

## 8. Comparaciones visuales

Las 29 referencias originales se verifican por SHA-256 antes y después de QA.
No se actualizaron. Se retiró el comando de actualización automática; el informe
de etapa 1 es histórico y sus instrucciones de actualización quedan supersedidas.

- Contacto: siete comparaciones directas de página completa sin diferencias
  detectadas por Playwright. Menú: una comparación directa sin diferencias.
- Home, Nosotros y Destinos: 21 capturas reales con diferencias guardadas. Home
  conserva la retirada de los dos rótulos confirmada por el usuario; Nosotros
  agrega narrativa y conserva la retirada del rótulo de Ubicación; Destinos agrega
  descripciones bajo las postales. No se declaran idénticas esas páginas reales.
- Para detectar regresiones en el resto de la composición se modifica sólo el DOM
  temporal del test: se retiran los bloques nuevos, se restaura el nivel del título
  de tarjeta y se reponen los rótulos anteriores. La página completa resultante
  pasa contra su referencia con `maxDiffPixels: 0` y el comparador estándar de
  Playwright. No es igualdad binaria de PNG ni una captura del producto real.
- Se revisaron visualmente capturas reales de Nosotros y Destinos en 390/1440 px:
  tipografía, columnas, divisores, espaciado, postales, textos y CTA, sin observar
  solapamientos o texto cortado. Los otros anchos tienen comprobación automatizada.

Evidencias: `output/migration/visual/*-actual.png`, `*-diff.png`, `*.json` y galería
`index.html`. Las diferencias muestran el área común; la altura agregada se informa
por separado. Esta normalización no sustituye la revisión del contenido nuevo.

## 9. Riesgos y pendientes

Pendientes de validación externa: derechos y derivados de fotos/videos finales,
decodificación de video con material real, Safari/iOS físico, lectores de pantalla
y rendimiento en despliegue público. No se midieron Core Web Vitals de producción.
El verificador acredita consistencia de registros, no derechos legales de autor.

No hay backend, almacenamiento, envío automático ni publicación de opiniones.
La web prepara mensajes; el usuario envía en WhatsApp. No se incorporó Supabase,
AccessBand ni descargas de Drive. No hubo commit, push, deploy, cambio de DNS o remoto.

## 10. Próximo sprint y aprendizaje

Próximo sprint recomendado: obtener autorización y derivados de un conjunto pequeño
de medios reales, cargar el manifiesto y revisar recortes, peso y reproducción en
móvil/desktop. Confirmar después dominio y contenido comercial antes de planificar
publicación e indexación. La integración de un receptor de formularios es otra
decisión de producto; no es requisito para el flujo actual de WhatsApp.

Conceptos transferibles: separar datos privados de props públicas del servidor;
mejora progresiva con fallback útil; y distinguir pruebas de composición heredada
de la aceptación visual de contenido nuevo.
