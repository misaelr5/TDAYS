# Travel Days: auditoría audiovisual e integración

Fecha: 25/10/2026. Fuente: `src/fotos videos y contenido traveldays/`, entregada por el propietario a través del usuario.

## Entrega

- [Inventario completo por archivo](Media-Inventory.csv): 336 registros con SHA-256, peso, dimensiones, contenido visual, uso propuesto y decisión.
- [Selección y revisión de fotografías](Media-Photo-Review.md).
- [Inventario de los 167 videos](Media-Video-Inventory.csv) y [selección editorial](Media-Video-Review.md).
- Recursos publicados: `public/media/travel-days/office/` y `public/media/travel-days/team/`.
- Copias pendientes: `output/media-audit/review-optimized/` y `output/media-audit/pending/videos/`. **No están en `public/`.**
- Planchas y evidencia: `output/media-audit/photos-01.jpg` a `photos-07.jpg`, retratos ampliados en `photos/`, y 42 planchas en `videos/`.

## Qué se encontró

336 archivos, 1.718.139.557 bytes: 167 imágenes, 167 MP4 y 2 PDF. Las imágenes son 130 fotos de evento, 7 fotos de personas del equipo o vinculadas, 3 de oficina, 12 flyers de destinos, 1 pieza institucional y 14 variantes de identidad/contacto.

Los nombres de destinos corresponden a **flyers con texto comercial**, no a originales fotográficos de esos lugares. No se extrajeron sus fondos ni se incorporaron fechas, precios, itinerarios, inclusiones o disponibilidad a los datos del sitio. Tampoco se atribuyó la fiesta del Día del Maestro a un viaje de egresados.

No hay duplicados binarios entre los 336 originales. Se detectaron 16 pares candidatos por hash perceptual, además de ráfagas y recortes similares revisados editorialmente. No se borró ninguno. Dos recursos de identidad coinciden por SHA-256 con archivos ya existentes en `public/media/logos/`; se reutilizó la identidad vigente.

## Método y límites

Se enumeraron recursivamente todos los archivos y se registraron sus hashes antes de trabajar. Las 167 imágenes se revisaron visualmente en siete planchas; las selecciones institucionales y la foto con acompañante menor también se abrieron ampliadas. Se revisaron encuadre, iluminación, resolución y posibilidades de recorte. La gran resolución de una foto nocturna no elimina el flash duro, el ruido ni un fondo desordenado.

Los 167 videos se inspeccionaron técnicamente y mediante cuatro fotogramas distribuidos por clip: 668 muestras sobre 30 min 55,19 s de material. **No fue una reproducción continua ni se escuchó el audio.** No se certifica ausencia de terceros o menores a partir de ese muestreo. Todos los videos permanecen pendientes.

Los dos PDF se renderizaron e inspeccionaron visualmente como documentación aportada. No se realizó comprobación independiente con sus emisores ni se agregaron afirmaciones legales o certificaciones nuevas a la web.

## Mapa por página y módulo

| Página / módulo | Recurso o decisión | Motivo / condición |
|---|---|---|
| Inicio, hero | Conservar ilustración actual | No hay fotografía paisajística independiente y adecuada ni video autorizado que mejore el hero. |
| Inicio, ocho tarjetas de destinos | Conservar ilustraciones | Los flyers no acreditan autoría de sus fotos de fondo ni sirven como originales de destino. |
| Destinos nacionales | Solicitar originales sin texto de Jujuy, Iguazú, Los Túneles, Jesús María y Valeria del Mar | Confirmar lugar y permiso por foto. No utilizar fotos del evento como sustituto. |
| Destinos internacionales | Solicitar originales de Brasil, Caribe y Bayahibe | No inferir lugar a partir de un grupo, una piscina o una fachada. |
| Egresados, Inicio y Destinos | Sin integración ni edición de sus módulos | Trabajo simultáneo advertido; no hay material visual con contexto estudiantil y permisos acreditados. |
| Turismo receptivo | Mantener tarjeta de Los Túneles | La pieza Taninga es un flyer; no prueba una foto propia ni un servicio vigente. |
| Nosotros, presentación | **P140, interior de oficina** | Logo y escritorios reales, sin personas; imagen con valor para la visita y la confianza. |
| Nosotros, historia | Mantener relato existente | No hay fotos históricas fechadas o contexto suficiente para ubicarlas en la línea de tiempo. |
| Nosotros, propietario | **P142, Javier Garay** | Retrato individual, indumentaria de la agencia y permiso web confirmado. |
| Nosotros, administración | **P006, Daiana D'Ascón** | Retrato individual autorizado, recorte de rostro para acompañar su perfil. |
| Nosotros, asistencia | **P001, Azul Barrera** | Retrato individual autorizado; usar pequeño, su fuente es de 708 × 740. |
| Nosotros, coordinación | **P147, Karoll Tello** | Retrato individual autorizado; no ampliar más allá de su calidad. |
| Nosotros, resto del equipo | Iniciales conservadas | Jorge incluye una menor; Ezequiel requiere confirmar mayoría de edad; faltan retratos de Susana y Jorge Picatto. DJ Mosca no está en los ocho perfiles aprobados. |
| Contacto | Mantener información y formularios | Repetir el interior no ayuda a completar la consulta. P138 exterior podría ayudar a encontrar el local, pero contiene ofertas y fechas impresas que necesitan revisión. |
| Experiencias / galería futura | P021, P046, P059; V068 y selección del informe de videos | Solo dentro de un relato confirmado, con autorización de cada persona y revisión del clip completo. No se creó una galería pública para llenar espacio. |

