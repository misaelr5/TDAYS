# Travel Days · recreación del video

Frontend local creado en `C:\Users\misael\Desktop\RECREAR`. El video original se conserva. El proyecto de `D:\TRABAJOS\TravelDays` se consultó como fuente de contenido, contactos, logos, fuente Inter y versiones; no se editó desde esta tarea.

## Abrir

Node.js 24 y npm. La vista local utiliza **http://127.0.0.1:3210** para no interferir con otros proyectos.

La migración usa RECREAR como base definitiva y se revisa por etapas. Ver
[respaldo, pruebas y referencia visual de la etapa 1](docs/Migracion-Etapa-1.md).
La continuación está documentada en [migración de etapas 2–5](docs/Migracion-Etapas-2-5.md)
y en la [bitácora](docs/Bitacora.md).
`npm test` construye QA en `.next-qa/` y usa el puerto 3211; ejecutar los checks
secuencialmente. No ejecutarlo al mismo tiempo que otro build o generación de tipos.

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

- Hero inspirado en `src/inspo`: paisaje, título centrado, navegación translúcida, barra de consulta y cuatro tarjetas superpuestas con información real. El fondo es una ilustración temporal hasta recibir la foto original. Ver [diseño y validación](docs/Hero-Paisaje.md).
- Carrusel claro de ocho destinos inspirado en Apple Cards Carousel: tarjetas verticales redondeadas, título breve, ilustración y enlace a cada destino del catálogo. Scroll táctil, flechas y teclado; sin reproducción automática ni modal.
- Módulo de Viajes escolares en Inicio y versión ampliada debajo de los ocho destinos: Primaria, Secundaria y Maestros, consultas específicas y guía para grupos y familias. Primaria y Secundaria utilizan las tres fotografías escolares autorizadas; El Maestrazo reutiliza el fotograma autorizado de un viaje. Las fotos adicionales de la fiesta siguen sujetas a permiso. Ver [implementación, medios y validación](docs/School-Travel-Redesign.md).
- Footer oscuro de cuatro columnas inspirado en la misma referencia, con contactos, dirección y horarios reales, enlaces útiles y consulta por WhatsApp.
- Línea visual compartida en las cuatro páginas: Inter, superficies glass, cápsulas, radios de 24 px y los colores del logo original azul `#006CF9`, naranja `#F58634` y blanco. Ver [implementación y diferencias con el componente pegado](docs/Linea-Visual.md).
- Nosotros conserva el relato institucional y Contacto sus formularios y privacidad con el diseño unificado. Se retiraron la tipografía manuscrita, pasaportes, sellos, recibo e impresora. El cierre ofrece una consulta por WhatsApp.
- Menú móvil fullscreen con Escape, ciclo de foco, restauración de foco y bloqueo de scroll.
- Rutas `/`, `/destinos`, `/nosotros`, `/contacto`, 404 y robots. El catálogo completo se renderiza en servidor.

## Arquitectura

```text
src/app/                      Rutas, layout, metadatos, fuentes y estilos
src/components/sections.tsx    Composición de secciones en servidor
src/components/site-footer.tsx  Footer de referencia con enlaces y contactos reales
src/components/travel-objects.tsx  Ilustración Landscape conservada
src/components/destination-cards.tsx  Catálogo y tarjetas en servidor
src/components/ui/apple-cards-carousel.tsx  Scroll, teclado y enlaces del carrusel
src/components/destination-cards.module.css  Encabezado y tarjetas del catálogo
src/components/header.tsx     Cabecera y diálogo móvil
src/components/motion.tsx     RevealText y configuración de Motion
src/config/                   Contactos, metadata, motion y manifiesto de medios
src/features/agency/          Historia, valores, formación y perfiles condicionados
src/features/media/           Resolución en servidor y presentación audiovisual
src/features/destinations/    Datos tipados de los ocho destinos
src/features/graduates/       Egresados compartido entre Inicio y Destinos
src/features/hero/            Hero de paisaje y consulta con borrador de WhatsApp
public/media/logos/           Logotipo original utilizado
docs/                        Análisis de referencia y validación
output/reference/             Fotogramas del video, sólo para revisión
output/playwright/            Capturas, script de auditoría y resultados
```

