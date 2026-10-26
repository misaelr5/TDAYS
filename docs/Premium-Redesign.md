# Travel Days — composición y navegación, 25/10/2026

## Implementado

- Egresados en Inicio y Destinos: selección explícita de Primaria/Secundaria con controles nativos, contenido separado de la ilustración, consulta específica por nivel y una composición estable sin cambios por hover.
- Catálogo: tarjetas horizontales en escritorio, apiladas en móvil y acceso directo a Egresados antes del listado.
- Inicio: carrusel más compacto en escritorio. Hero y medios de destinos conservan sus ilustraciones de paisaje.
- Nosotros: tipografía y fotografía de oficina mejor proporcionadas, accesos a Historia/Equipo/Acompañamiento y mayor protagonismo del retrato del propietario dentro de su perfil.

Los retratos se limitan a Nosotros. Inicio y Destinos no muestran fotografías del equipo. Se mantienen los textos comerciales y mensajes existentes; no se agregan paquetes, disponibilidad ni imágenes de pasajeros.

## Arquitectura y soluciones reutilizadas

Se conservan Next.js, React, CSS Modules, el carrusel existente, el manifiesto de permisos y los derivados audiovisuales. No hay dependencias nuevas.

El selector usa un grupo de [radios HTML nativos](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/radio) con etiquetas amplias y CSS `:has()` para mostrar el contenido elegido. No requiere JavaScript propio: funciona con clic, tacto y flechas del teclado incluso sin JavaScript. Frente a paneles animados controlados por estado, simplifica la interacción y evita activaciones involuntarias al pasar el puntero.

Se mantiene Inter y la paleta de la marca: azul `#006cf9`, acción `#0053c7`, naranja `#f58634`, tinta `#142333`, papel `#f5f6f8` y blanco. La jerarquía separa elección, relato, consulta y contexto de confianza. En móvil la escena precede al texto y los controles no dependen del hover.

Los recursos optimizados y sus permisos no se modificaron. Las cinco fuentes aprobadas siguen siendo oficina y cuatro retratos; el material pendiente conserva las restricciones de [la auditoría](Media-Audit.md). Sin fotografías adecuadas para un destino se conserva una ilustración identificada como tal.

## Validación

- Build estático de producción aprobado en una copia aislada.
- TypeScript sin errores; ESLint y verificador de medios aprobados.
- **87/87 pruebas Chromium**, sin fallos, omisiones ni flaky. Incluyen siete nuevos controles de nivel, teclado, enlaces, ausencia de retratos en Inicio/Destinos y funcionamiento sin JavaScript.
- Cuatro rutas a 320, 360, 375, 390, 768, 1024 y 1440 px, zoom al 200%, Axe y formularios existentes.
- Fuentes de `src/` y recursos de `public/` comparados por SHA-256 con la copia probada: sin diferencias, excluyendo originales privados y referencias de diseño que no son recursos de la aplicación.
- Revisión adicional del servidor habitual **3210**, después de integrar los archivos y reiniciarlo: cuatro rutas a 1440 y 390 px, sin desbordes ni recursos CSS/JS/imágenes fallidos. Cero retratos en Inicio, Destinos y Contacto; cuatro en Nosotros. El selector funciona en ambas páginas.
- `git diff --check` aprobado. Se conservaron los cambios previos del repositorio y los hashes de las 29 referencias históricas.

La copia de QA está en `output/premium-redesign/workspace/`. Resultados en `output/premium-redesign/test-results.json`; respaldo exacto anterior a esta intervención en `output/premium-redesign/before/`.

Capturas reales revisadas:

- [Inicio habitual, desktop](../output/playwright/premium-live-home-1440.png) y [móvil](../output/playwright/premium-live-home-390.png).
- [Egresados, desktop](../output/playwright/premium-graduates-home-1440.png) y [móvil](../output/playwright/premium-graduates-home-390.png).
- [Catálogo, desktop](../output/playwright/premium-catalog-1440.png) y [móvil](../output/playwright/premium-catalog-390.png).
- [Nosotros, desktop](../output/playwright/premium-about-1440.png) y [móvil](../output/playwright/premium-about-390.png).

Las capturas del módulo ocultan solo la cabecera fija durante la toma para que no lo tape. Las capturas de página conservan la navegación real. No se modificaron baselines ni se ejecutó la comparación histórica píxel a píxel: este rediseño es intencional.

## Límites y siguiente paso

No se probaron Safari/Firefox ni dispositivos físicos. No se declara un puntaje de Lighthouse o mejora medida de Core Web Vitals. Los navegadores objetivo deben admitir `:has()`; la página conserva Primaria como presentación inicial si falta ese selector, pero requiere un navegador moderno para alternar niveles.

La mejora audiovisual pendiente es obtener fotografías originales de destinos, sin texto y con permisos/contexto confirmados. No se recortan fondos de flyers ni se publica material de pasajeros o menores para suplir esa carencia.

Conceptos para aprender: usar controles nativos antes de implementar estado e interacción propios; separar permisos y presentación; validar tanto una copia aislada como el servidor que se utiliza realmente.
