# Viajes escolares y El Maestrazo: revisión multimedia

Revisión del 27/10/2026, previa a modificar Inicio y Destinos. Fuente prioritaria:
`src/fotos videos y contenido traveldays/`. Este informe complementa la
[auditoría del 25/10](Media-Audit.md); el manifiesto actual de
`src/config/media.ts` es la fuente de decisiones de publicación.

## Objetivo y estado actual

Seleccionar experiencias reales para Primaria, Secundaria y Maestros, con una
presentación editorial de El Maestrazo. Inicio y Destinos comparten
`GraduatesSection`; actualmente su contenido solo distingue primaria y secundaria.
No se modificaron esos módulos en esta revisión.

Se recorrieron todas las carpetas y subcarpetas: **339 archivos, 1.719.002.268
bytes**: 170 imágenes, 167 MP4 y 2 PDF. Los **336 originales** de la auditoría
anterior conservan exactamente sus rutas, tamaños y SHA-256. Hay tres fotografías
nuevas en `egresados y fotos varisa/`. Se añadieron como P168–P170 al
[inventario](Media-Inventory.csv), conservando los IDs anteriores.

| Carpeta | Archivos directos |
|---|---:|
| `egresados y fotos varisa/` | 3 |
| `Fotos/` | 25 |
| `Fotos/FIESTA DIA DEL MAESTRO/` | 130 |
| `Fotos/logos varios/` | 14 |
| `Videos/videos crudos/` | 129 |
| `Videos/wetransfer_parte-3-maestrazo-videos-crudos_2026-09-14_1157/` | 38 |

Se revisaron nuevamente las siete planchas de las 167 imágenes anteriores, las
tres fotos nuevas a tamaño completo y las tres candidatas principales de El
Maestrazo ampliadas. Se revisaron las **42 planchas de los 167 videos**, con cuatro
muestras por clip (668 fotogramas). Sus hashes coinciden con los originales del
inventario previo: se reutilizó su análisis técnico, sin regenerar IDs ni muestras.
**No se reprodujeron continuamente los 30 min 55,19 s ni se escuchó el audio.**
Los PDF siguen siendo documentación, sin uso propuesto en estos módulos.

Evidencia privada local: `output/media-audit/schools-2026-10-27/` contiene
`inventory.json`, `summary.json`, `selection.json`, `selection-review.jpg` y
`existing-approved-video-check.json`. La plancha reúne las seis fotos propuestas;
no es una galería pública. No identifica personas ni incorpora datos de alumnos.

## Selección fotográfica concreta

Todas las rutas de esta tabla son relativas a la carpeta fuente. **Las seis
fotografías tienen permiso pendiente y no se utilizaron en la web.** El detalle de
hash, tamaño, derivados y uso propuesto está en
[School-Media-Selection.csv](School-Media-Selection.csv).

| ID / original | Calidad y composición | Uso propuesto, sujeto a permiso y contexto |
|---|---|---|
| P169 — `egresados y fotos varisa/482197228_1221605856357025_5238093494456184970_n.jpg` | 1600 × 1201. Horizontal, grupo completo ante un edificio, luz natural y espacio suficiente alrededor. La mejor apertura escolar de las tres; no ampliar por encima de la fuente. | Foto principal de viajes escolares en Inicio y apertura del relato en Destinos. Confirmar primaria/secundaria, lugar, vínculo con Travel Days y autorización de menores y acompañantes. |
| P168 — `egresados y fotos varisa/1.jpg` | 1440 × 1440. Grupo en un puerto, escena diurna y contexto de excursión. Calidad moderada; sin recorte panorámico que elimine integrantes. | Imagen secundaria de la galería escolar en Destinos, preservando formato cuadrado. No atribuir ciudad ni nivel escolar por apariencia. |
| P170 — `egresados y fotos varisa/591143606_18050933660664862_2957467923872386535_n.jpg` | 1440 × 1440. Grupo en un mirador, expresividad y paisaje. Personas próximas a los bordes y nitidez limitada; mantener el grupo completo. | Segundo momento de excursión en Destinos. Confirmar contexto; no presentarlo como secundaria para completar las tres categorías. |
| P021 — `Fotos/FIESTA DIA DEL MAESTRO/fotos reflex fiesta listas-22.jpg` | 6000 × 4000. Grupo posando, rostros legibles y composición horizontal; flash y fondo oscuro. | Apertura fotográfica de Maestros/El Maestrazo en Inicio, tras permiso de las personas visibles. |
| P046 — `Fotos/FIESTA DIA DEL MAESTRO/fotos reflex fiesta listas-45.jpg` | 6000 × 4000. Plano general del local y pantalla de El Maestrazo; aporta escala, pero tiene baja luz, multitud y columna central. | Imagen de ambiente en la galería de El Maestrazo en Destinos, no hero a pantalla completa. |
| P059 — `Fotos/FIESTA DIA DEL MAESTRO/fotos reflex fiesta listas-6.jpg` | 6000 × 4000. Grupo ante el escenario, mejor lectura de la identidad del evento; flash marcado. | Imagen principal de la galería de El Maestrazo en Destinos, complementaria a la vista general. |

Hay material suficiente para una galería editorial de El Maestrazo desde el punto
de vista visual, **pero todavía no hay autorización registrada para estas tres
fotografías**. La fiesta no se presentará como viaje de primaria/secundaria. Las
fotos P036/P037 con un niño visible y los recortes repetidos de teléfono no forman
parte de la selección. No se encontró una imagen cuya clasificación como viaje
de secundaria esté confirmada documentalmente.

