# Viajes escolares: Inicio y Destinos

Implementación del 27/10/2026. Se reutilizó la
[auditoría multimedia terminada](School-Media-Audit.md), sin volver a inventariar
ni procesar los originales.

## Implementado

El módulo de Egresados ahora se presenta como **Viajes escolares**, con Primaria,
Secundaria y Maestros. Inicio ofrece una composición compacta de imagen, texto y
consulta; Destinos desarrolla la categoría elegida y conserva la guía existente.
El Maestrazo es la propuesta protagonista de Maestros, sin inventar precios,
calendario, servicios, actividades incluidas ni testimonios.

Se conservan Inter, las superficies blancas, el azul de acción, el naranja de
marca y los radios del sitio. La imagen y el texto forman una sola pieza; no se
crearon tres tarjetas independientes. El grid superpone los tres relatos y
reserva la altura del más largo para evitar que el contenido siguiente salte al
cambiar de categoría. Los paneles inactivos quedan ocultos visualmente, para
tecnologías de asistencia y para la navegación por teclado.

## Arquitectura y soluciones reutilizadas

- **ADAPT:** `graduates/data.ts` centraliza textos, asuntos de WhatsApp, CTA,
  preguntas iniciales y slot multimedia por categoría.
- **ADAPT:** un único `GraduatesExplorer` presenta las dos variantes. La resolución
  de archivos y permisos sigue en el servidor; el cliente recibe nodos visuales
  ya preparados y contenido público.
- **REUSE:** `resolveMedia`, `MediaContent` y `getImageProps` de Next.js generan
  `picture`, `srcset` y `sizes`, con carga diferida y dimensiones reservadas.
- **REUSE:** contactos reales de `whatsappUrl`, guía de consulta y componentes de
  marca. No se añadieron dependencias, servicios, almacenamiento ni nuevas rutas.

El selector empieza como navegación por enlaces reales. Tras hidratar se mejora
a pestañas con `tablist`, `tab`, `tabpanel`, `aria-selected`, `aria-controls` y
un único elemento en la secuencia de tabulación. Flechas, Home y End cambian el
panel y el foco; el mouse no cambia de categoría al pasar por encima.

El selector reutiliza `useGlide`, el mismo hook del navbar, con cápsula oscura de
vidrio y pastilla deslizante. Conserva contraste, foco visible y desactiva las
transiciones con movimiento reducido. No se agregó una dependencia de animación.

Los enlaces desde Inicio usan, por ejemplo,
`/destinos?escolar=maestros#escolares-maestros`. El hash permite alcanzar el panel
sin JavaScript; el parámetro permite conservar la categoría mientras se leen las
anclas de ayuda. El estado del navegador se observa con `useSyncExternalStore`;
Atrás/Adelante también actualizan la selección. No se leen `searchParams` en el
servidor, por lo que las rutas siguen siendo estáticas. Se conservan los enlaces
históricos `#egresados` y `#egresados-preguntas`.

Sin JavaScript, cada enlace selecciona su panel mediante el hash. Al abandonar
ese hash para leer la ayuda, su CTA pasa a una consulta general de viajes
escolares: no atribuye silenciosamente la consulta a otro nivel. Con JavaScript
la categoría se conserva también dentro de la guía.

Se respetan `prefers-reduced-motion`, foco visible, targets de al menos 44 px y
selector de tres columnas en móvil. No se añadió reproducción automática al módulo.

