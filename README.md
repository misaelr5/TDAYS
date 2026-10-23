# Travel Days · recreación del video

Frontend local creado en `C:\Users\misael\Desktop\RECREAR`. El video original se conserva. El proyecto de `D:\TRABAJOS\TravelDays` se consultó como fuente de contenido, contactos, logos, fuente Inter y versiones; no se editó desde esta tarea.

## Abrir

Node.js 24 y npm. La vista local utiliza **http://127.0.0.1:3210** para no interferir con otros proyectos.

```powershell
npm ci
npm run dev
```

Para producción local, detener primero el servidor de esta carpeta:

```powershell
npm run lint
npm run typecheck
npm run build
npm run start
```

No construir sobre `.next` mientras esté sirviendo una versión anterior con `next start`: sus rutas pueden conservar referencias a chunks que el build reemplaza. Reiniciar el servidor después de cada build.

## Implementado

- Portada oscura, titular grande con revelado por palabras, remate manuscrito y documentos de viaje superpuestos con parallax.
- Sección clara, texto de fondo, cuatro tarjetas por vista desktop y carrusel de ocho destinos confirmados; controles, scroll táctil y teclado.
- Reloj editorial con avión que cambia de posición y rotación con el scroll; dirección y horarios reales de la agencia.
- Bloque institucional oscuro con pasaporte y sellos flotantes, adaptando la composición de café y granos.
- Cierre con impresora, recibo dentado y postales. Los CTA abren consultas de WhatsApp y no confirman reservas.
- Menú móvil fullscreen con Escape, ciclo de foco, restauración de foco y bloqueo de scroll.
- Rutas `/`, `/destinos`, `/nosotros`, `/contacto`, 404 y robots. El catálogo completo se renderiza en servidor.

## Arquitectura

```text
src/app/                      Rutas, layout, metadatos, fuentes y estilos
src/components/sections.tsx    Cinco secciones y footer, renderizados en servidor
src/components/travel-objects.tsx  Pasaporte, postales y tarjeta de embarque
src/components/destination-cards.tsx  Catálogo y tarjetas en servidor
src/components/destination-carousel.tsx  Controles y scroll en cliente
src/components/header.tsx     Cabecera y diálogo móvil
src/components/motion.tsx     RevealText, Parallax y configuración de Motion
src/config/                   Contactos, parámetros de motion y fotos aprobadas
src/features/destinations/    Datos tipados de los ocho destinos
public/media/logos/           Logotipo original utilizado
docs/                        Análisis de referencia y validación
output/reference/             Fotogramas del video, sólo para revisión
output/playwright/            Capturas, script de auditoría y resultados
```

Se reutilizan Next.js 16.4.2, React 19.3.1, TypeScript estricto, Tailwind 4 y npm con lockfile. Motion 14.6.0 es la única dependencia de animación añadida: integra parallax y revelados sin otro motor de scroll. CSS resuelve sombras, papel, cuero, hover y transiciones del menú. Los iconos sencillos son SVG propios. `axe-core` es una herramienta de validación de desarrollo.

Las fuentes son locales mediante `next/font/local`: Inter del proyecto y Caveat (SIL Open Font License, licencia junto al archivo). No hay llamadas a Google Fonts durante la navegación.

## Medios y contenido

**Las postales son ilustraciones temporales, no fotografías de destinos.** No se incorporaron fotos externas o generadas. Para sustituirlas, agregar archivos autorizados a `public/` y registrarlos en `src/config/media.ts` con las claves `destination:brasil`, etc. `Postcard` acepta el medio y usa `next/image`; si no hay foto aprobada, mantiene la ilustración.

Los destinos no acreditan disponibilidad. No se agregaron precios, fechas, testimonios, certificaciones o servicios incluidos. Los contactos proceden de la configuración actual de Travel Days. Se conserva `noindex` y `Disallow: /`; dominio, canonical, sitemap y datos estructurados comerciales requieren información confirmada antes de publicación.

## Validación y diferencias

Ver [navegación y formularios vigentes](docs/Contacto-Navegacion.md), [análisis de referencia](docs/Referencia.md) y [validación inicial](docs/Validacion.md). La adaptación conserva la secuencia y los recursos compositivos del video, pero **no es una copia píxel por píxel**: cambia café por turismo, marca, objetos y contenido; las fotos siguen pendientes. Mobile y menú fullscreen son adaptaciones propias porque no aparecen en el video.

No se implementaron backend, autenticación, Supabase, reservas, pagos o administración. No se hizo commit, push ni deploy.

## Conceptos para aprender

1. **Composición servidor/cliente:** el carrusel recibe tarjetas ya renderizadas como `children`; la interacción no obliga a enviar todos los componentes decorativos como JavaScript.
2. **Mejora progresiva:** títulos, tarjetas y enlaces existen antes de ejecutar JavaScript. Motion añade comportamiento y se desactiva según las preferencias de movimiento.
3. **Contenido y presentación:** los destinos y contactos se mantienen fuera de la lógica de animación; sustituir medios no requiere reescribir las secciones.

## Navegación y Contacto

La navegación pública queda limitada a Inicio (`/`), Destinos (`/destinos`), Nosotros (`/nosotros`) y Contacto (`/contacto`). La antigua `/quienes-somos` fue retirada y devuelve 404. Inicio y el catálogo conservan su composición y contenido.

Contacto tiene dos módulos: organizar un viaje y compartir una experiencia de un viaje realizado. La consulta pide nombre y mensaje; teléfono y destino son opcionales. La opinión requiere texto; nombre, viaje y puntuación son opcionales. Los botones preparan un borrador que puede revisarse antes de abrir WhatsApp. Editar los datos invalida el borrador anterior. No se almacenan datos en esta web, no se publican opiniones y no se confirma entrega. Sin JavaScript se ofrecen enlaces de contacto directo.

Los campos usan validación HTML y controles adicionales sobre texto vacío, límites, teléfono y puntuación. `src/features/contact/messages.ts` concentra las reglas y el texto del borrador, mientras `contact-form.tsx` mantiene la interacción. No se añadieron dependencias. La navegación compartida está en `src/config/navigation.ts`.
