# Hero · luz y sombras

25/10/2026. Cambio solicitado después de aceptar la migración.

## Decisión

Se revisaron Hero 28 y la instalación oficial de React Bits Pro. Los registries
estaban configurados, pero no había clave local. El usuario eligió expresamente
una versión propia inspirada en la referencia. No se instaló el bloque Pro ni se
copió código del proveedor. No se añadieron dependencias.

Referencias consultadas: [Hero 28](https://pro.reactbits.dev/docs/blocks/hero-section/hero-28),
[instalación](https://pro.reactbits.dev/docs/installation) y
[autenticación de registries](https://ui.shadcn.com/docs/registry/authentication).

## Diseño e implementación

Hero inmersivo de borde a borde, luz cálida diagonal y sombras de palmeras dibujadas
con SVG propio. La ilustración es decorativa; no representa fotografías de destinos.
Se conservan Inter, Caveat, azul oscuro, papel, arena y acento naranja de la marca.
Se conserva la navegación y el menú. La navbar queda fija, transparente al inicio
y con fondo azul oscuro desde 60 px de scroll; las rutas interiores conservan su
cabecera sólida. El fondo del hero empieza detrás de ella, con un degradado suave
para mantener legibles los enlaces.

Por pedido posterior del usuario se retiraron márgenes, borde y esquinas redondeadas.
La altura mínima es `100svh`, con espacio interior para no tapar el título con la
cabecera. En pantallas bajas el contenido puede crecer en vez de quedar recortado.

La revisión inmersiva verifica el origen `(0, 0)`, ancho completo y altura mínima
del viewport en siete anchos. Se comprueban los estados de la navbar al bajar y
volver, y Axe sobre la cabecera. Evidencias específicas:
`output/hero-sunlight/immersive-results.json` y `immersive-browser-check.json`.
Revisión visual en 1440×900 y 390×900: el hero ocupa exactamente el viewport.

`sections.tsx` prepara sólo nombre, etiqueta, categoría, descripción y enlace de
cuatro destinos publicados. `src/features/hero/sunlit-hero.tsx` mantiene la
selección y `sunlit-hero.module.css` limita los estilos a este hero. Brasil, Caribe,
Jujuy y Cataratas son accesos de consulta; no anuncian disponibilidad ni precios.
La descripción y el mensaje de WhatsApp se reutilizan del catálogo existente.

El selector admite clic, flechas, Home y End, foco visible y un único tab activo.
Cada selección actualiza el panel y su consulta. Sólo se animan cambios iniciados
por el usuario, sin temporizadores. Reduced motion elimina las transiciones.
Sin JavaScript se ocultan los controles inactivos y permanecen el contenido de
Brasil, su consulta y el enlace al catálogo completo.

## Referencias históricas y pruebas

Las 29 imágenes originales siguen intactas. Home cambia intencionalmente: no se
afirma que su hero real sea igual al anterior. `tests/hero.spec.ts` comprueba el
hero real y guarda siete capturas en `output/hero-sunlight/hero-*.png`.

La comparación histórica de Home reemplaza exclusivamente en el DOM de prueba
el hero nuevo por `tests/fixtures/hero-before-sunlight.html`, capturado antes del
cambio. Así puede detectar cambios en el resto de la composición sin sobrescribir
baselines. Esa normalización no valida el hero nuevo y se informa separadamente.
Los estilos anteriores se conservan por esta referencia histórica.

Validación final del alcance: lint, TypeScript, verificación de medios, build de
producción aislado y **15 pruebas aprobadas**. Incluyen las nueve pruebas del hero,
teclado/consultas, Axe en tres estados seleccionados, ausencia de JS, siete anchos,
menú, movimiento reducido, metadata, errores de formularios y reflow. Se revisaron
visualmente las capturas reales de producción en 390 y 1440 px, sin observar
recortes de texto ni solapamientos. No se enviaron mensajes a WhatsApp.

Comando final: `npm test -- tests/hero.spec.ts tests/accessibility.spec.ts
tests/interactions.spec.ts --grep-invert "reel de destinos|cuatro rutas"`.
Resultado conservado en `output/hero-sunlight/final-focused-results.json`.

La primera ejecución integrada tuvo 32 aprobadas y 11 fallidas. Dos aserciones
propias se corrigieron: el test del hero dependía innecesariamente de tarjetas
externas a él, y la prueba de parallax debía acercarse al pasaporte de Nosotros
en Inicio antes de medir su movimiento. Ambas pasan en la ejecución final.

Las otras diferencias corresponden al reel de destinos y sus pruebas, que estaban
cambiando simultáneamente: siete comparaciones históricas de Home y dos pruebas
del carrusel/navegación sin JS. No se ocultaron ni se restauró ese trabajo. Las
otras 22 comparaciones visuales pasaron. **La suite global no se declara aprobada**;
debe repetirse cuando el trabajo concurrente del reel esté integrado.
Reporte inicial: `output/hero-sunlight/first-integrated-results.json`.

## Límites y próximo paso

La escena SVG evita descargar imágenes, video o un motor WebGL. Los filtros de
desenfoque y grano requieren revisión en móviles físicos antes de publicación;
la validación local en Chromium no mide Core Web Vitals de producción.
No hubo commit, push ni deploy.

Concepto: una mejora progresiva mantiene enlaces útiles antes de hidratar React;
la interacción se añade sobre ese contenido. CSS Modules evita que el nuevo
diseño altere secciones compartidas. La referencia visual inspira la composición,
sin exigir instalar una biblioteca para reproducir una idea de diseño.
