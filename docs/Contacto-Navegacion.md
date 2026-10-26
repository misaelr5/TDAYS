# Contacto y navegación · 23/10/2026

## Implementado

La navegación pública queda en cuatro páginas: Inicio, Destinos, Nosotros y Contacto. `/quienes-somos` se reemplazó por `/nosotros`; la ruta anterior devuelve 404, sin página duplicada ni redirección. Se conservan las rutas técnicas de robots, icono y 404.

Inicio y el catálogo conservan sus secciones y datos. Se actualizó el enlace de historia de Inicio al nuevo destino. Header, menú móvil y footer usan `src/config/navigation.ts`; la página activa se indica en el menú.

Contacto tiene dos CTA iniciales que llevan a módulos independientes:

- **Quiero organizar un viaje:** nombre y consulta obligatorios, teléfono y destino opcionales. El teléfono puede omitirse porque el envío se realiza desde WhatsApp.
- **Ya viajé con ustedes:** experiencia obligatoria; nombre, viaje y puntuación opcionales. Es un mensaje privado, no una reseña publicada automáticamente.

Se reemplazó el gran cierre decorativo de Contacto por formularios y un bloque compacto con contacto directo, dirección y horarios reales. La composición de Inicio y Destinos se mantiene.

## Arquitectura y reutilización

Se reutilizan Next/React, el enlace `whatsappUrl`, datos existentes, estilos de marca y el patrón de borrador privado del proyecto Travel Days. La [validación HTML nativa](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Constraint_validation) cubre campos obligatorios y límites; una función compartida añade validación de espacios vacíos, teléfono y puntuación. No se añadieron dependencias.

- `src/features/contact/messages.ts`: límites, validación y composición del mensaje.
- `src/features/contact/contact-form.tsx`: formulario de consulta u opinión, estado de errores y revisión del borrador.
- `src/features/contact/contact.module.css`: estilos aislados, campos legibles y controles de al menos 48 px.
- `src/app/contacto/page.tsx`: portada, módulos y datos de oficina, renderizados en servidor.
- `src/app/nosotros/page.tsx`: historia y ubicación con datos existentes.

La información sólo permanece en el estado temporal de la página. Al preparar el formulario se muestra un mensaje para revisar y un enlace explícito a WhatsApp. El usuario confirma el envío allí. No se abre una conversación automáticamente, no se declara entrega y no se guardan o publican datos en esta web. Se invalida el borrador al editar campos para evitar enviar información anterior. Los valores no se interpolan como HTML; el mensaje se codifica mediante `encodeURIComponent`.

Sin JavaScript se ocultan los formularios inactivos y aparecen dos alternativas de contacto directo. Los formularios declaran POST para no incorporar datos personales a la URL si se intentara un envío nativo antes de completar la hidratación; el funcionamiento normal intercepta el envío en cliente.

## Validación

- Lint, TypeScript y build de producción aprobados.
- Las cuatro rutas en 320, 390, 768 y 1440 px: 16 combinaciones, HTTP 200, un H1, sin desbordamiento del documento ni imágenes rotas.
- `/quienes-somos`: HTTP 404 confirmado. El menú contiene sólo las cuatro rutas acordadas.
- Se probaron campos obligatorios, nombre/opinión con espacios, teléfono inválido y corregido, puntuación omitida y puntuación 5, composición de ambas consultas y borrador invalidado al editar.
- Se verificaron texto y número de los enlaces de WhatsApp sin abrirlos ni enviar mensajes. Texto con etiquetas se trató como texto y se conservó codificado en el borrador.
- El estado de revisión recibe el foco. El menú móvil mantiene el foco y cierra al navegar a Nosotros.
- Sin JavaScript: formularios ocultos y dos enlaces alternativos visibles.
- axe-core con WCAG 2 A, 2 AA y 2.1 AA sobre Contacto a 390 y 1440 px: cero infracciones detectadas. No equivale a certificación integral.
- Sin errores JavaScript ni solicitudes externas durante las comprobaciones. La prueba de la ruta retirada produce un HTTP 404 esperado en la consola de red.

Evidencia local: `output/playwright/contact-audit-summary.json`, `contact-audit-result.txt`, `contact-audit.js` y capturas `update-contacto-*.png` / `update-nosotros-*.png`. El archivo de validación inicial describe un estado anterior.

## Límites y próximo paso

No hay almacenamiento, CRM, endpoint de correo ni publicación de opiniones. Se conserva `noindex`; no hubo commit, push o deploy. Safari/iOS físico y rendimiento público no se probaron en esta revisión.

