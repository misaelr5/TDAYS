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
