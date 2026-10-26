# Revisión de videos Travel Days — 25/10/2026

Se inspeccionaron los **167 MP4**, sin modificar los originales: **1.437.258.923 bytes**, **30 min 55,19 s** de duración total. Hay **154 clips verticales de 1080 × 1920** y **13 horizontales de 1920 × 1080**; todos contienen una pista de audio. La inspección técnica no detectó fallos de extracción ni duplicados binarios SHA-256.

El [inventario individual](Media-Video-Inventory.csv) registra archivo, resolución, peso, duración, contenido visible, calidad y decisión. Los metadatos completos, 668 muestras visuales y 42 planchas privadas están en `output/media-audit/video-review.json` y `output/media-audit/videos/`.

## Método y límites

Se revisaron visualmente cuatro fotogramas distribuidos a lo largo de **cada** clip, aproximadamente al centro de sus cuatro cuartos. Es una selección editorial inicial: **no es reproducción continua ni escucha del audio**. No acredita ausencia de personas en el resto de una secuencia, edad, identidad, autoría, permiso de imagen, vigencia de servicios ni localización geográfica. Los clips muy breves aportan muestras temporalmente próximas.

Se observan transporte, recepción de pasajeros, visitas con degustación y producción, tiendas, hoteles, desayunos, grupos ante nieve, piscinas y comidas compartidas. Las marcas FLORIO y Chocolezza se leen en algunas visitas; Princess y Carollo en fachadas de hotel; CACHEUTA en V152. Eso permite documentar el rótulo visible, **sin atribuir una ciudad, un paquete o un servicio incluido**.

## Selección editorial

| Clip | Valor narrativo | Ubicación potencial | Condición |
|---|---|---|---|
| V068 — `IMG_2411maestrazo parte 1.mp4` | Grupo horizontal ante la fachada FLORIO, legible y con buena luz | Experiencias de grupos, dentro de un relato de viaje confirmado | Permisos de las personas y contexto pendientes |
| V054 — `IMG_2346maestrazo parte 1.mp4` | Presentación o degustación grupal horizontal | Experiencias, tras confirmar visita | Permisos y lugar pendientes |
| V084 — `IMG_2464maestrazo parte 1.mp4` | Visita horizontal a instalación productiva | Excursiones y experiencias | Permisos, actividad y establecimiento pendientes |
| V069 — `IMG_2426maestrazo parte 1.mp4` | Grupo con bandera de la agencia | Trayectoria y acompañamiento de grupos | Permisos y contexto pendientes |
| V065 — `IMG_2408maestrazo parte 1.mp4` | Presentación con banner de Travel Days | Acompañamiento humano | Identidad, función, contexto y autorización pendientes |
| V153 — `IMG_2784maestrazo parte 3 termas crudos.mp4` | Comida compartida horizontal, grupo y banner de la agencia | Relato de experiencia, si se confirma | Permisos colectivos y de terceros pendientes |
| V140 — `IMG_2723maestrazo parte 3 termas crudos.mp4` | Grupo y bandera ante montaña nevada | Fotograma de experiencia, tras confirmar contexto | Permisos pendientes; cambia de orientación durante el clip |

No hay prueba suficiente para clasificar estos grupos como viajes de egresados. No se recomiendan para las tarjetas de los ocho destinos publicados.

## Decisión de integración

**Ningún video fue incorporado a `public/` ni activado en la web.** No se encontró un clip adecuado para un hero premium que además tuviera encuadre y autorización suficientes. V136 muestra montaña nevada desde un vehículo, con reflejos, ventanilla, cables y guardarraíl; su composición no justifica reemplazar el hero.

Los interiores de ómnibus, habitaciones, baños, ascensores, cartas y vitrinas tienen valor documental, pero publicarlos podría sugerir transporte, alojamiento, precio o inclusión no confirmados. No se utilizan para llenar espacios.

Hay variantes visuales muy próximas, aunque sus hashes difieren: V001/V121, V101/V128 y V131/V167. Conservar originales y elegir una sola versión si se realiza un montaje. V028 (0,23 s) y V053 (0,32 s) son demasiado breves como piezas independientes.

V141–144 y V162–166 muestran piscinas y bañistas; se mantienen bloqueados para revisar terceros, posibles menores y permisos. El vapor degrada especialmente V144 y V165–166. No deben publicarse por inferencia de mayoría de edad ni mediante aprobación genérica del archivo.

## Derivados privados preparados

Se preparó V068 como **muestra pendiente**, conservando duración y proporción, eliminando audio y metadatos personales, con H.264/yuv420p y MP4 `faststart`:

| Derivado privado | Dimensiones | Bytes |
|---|---:|---:|
| `output/media-audit/pending/videos/v068-group-desktop.mp4` | 1280 × 720 | 2.099.571 |
| `output/media-audit/pending/videos/v068-group-mobile.mp4` | 640 × 360 | 694.553 |
| `output/media-audit/pending/videos/v068-group-desktop-poster.webp` | 1280 × 720 | 216.718 |
| `output/media-audit/pending/videos/v068-group-mobile-poster.webp` | 640 × 360 | 62.052 |

Original V068: 3.687.524 bytes. Reducción del video: 43,1 % desktop y 81,2 % móvil. La muestra **sigue sin autorización de publicación**. Su manifiesto privado está en `output/media-audit/pending/videos/manifest.json`.

Se verificó decodificación completa de ambos MP4 con FFmpeg sin errores, ausencia de pista de audio y de etiquetas `creation_time`/`location`, y posición de `moov` antes de `mdat`. Ambos posters se abrieron, se inspeccionaron visualmente y no contienen EXIF/XMP. Estos checks técnicos no reemplazan los permisos ni la revisión editorial continua.

Si se autoriza un video, la primera implementación recomendable es reproducción solicitada por el usuario con poster y `preload="none"`, dentro de una experiencia con contexto confirmado. Un fondo automático no aporta suficiente valor aquí para justificar descarga, movimiento o recorte agresivo en móvil.

## Reproducción del inventario

`python scripts/audit-travel-videos.py` utiliza las herramientas de auditoría aisladas en `output/media-audit/tooling/`. `--refresh` vuelve a extraer las muestras; `--refresh-first=N` renueva los primeros N clips. No se agregaron dependencias de video a la aplicación.

Se reutilizan FFmpeg y Pillow para inspección, Next.js para presentación y el manifiesto existente para autorización. Referencias técnicas: [MP4 faststart](https://ffmpeg.org/ffmpeg-formats.html), [opciones de FFmpeg](https://ffmpeg.org/ffmpeg-all.html). La aprobación de contenido permanece humana.
