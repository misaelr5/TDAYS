# Video original y nuevo módulo de Egresados — 01/11/2026

## Implementado

Se restauró el video anterior del hero por pedido expreso del usuario: `hero` del manifiesto, El Maestrazo en las termas, con sus variantes desktop/mobile y póster. Se conservan la reproducción/pausa y el respeto por movimiento reducido y ahorro de datos. La foto escolar ya no sustituye ese video. No se modificó el archivo audiovisual original ni su autorización. Esta elección de medio debe conservarse salvo nuevo pedido del usuario.

El módulo de Egresados se reemplazó en Inicio y Destinos:

- Primaria y Secundaria tienen dos propuestas completas visibles, lado a lado en escritorio y en una columna en mobile.
- Naranja para primaria y azul para secundaria; fotografías reales, encabezados grandes y consulta específica en cada propuesta.
- Bloque propio para las familias, con acceso a cómo empezar, acompañamiento y condiciones antes de contratar.
- El Maestrazo aparece aparte, como propuesta para docentes.
- Se conservan los enlaces profundos anteriores, el acceso desde Inicio al detalle ampliado y la guía existente de preguntas.

El menú móvil y los ocho destinos se conservan. No se añadieron fechas, precios, servicios incluidos, testimonios ni condiciones comerciales nuevas. Los textos y permisos de medios existentes siguen siendo la fuente de contenido.

## Arquitectura y soluciones usadas

`GraduatesPrograms` es un componente de servidor. Las propuestas se ven desde el HTML inicial; no hay pestañas, selector de categorías ni paneles escolares ocultos. Se reutilizan Next/Link, CSS Grid, HTML semántico, el manifiesto de medios y las consultas de WhatsApp. No se añadió ninguna dependencia.

Se retiraron los componentes y estilos anteriores de preview, explorer y showcase. El centro de ayuda conserva su interacción independiente. Su consulta general permanece general; los mensajes específicos están junto a cada propuesta. Un enlace directo a una propuesta conserva también su consulta específica en el pie de la guía mientras ese fragmento está activo.

Los accesos locales a las respuestas usan anclas nativas y CSS `:target`, tanto antes como después de hidratar. Esto corrige un caso donde Next/Link cambiaba la URL pero la respuesta permanecía oculta.

El cambio respeta el equilibrio elegido por el usuario: identidad joven para los alumnos y una entrada clara a la información de las familias. La jerarquía de secciones y encabezados sigue el [patrón de estructura de página de WAI](https://www.w3.org/WAI/tutorials/page-structure/headings/).

## Archivos principales

- `src/features/hero/scenic-hero.tsx` y su CSS: restauración del medio y control de video.
- `src/features/graduates/graduates-programs.tsx` y su CSS: presentación nueva.
- `src/features/graduates/graduates-section.tsx` y `graduates.module.css`: integración con el módulo ampliado y guía.
- Pruebas escolares, de Inicio, guía, medios y acceso desde menú: adaptadas al recorrido nuevo.

## Validación

Lint, tipos, build de producción aislado y `git diff --check`: exit 0. Verificación de medios: 42 variantes aprobadas. Los hashes de 29 capturas originales y 36 referencias anteriores permanecen intactos.

- Matriz principal: **96 pruebas aprobadas, exit 0**, en Chromium, Firefox y WebKit.
- Cierre de los accesos a respuestas y regresión de la guía: **21 pruebas aprobadas, exit 0**, en los mismos tres motores.
- Cobertura única: **102 casos por etapas**, 34 por motor; las 15 pruebas repetidas de la guía no se cuentan dos veces. No es la suite completa del repositorio.
- Se comprobaron 320, 360, 375, 390, 768, 1024 y 1440 px según el escenario, foto y consulta por grupo, enlaces profundos, historial/recarga, foco, teclado, movimiento reducido y uso sin JavaScript con zoom al 200%.
- Se inspeccionaron capturas reales a 390 y 1440 px. La reproducción del video anterior y su pausa se comprobaron además en navegador local a 390 y 1440, con los archivos mobile y desktop correctos.

Los resultados completos están en `tests-main.json` y `tests-familias.json`, dentro de la carpeta de evidencia. Esta revisión no ejecutó ni se atribuye las mediciones Lighthouse de la entrega previa.

Evidencia y copias previas: `output/playwright/egresados-v2/`. Las referencias de píxeles históricas no se actualizaron para ocultar el rediseño.

## Riesgos y siguiente paso

Trabajo local, sin commit, push ni despliegue. Las mediciones de rendimiento de la revisión anterior no son una medición de este estado. La aceptación visual en un teléfono real y los pendientes comerciales documentados siguen correspondiendo al propietario.

El siguiente paso útil es revisar juntos el módulo en un teléfono real. El cambio técnico más importante para estudiar es cuándo eliminar estado: si las dos propuestas deben verse y compararse, el HTML visible resuelve la tarea con menos código que un selector de pestañas.

## Actualización: título y animaciones solicitadas

El título ahora se presenta como **EGRESADOS.**, ocupa todo el ancho disponible y alcanza aproximadamente 205 px en una pantalla de 1440 px. Se comprobó que permanece en una línea a 320, 390, 768 y 1440 px. La introducción queda debajo del título.

Se reutiliza el observador `ScrollReveal` de Nosotros: entrada suave de 18 px al aparecer, una sola vez, con un desfase de 80 ms entre las dos propuestas en escritorio. Las fotos reciben un acercamiento sutil y las flechas acompañan el hover en dispositivos con puntero preciso. No se agregaron dependencias. El contenido sigue visible sin JavaScript; el foco, los enlaces directos y la preferencia de movimiento reducido evitan ocultarlo o animarlo innecesariamente. El video del hero y el diseño aprobado de las tarjetas se conservan.

Validación de esta actualización: lint, tipos, build aislado y `git diff --check` correctos; **48 pruebas aprobadas en Chromium, Firefox y WebKit**, incluyendo responsive, accesibilidad, entrada al hacer scroll, foco, movimiento reducido y uso sin JavaScript con zoom. Es una selección enfocada, independiente de los resultados anteriores. Evidencia: `output/playwright/egresados-motion/`, con capturas del título a 320, 390 y 1440 px y `tests-final.json`. Los hashes de las referencias originales y actuales permanecen intactos. Trabajo local, sin publicación.

Para la entrega al repo también se renovó la referencia visual vigente: **36 capturas** de las cinco páginas y el menú móvil, a 320–1440 px. Esto permite que la prueba de regresión compare con este diseño. Las **29 referencias históricas** siguen intactas; no se sustituyeron por capturas nuevas.