Si se necesitan solicitudes guardadas automáticamente, la siguiente etapa es elegir y conectar el receptor de formularios, con estados reales de éxito/error y manejo de datos; no conviene simular esa entrega con un mensaje de éxito en el frontend.

## Concepto para aprender

Separar **validar**, **preparar un borrador** y **confirmar entrega** permite mostrar estados honestos y conectar un backend más adelante sin reescribir la presentación. Invalidar el borrador al editar evita que el CTA conserve datos desactualizados.

## Continuación de la migración · 25/10/2026

Los errores identifican su campo mediante `aria-invalid` y `aria-describedby`, sin
perder las ayudas existentes. La validación nativa informa y enfoca el primer campo
inválido; editar otro campo no borra ese error. Se rechazan mensajes hechos sólo de
espacios o caracteres invisibles. La construcción de WhatsApp conserva Unicode y
convierte secuencias UTF-16 aisladas antes de codificar para evitar `URIError`.
Editar cualquier dato invalida el borrador revisado. No hay envío automático.

Sin JavaScript, el botón móvil inactivo se sustituye por un enlace «Menú» a la
navegación del footer. Con JavaScript se conserva el diálogo original y su gestión
de foco. La ampliación de texto por CSS al 200 % motivó `overflow-wrap` en el título
de Contacto; las siete comparaciones visuales normales de esa página no cambiaron.

La matriz actual cubre 28 combinaciones de ruta/ancho, Axe en las cuatro rutas a
390 y 1440 px, teclado, reduced-motion, ausencia de JS y estados de error/borrador.
Los resultados definitivos están en [el cierre de etapas 2–5](Migracion-Etapas-2-5.md).

## Contacto minimalista con puntuación · 26/10/2026

Dirección confirmada por el usuario: título grande, tres acciones claras, menos
CTA repetidos de WhatsApp y la opinión como opción secundaria que se abre al elegirla.
La navegación reutiliza el lenguaje visual y la pastilla de vidrio del navbar.

- **Mi viaje**: nombre y consulta visibles. Destino y teléfono se añaden desde
  un desplegable opcional. Se conserva la validación y la revisión del borrador.
- **La agencia**: dirección y horarios confirmados, enlace para llegar mediante
  una búsqueda de la dirección en Google Maps, correo y teléfono. Sin mapa embebido
  ni solicitudes externas automáticas.
- **Mi experiencia**: cinco estrellas seleccionables, sin puntuación inicial,
  comentario opcional y datos personales opcionales al desplegar. Se acepta una
  puntuación sin comentario o un comentario sin puntuación; ambos vacíos se rechazan.
  Cambiar o quitar la puntuación invalida el borrador preparado.

### Arquitectura y accesibilidad

`contact-explorer.tsx` reutiliza `useGlide` sin modificar el navbar. Los enlaces
`#consulta`, `#oficina` y `#experiencia` funcionan sin JavaScript. Al hidratar,
`useSyncExternalStore` sincroniza el hash con la opción activa; el estado explícito
controla el panel visible sin producir saltos de scroll. CSS `:target` cubre la
navegación sin JavaScript. Los formularios mantienen entonces sus enlaces alternativos.

`star-rating.tsx` utiliza radios HTML nativos para permitir Tab, flechas y Espacio.
Cada estrella tiene un nombre accesible con su valor y descripción, foco visible
y un objetivo táctil de al menos 40 × 44 px. El hover solo previsualiza; la puntuación
se cambia con un clic o con el teclado. Se puede quitar con un botón explícito.
Las transiciones respetan movimiento reducido.

`messages.ts` conserva límites, codificación segura y validación. La valoración
viaja como `Puntuación: N/5` en el borrador privado. No hay almacenamiento,
publicación de opiniones, promedio de estrellas ni simulación de envío exitoso.
`site.googleReviewsUrl` sigue sin configurar: una reseña pública requiere la URL
oficial confirmada y una decisión expresa sobre ese flujo.

Se reutilizaron React/Next.js, CSS Modules, HTML nativo, `useGlide` y `whatsappUrl`.
No se agregaron dependencias. Referencias de patrones:
[puntuación mediante un grupo de radios](https://www.w3.org/WAI/ARIA/apg/patterns/radio/examples/radio-rating/)
y [desplegables HTML nativos](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details).

Capturas de los tres estados en escritorio y móvil:
`output/playwright/contact-minimal-{consulta,oficina,experiencia}-{390,1440}.png`.
