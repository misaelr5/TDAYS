# Inicio y entradas suaves — 02/11/2026

## Alcance

Revisión local del Inicio a 320, 390, 768 y 1440 px. Se preservan textos, identidad, catálogo y medios existentes. No incluye publicación remota, medición de Core Web Vitals ni validación en dispositivos físicos. Hay cambios concurrentes de contenido y medios que se preservan y no se atribuyen a esta entrega.

## Hallazgos corregidos

| Ubicación | Hallazgo | Corrección |
|---|---|---|
| `src/components/sections.module.css:32` | A 768 px, el título de Servicios ocupaba cuatro líneas por una división demasiado estrecha. Las flechas quedaban a distintas alturas. | Introducción en una columna hasta 1000 px; filas de las opciones con altura compartida y flechas alineadas. |
| `src/components/sections.module.css:44` | El pin decorativo podía acercarse al título en pantallas angostas. | Espacio reservado a la derecha del título móvil; prueba geométrica de no intersección con las líneas de texto. |
| `src/components/destination-cards.module.css:3` | La suma del padding inferior de Destinos y el superior de Egresados dejaba una pausa grande. | Padding inferior del preview entre 32 y 56 px; se conserva el respiro superior de Egresados. |
| `src/features/graduates/graduates.module.css:11` | El final de Egresados y el inicio de Servicios sumaban hasta aproximadamente 158 px entre contenidos. | Padding inferior del preview entre 32 y 56 px; sin márgenes negativos ni superponer secciones. |
| `src/app/layout.tsx:43` | Scroll suave global sin la declaración requerida por Next 16: las mediciones durante el cambio de ruta podían usar una posición transitoria. | `data-scroll-behavior="smooth"`, según la guía instalada de Next 16, para coordinar la restauración de scroll. |
| `src/components/destination-cards.module.css:75` | El selector de entrada del título del carrusel también alcanzaba el catálogo completo al agregar animaciones a sus tarjetas. | Selector limitado al preview; el título del catálogo conserva su entrada propia y no depende de las tarjetas pendientes. |

La medición antes/después no mostró desbordamiento horizontal a ninguno de los cuatro anchos. Las secciones mantienen límites contiguos y el espaciado se produce mediante padding, sin choques. A 768 px, las flechas de Servicios quedan alineadas. No se detectaron infracciones de axe en el Inicio con las etiquetas WCAG 2 A/AA y 2.1 AA usadas por las pruebas.

## Movimiento

Se reutiliza `ScrollReveal` y `IntersectionObserver`; no se incorporan dependencias. Los nuevos bloques usan `data-soft-reveal`, opacidad y 8 px de desplazamiento durante 420 ms, sin desenfoque ni escala. Se registran una vez y se dejan de observar al entrar.

Se completaron Servicios (introducción y opciones), turismo desde China, pie de página, tarjetas del catálogo ampliado, guía escolar (introducción, ayuda, respaldo y cierre) y secciones de Términos. Hero, banda de confianza, carrusel, Egresados, Nosotros y Contacto conservan sus entradas existentes.

El observador reconoce contenido que llega después de navegar, espera el render antes de medir y limpia observadores y cuadros programados al salir. El observador general excluye los nuevos bloques de los observadores de animaciones existentes para evitar duplicación.

Con movimiento reducido se anula la animación. Con foco de teclado o un ancla activa el bloque permanece visible. Sin JavaScript, los atributos no ocultan el contenido. No se agregan pantallas de carga ni demoras artificiales para descargar contenido.

## Evidencia

Capturas y geometría antes/después: `output/home-audit/before/`, `output/home-audit/final/`. Pruebas nuevas: `tests/home-scroll-audit.spec.ts`. Las capturas largas con contenido fijo pueden incluir el enlace de salto o controles del modo desarrollo en posiciones que no corresponden a la vista normal; no se toman esos artefactos como defectos del diseño.

Criterios de revisión: [Web Interface Guidelines de Vercel](https://github.com/vercel-labs/web-interface-guidelines/blob/main/command.md). Se consultaron también las guías locales de Next 16 y el flujo de QA aislado del proyecto.

## Validación final

- Lint, TypeScript, build de producción aislado en `.next-qa`, verificación de medios y `git diff --check`: aprobados.
- 20 pruebas focalizadas aprobadas en Chromium y WebKit: auditoría de Inicio y recorrido inferior, cuatro anchos de auditoría, teclado, reflow al 200%, movimiento reducido, navegación entre rutas y contenido sin JavaScript.
- Tras limitar el selector del título del catálogo al preview se repitieron build/TypeScript y las 2 pruebas de navegación en ambos motores: aprobadas. El título del catálogo permanece visible mientras hay tarjetas pendientes.
- 29 referencias históricas y 36 actuales conservan sus hashes. No se ejecutó la suite completa ni se midió Lighthouse; tampoco se validaron teléfonos físicos.
- Sin commit, push ni despliegue por esta tarea. Se preservaron los cambios concurrentes del resto del sitio.

## Próximo control útil

Cuando terminen los cambios de contenido y medios que se están haciendo en paralelo, hacer una única pasada visual sobre ese estado consolidado antes de publicar y actualizar las referencias visuales que correspondan. Las capturas de esta auditoría describen el estado inspeccionado durante esta entrega.