## Video autorizado y evaluación de rendimiento

Durante la revisión hubo cambios concurrentes en el repositorio. Se comprobó que
el manifiesto actual registra `hero`, ID `maestrazo-termas`, con autorización
explícita del usuario del 27/10 para pasajeros adultos. Corresponde a **V140**:
`Videos/wetransfer_parte-3-maestrazo-videos-crudos_2026-09-14_1157/IMG_2723maestrazo parte 3 termas crudos.mp4`.
La procedencia registrada delimita el derivado a **0–3,5 segundos**. Esta revisión
no amplía ese alcance ni autoriza otros clips o fotografías del mismo viaje.

| Derivado existente | Dimensiones | Bytes | Comprobación actual |
|---|---:|---:|---|
| MP4 desktop | 1440 × 810 | 1.337.806 | 3,5 s, H.264, sin pista de audio; decodificación completa correcta |
| MP4 móvil | 960 × 540 | 573.704 | 3,5 s, H.264, sin pista de audio; decodificación completa correcta |
| Poster desktop | 1440 × 810 | 267.220 | Archivo existente legible |
| Poster móvil | 960 × 540 | 132.778 | Archivo existente legible |

El grupo, la bandera y la nieve aportan autenticidad. El original cambia de
orientación fuera del comienzo; no ampliar el segmento sin otra revisión. Para
Maestros puede aportar más el poster existente que repetir la descarga del video
en otra sección. Si se añade reproducción editorial, recomendar acción del usuario,
`preload="none"`, controles y poster responsive. No activar otro fondo automático
ni audio. No se midieron LCP, transferencia real de navegador ni dispositivos
físicos en esta revisión; no se afirma mejora de rendimiento.

V068 (grupo ante FLORIO), V054 (visita grupal), V084 (actividad), V069 (bandera) y
V153 (comida compartida) siguen siendo reservas narrativas; no tienen permiso
registrado para esta integración. Los clips de piscinas V141–V144 y V162–V166 no
se seleccionan por bañistas, terceros, vapor y contexto pendiente.

## Optimización y arquitectura recomendada

**REUSE:** manifiesto tipado, `resolveMedia`, `MediaContent` y `getImageProps` de la
versión instalada de Next.js. Se leyó la guía local
`node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md`.
No hace falta una librería de galería, servicio externo ni generación de imágenes.

Se prepararon **12 derivados privados WebP** (desktop hasta 1440 px, móvil hasta
800 px; 1.421.610 bytes en total) con proporción original, sin ampliar y sin
EXIF/XMP/perfil ICC. Permanecen en
`output/media-audit/schools-2026-10-27/pending/`, excluido por Git. Los originales
no se editaron, movieron ni eliminaron. Preparar estas copias no concede permiso.

**ADAPT, después de resolver permisos:** extender los datos compartidos de
Egresados para Primaria, Secundaria y Maestros, con consultas diferenciadas. En
Destinos, presentar tres imágenes complementarias de El Maestrazo con `figure` y
`figcaption`, sin carrusel automático ni dependencia nueva. Mantener Inter, azul,
naranja, proporciones y espacios del sitio. Evitar un recorte `cover` agresivo
en las fotos escolares: un rostro fuera de cuadro no se arregla eligiendo solo
un punto focal. Preferir proporción natural o encuadres revisados por variante.

Tras aprobación, copiar únicamente los derivados necesarios a
`public/media/travel-days/`, registrar evidencia por recurso y servirlos con
`srcset/sizes` de Next.js, carga diferida y espacio reservado. No registrar los
archivos pendientes como aprobados para que aparezcan en el frontend.

Archivos previstos para una integración posterior: `src/config/media.ts`, datos,
componentes y CSS de `src/features/graduates/`, metadata de `/destinos` y sus
pruebas de interacción/accesibilidad. No se implementó esa integración ahora.

## Validación y pendientes

- Enumeración recursiva completa: 339 archivos; 336 anteriores intactos y 3 nuevos.
- Las 170 imágenes se pudieron abrir y sus dimensiones se inspeccionaron.
- Revisión visual de todas las planchas fotográficas y de video, con los límites
  de muestreo indicados; ampliación de las seis fotos seleccionadas.
- Los 12 WebP privados abren correctamente y no conservan EXIF, XMP ni perfil ICC.
- Ambos MP4 existentes se decodificaron completos sin errores y no tienen audio.
- `npm run verify:media`: correcto, 30 archivos aprobados verificados en el estado
  concurrente del manifiesto. Esto comprueba consistencia, no acredita derechos.
- `git diff --check`: correcto. No se ejecutaron build, lint ni pruebas de interfaz
  por una entrega limitada a inventario/documentación y derivados privados.
- No se añadieron medios públicos, dependencias, imágenes externas o generadas.
  No se hizo commit, push ni deploy. Se preservaron los cambios concurrentes.

El siguiente paso es confirmar permisos para **P021, P046, P059 y P168–P170** y
el nivel/contexto de estas últimas. Conceptos transferibles: un hash vincula una
selección al archivo exacto; procedencia y permiso son datos separados; mantener
la proporción de una foto de grupo protege la composición y las personas.