## Autorización y pendientes

El usuario confirmó expresamente durante esta tarea: **los retratos individuales del equipo tienen permiso de uso web**. Esa aprobación se registra en el manifiesto. La identidad del retrato se toma del nombre y rol suministrados por la agencia; no se hizo reconocimiento facial.

La aprobación de retratos individuales no incluye acompañantes, grupos ni pasajeros. P036/P037 muestran un menor en el evento; P146 muestra a Jorge junto a una niña y otras personas jóvenes al fondo. Se excluyeron. P141 presenta apariencia juvenil y queda pendiente de confirmar mayoría de edad y adecuación de esa imagen antes de publicarla. La apariencia visual no acredita edad.

Los 130 archivos del evento y todos los videos requieren autorización de pasajeros/terceros. Las piscinas requieren revisión reforzada por bañistas y posibles menores. Los 12 flyers, la pieza institucional y los dos certificados quedan como fuente de revisión, sin publicar sus originales. Las franjas de contacto incluyen un número distinto del contacto vigente: no se reutilizaron.

## Arquitectura y optimización

**REUSE:** manifiesto tipado, resolver en servidor, validación de permisos/rutas/archivos y `getImageProps` de Next.js. **ADAPT:** dos componentes institucionales y CSS Module para resolver oficina y retratos. **BUILD:** scripts locales de inventario y preparación, específicos de este lote. No se incorporaron librerías de galería, CDN, base de datos o dependencias de la aplicación.

Solo cinco fuentes revisadas generan copias públicas: oficina y cuatro retratos. Hay tres tamaños por fuente. La oficina tiene recorte 4:5 desktop y 4:3 móvil según la proporción real del módulo; Javier conserva rostro e indumentaria en 4:5. Los tres perfiles pequeños tienen recortes cuadrados de rostro y hombros, preparados para los avatares circulares de 56 px. No se amplían los originales para generar derivados. Los originales HEIC se decodifican localmente y nunca se importan al frontend.

Las copias WebP omiten EXIF, XMP y perfiles innecesarios. `MediaContent` produce `picture/srcset/sizes`, foco por variante y espacio reservado por CSS. La oficina sobre el primer pliegue tiene `loading="eager"` y prioridad alta; los retratos secundarios son lazy. Las autorizaciones y rutas de origen se resuelven en servidor y no pasan a las props públicas. Si falta un archivo o una aprobación, se conserva el fallback.

El video V068 tiene versiones privadas H.264 desktop/móvil, audio retirado, posters WebP y MP4 `faststart`. Ambos derivados se decodificaron completos sin errores. No se solicita ningún MP4 durante la navegación pública. Para un futuro uso aprobado se recomienda reproducción solicitada por el usuario y `preload="none"`, con su contexto real.

Herramientas reutilizadas: Pillow/HEIF, FFmpeg y renderer PDF aislados en `output/media-audit/tooling/`. No se modificó `package.json` ni el lockfile. Scripts: `audit-travel-media.py`, `audit-travel-videos.py` y `prepare-travel-media.py`. Preparación local de herramientas:

```powershell
python -m pip install --target output/media-audit/tooling Pillow pillow-heif imageio-ffmpeg pypdfium2
python scripts/audit-travel-media.py
python scripts/audit-travel-videos.py
python scripts/prepare-travel-media.py
```

Las reseñas editoriales de los CSV son humanas y no se regeneran automáticamente desde los nombres. El preparador comprueba los SHA-256 del lote elegido antes de escribir: si un nuevo archivo cambia los IDs del inventario o se reemplaza un original, se detiene para evitar publicar otra imagen bajo una aprobación anterior. Tras sumar material, revisar visualmente y actualizar el inventario antes de aprobarlo. La carpeta original tiene una exclusión exacta en `.gitignore` para evitar una incorporación accidental a Git; no se movió ni eliminó material.

Referencias técnicas consultadas: [Next.js Image y art direction](https://nextjs.org/docs/app/api-reference/components/image), [salidas y metadatos de Sharp](https://sharp.pixelplumbing.com/api-output/), [MP4 faststart](https://ffmpeg.org/ffmpeg-formats.html). Se prefirió la infraestructura instalada a agregar un sistema nuevo.

## Validación y límites de entrega

Resultados y capturas finales: [validación audiovisual](Media-Validation.md). La comprobación posterior de SHA-256 de los 336 originales no encontró cambios.

Se trabajó sobre un árbol con numerosos cambios previos. No se hicieron commits, push ni deploy. No se editaron Inicio, Destinos ni `src/features/graduates/`. La QA se ejecutó en una copia con fuentes separadas, dependencias compartidas y un puerto propio, sin reemplazar los artefactos de otro agente.

## Próximo paso de mayor valor

Pedir a la agencia pocas fotografías horizontales originales, sin textos, con lugar y autorización identificados: una para el hero y una por destino. Para Egresados, confirmar contexto y permisos de menores antes de preparar cualquier publicación. Resolver los permisos de un solo relato de grupo permite evaluar V068 con un propósito claro.

Conceptos transferibles: separar **procedencia, autorización y presentación**; usar **art direction responsive** según el encuadre real; distinguir **evidencia técnica, revisión editorial y permiso de publicación**. Un archivo que decodifica bien puede seguir siendo inadecuado para un módulo o no tener permiso.