Referencias consultadas: [Image/getImageProps de Next.js](https://nextjs.org/docs/app/api-reference/components/image#art-direction)
y [controles nativos y semántica HTML en MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/radio).
Se contrastó el uso de imágenes con la guía de la versión instalada en
`node_modules/next/dist/docs/`. Se prefirió adaptar lo existente a instalar un kit
de pestañas o una galería.

## Recurso utilizado y permisos

**Maestros, tanto en Inicio como en Destinos:** `school:maestros`, ID
`maestrazo-group-poster`. Es el **fotograma ya público del video autorizado V140**,
no una nueva fotografía de la fiesta. Procede de:

`Videos/wetransfer_parte-3-maestrazo-videos-crudos_2026-09-14_1157/IMG_2723maestrazo parte 3 termas crudos.mp4`,
fragmento de 0–3,5 s. La autorización web para sus pasajeros adultos estaba
registrada en `hero`; se documentó esa misma evidencia para reutilizar su poster.

Se usa `/media/travel-days/trips/maestrazo-termas-desktop.webp` en ambos tamaños,
con `srcset` responsive de Next. Por solicitud posterior del usuario, El Maestrazo
usa `object-fit: cover` y foco al 50 % / 65 % para llenar el marco sin bandas
vacías; en móvil el marco es 16:9. Esto ajusta el recorte visual en escritorio,
sin modificar el archivo original. Las fotos escolares conservan `contain`.
Alt: «Grupo de pasajeros de El Maestrazo con una bandera
de Travel Days frente a montañas nevadas». Para este fotograma no se copiaron
nuevos medios a `public/` ni se añadió otra descarga de video.

**Primaria y Secundaria, actualización del 27/10:** el usuario confirmó «tenemos el
permiso» para publicar las fotos de los chicos, identificó nuevamente la carpeta
`egresados y fotos varisa/` y confirmó que el material es de ambos niveles.
Se sustituyeron las ilustraciones por las tres fotos reales de la selección:

| Original | Uso | Slot | Copia pública |
|---|---|---|---|
| P169 — `482197228_1221605856357025_5238093494456184970_n.jpg` | Inicio, Primaria; grupo frente a edificio de dos torres | `school:primaria` | `schools/school-group-building-{desktop,mobile}.webp` |
| P168 — `1.jpg` | Destinos, Primaria; grupo junto al puerto | `school:primaria-detail` | `schools/school-group-port-{desktop,mobile}.webp` |
| P170 — `591143606_18050933660664862_2957467923872386535_n.jpg` | Inicio y Destinos, Secundaria; grupo en mirador | `school:secundaria` | `schools/school-group-lookout-{desktop,mobile}.webp` |

Las rutas públicas son relativas a `public/media/travel-days/`. Es una distribución
editorial del material confirmado para ambos niveles; los alt y las leyendas no
atribuyen colegios, cursos o ciudades que no se hayan confirmado.

Se reutilizó la selección de la auditoría sin volver a procesar toda la carpeta.
Los seis WebP públicos suman **590.378 bytes**, con cada archivo por debajo del
presupuesto existente de 110.000 bytes. Las variantes desktop se prepararon desde
los tres originales a calidad 76 y hasta 1100 px de lado, conservando las variantes
móviles revisadas de 800 px. Se comprobaron hashes, dimensiones y ausencia de
EXIF/XMP/ICC. Los originales no se modificaron. Las tres imágenes conservan su
proporción completa y `object-fit: contain`; Next.js sirve las variantes responsive.
En móvil se utiliza un marco 4:3 para dar más presencia a los grupos cuadrados
sin cortar personas; los paneles conservan una altura estable.
El permiso y la procedencia quedaron registrados por recurso en el manifiesto y
en el inventario. Las fotos de docentes no se reutilizan para representar alumnos.

**Galería de El Maestrazo:** P021, P046 y P059 siguen pendientes de permiso. No se
publicó una galería con material no autorizado ni una repetición del único
fotograma disponible. Las decisiones vigentes de las seis fotos están
documentadas en [la selección](School-Media-Selection.csv).

## Archivos de esta implementación

- `src/features/graduates/data.ts`.
- `graduates-section.tsx`, `graduates-preview.tsx`, `graduates-explorer.tsx` y
  `graduates-help-center.tsx` en la misma carpeta.
- `graduates.module.css`, `graduates-preview.module.css` y el nuevo
  `graduates-explorer.module.css`.
- `src/config/media.ts`: slots por categoría y poster autorizado.
- `src/app/destinos/page.tsx`: descripción de metadata de esa página.
- `src/components/site-footer.tsx`: etiquetas de enlaces al módulo.
- `tests/school-travel.spec.ts`, `graduates-guide.spec.ts`, `home-lower.spec.ts`,
  `media.spec.tsx` y `premium.spec.ts`.

Se preservaron los cambios simultáneos de Inicio, China, cabecera y otros módulos.
El repositorio recibió un commit concurrente durante el trabajo; esta tarea no
ejecutó `git commit`, push ni despliegues. El alcance se compara con el estado
inicial `bc2536d`, no únicamente con el último `git diff`.

## Validación

Ajuste del selector al navbar y encuadre de Maestros: **21 pruebas aprobadas**, sin
fallos, omitidas ni flaky, con build de producción aislado. Suites: Viajes
escolares, guía e Inicio inferior; 320, 390, 768 y 1440 px, teclado, sin JavaScript
y movimiento reducido. Lint, TypeScript y `git diff --check` correctos. Se
inspeccionaron Inicio y Destinos en móvil y escritorio. Evidencia:
`output/playwright/school-navbar-final/`.

La incorporación posterior de P168–P170 se comprobó con **27 pruebas aprobadas**
de medios, Viajes escolares e Inicio inferior. Se verifican 38 referencias del
manifiesto y 34 WebP públicos de Travel Days, todos por debajo del presupuesto
existente de 110.000 bytes y sin EXIF/XMP/ICC. Comando de esta ampliación:

Capturas de esta ampliación y resumen de salida 0:
`output/playwright/school-photos-final/`. Se revisaron las fotografías de los chicos
en móvil y escritorio. Lint, tipos, build aislado y `git diff --check` correctos.

```powershell
npm test -- tests/school-travel.spec.ts tests/media.spec.tsx tests/home-lower.spec.ts
```

Las pruebas de imágenes comprueban que las
tres categorías muestran fotografías reales, su carga completa, el recurso de
cada página, la ausencia de ilustraciones y la conservación del encuadre.

Validación inicial del rediseño, antes de incorporar las tres fotos escolares:
**40 pruebas aprobadas, cero fallidas, omitidas o flaky**,
Chromium, salida 0. Comando reproducible:

```powershell
npm run lint
npm run typecheck
npm test -- tests/school-travel.spec.ts tests/graduates-guide.spec.ts tests/home-lower.spec.ts tests/media.spec.tsx tests/premium.spec.ts tests/content.spec.tsx
```

Lint y TypeScript correctos. El ejecutor de pruebas construyó producción en
`.next-qa`, verificó 32 referencias a variantes aprobadas del manifiesto y conservó
los hashes de las 29 capturas históricas. El build mantuvo las rutas estáticas.
`git diff --check` correcto. Se restauraron únicamente las rutas generadas por
`next typegen` en `next-env.d.ts` y se volvió a comprobar con `tsc --noEmit`.

Capturas finales y resumen JSON: `output/playwright/school-travel-final/`.
Se inspeccionaron visualmente Inicio y Destinos, incluida la imagen de Maestros
en móvil y escritorio. Se comprobaron los ocho destinos contra sus datos existentes;
sus componentes y datos no tienen diferencias respecto al estado inicial.

Las pruebas cubren tres categorías, WhatsApp, enlaces Inicio–Destinos,
historial, teclado, movimiento reducido, altura estable, permisos, contenido y
accesibilidad. Se comprueba el selector en 320, 390, 768 y 1440 px y el reflow al
200 % desde 640 px (ancho efectivo de 320 px).

El componente y los datos de los ocho destinos, la metadata global y robots no
forman parte de este cambio. La QA comprueba su contenido y preserva los hashes de
las 29 referencias históricas, sin reemplazarlas. Las capturas nuevas documentan
el diseño solicitado; no acreditan equivalencia píxel a píxel con la versión anterior.

No se ejecutó la suite global ni se midieron Core Web Vitals. La cobertura de
navegador es Chromium; no se afirma validación de Safari o dispositivos físicos.

## Pendientes y conceptos

Para incorporar la galería hacen falta los permisos de las fotos de la fiesta.
La autorización de las tres fotos escolares ya fue confirmada e implementada.
No se debe extender esa autorización a otros archivos ni atribuir un colegio,
curso o ciudad por edad aparente o nombre de carpeta.

Conceptos transferibles: **mejora progresiva** (enlaces primero, pestañas después),
**estado en URL** (selección enlazable sin hacer dinámica la página) y **composición
servidor/cliente** (resolver permisos en servidor y enviar solo lo necesario).