Se reutilizan Next.js 16.4.2, React 19.3.1, TypeScript estricto, Tailwind 4 y npm con lockfile. Motion 14.6.0 aporta el hover del carrusel y los revelados existentes. La adaptación de Apple Cards no incorpora dependencias nuevas: utiliza enlaces reales, scroll nativo y SVG propios. CSS Modules aísla cada módulo y los tokens de marca están en globals.css. `axe-core` es una herramienta de validación de desarrollo.

Inter se carga localmente mediante `next/font/local`. Caveat ya no se carga; el archivo y su licencia histórica se conservan. No hay llamadas a Google Fonts durante la navegación.

## Medios y contenido

**Las postales son ilustraciones temporales, no fotografías de destinos.** El manifiesto incorpora una foto real de oficina y cuatro retratos autorizados en Nosotros. La [auditoría audiovisual de 336 archivos](docs/Media-Audit.md) incluye inventario, selección, mapa por módulo y permisos pendientes. El [flujo de medios autorizados](docs/Medios.md) valida permisos documentados, procedencia, rutas, archivos, variantes y focos antes del build. `ApprovedMedia` resuelve en servidor y entrega sólo datos públicos; sin recurso aprobado conserva la ilustración. No se incorporaron fotos externas o generadas.

Los destinos no acreditan disponibilidad. No se agregaron precios, fechas, testimonios, certificaciones o servicios incluidos. Los contactos proceden de la configuración actual de Travel Days. Se conserva `noindex` y `Disallow: /`; dominio, canonical, sitemap y datos estructurados comerciales requieren información confirmada antes de publicación.

Nosotros incorpora la trayectoria declarada de Javier, historia, valores, áreas y formación. Los perfiles personales pendientes no se renderizan. El catálogo muestra las ocho descripciones existentes y admite campos comerciales opcionales sólo cuando existan datos confirmados.

## Pruebas reproducibles

```powershell
npm run lint
npm run typecheck
npm run verify:media
npm test
```

`npm test` verifica hashes, medios, build de producción aislado y Playwright/Axe.
`npm run test:visual` ejecuta las 29 comparaciones. Las referencias originales son
inmutables; no existe comando de actualización automática. En páginas ampliadas se
guardan capturas reales y diferencias antes de normalizar exclusivamente el DOM de
prueba para comparar la composición previa. Ver el informe para límites y evidencias.

## Validación y diferencias

Ver [navegación y formularios vigentes](docs/Contacto-Navegacion.md), [análisis de referencia](docs/Referencia.md) y [validación inicial](docs/Validacion.md). La adaptación conserva la secuencia y los recursos compositivos del video, pero **no es una copia píxel por píxel**: cambia café por turismo, marca, objetos y contenido; las fotos siguen pendientes. Mobile y menú fullscreen son adaptaciones propias porque no aparecen en el video.

No se implementaron backend, autenticación, Supabase, reservas, pagos o administración. No se hizo commit, push ni deploy.

## Conceptos para aprender

1. **Composición servidor/cliente:** el reel recibe los datos mínimos y los paisajes ya renderizados desde el servidor; la interacción no envía la resolución de archivos ni las autorizaciones de medios al navegador.
2. **Mejora progresiva:** títulos, tarjetas y enlaces existen antes de ejecutar JavaScript. Motion añade comportamiento y se desactiva según las preferencias de movimiento.
3. **Contenido y presentación:** los destinos y contactos se mantienen fuera de la lógica de animación; sustituir medios no requiere reescribir las secciones.

## Navegación y Contacto

La navegación pública queda limitada a Inicio (`/`), Destinos (`/destinos`), Nosotros (`/nosotros`) y Contacto (`/contacto`). La antigua `/quienes-somos` fue retirada y devuelve 404. Inicio y el catálogo conservan su composición y contenido.

Contacto tiene dos módulos: organizar un viaje y compartir una experiencia de un viaje realizado. La consulta pide nombre y mensaje; teléfono y destino son opcionales. La opinión requiere texto; nombre, viaje y puntuación son opcionales. Los botones preparan un borrador que puede revisarse antes de abrir WhatsApp. Editar los datos invalida el borrador anterior. No se almacenan datos en esta web, no se publican opiniones y no se confirma entrega. Sin JavaScript se ofrecen enlaces de contacto directo.

Los campos usan validación HTML y controles adicionales sobre texto vacío, límites, teléfono y puntuación. `src/features/contact/messages.ts` concentra las reglas y el texto del borrador, mientras `contact-form.tsx` mantiene la interacción. No se añadieron dependencias. La navegación compartida está en `src/config/navigation.ts`.
