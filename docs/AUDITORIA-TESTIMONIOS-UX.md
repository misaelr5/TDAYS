# Testimonios con audio y auditoría UX/UI de Travel Days

Fecha: 2 de noviembre de 2026. Esta tarea no ejecutó commit, push o deploy. Objetivo de entrega indicado por el usuario: 3 de noviembre de 2026.

## Alcance y estado inicial

Se implementó un módulo de testimonios en Inicio y se auditó `/`, `/destinos`, `/nosotros`, `/contacto` y `/terminos`. Las recomendaciones globales de este informe no se implementaron automáticamente.

El checkout empezó limpio en `main`, commit `3106582`. Se inspeccionaron AGENTS.md, README, scripts, configuración Next/Playwright, permisos de medios y documentación previa. Stack comprobado: Next 16.4.2 App Router, React 19.3.1, TypeScript, CSS Modules, Motion/GSAP existentes y npm. No hay base de datos, cuentas, pagos ni API de reservas en este flujo: las consultas preparan mensajes para WhatsApp.

Durante la tarea aparecieron modificaciones concurrentes en hero, navegación, destinos, contacto, Nosotros y sus pruebas. Se conservaron. Otras entregas crearon los commits `3c48e8b` y `6051267`; esta tarea no los creó. También apareció staging de los archivos de testimonios realizado por otro proceso: no se alteró ese índice compartido. Las capturas y las mediciones finales representan el checkout conjunto; no permiten atribuir toda diferencia con el estado inicial a los testimonios. No se reescribieron las 29 referencias visuales históricas ni las 36 referencias actuales.

## 1. Inventario audiovisual

Se encontraron exactamente dos archivos MP4 en `src/fotos videos y contenido traveldays/testimonios`, sin transcripciones ni documentos de permisos adjuntos en esa carpeta. Originales conservados y excluidos de Git por la regla existente.

| Archivo original | Duración | Resolución/orientación | Peso original | Video | Audio |
|---|---:|---|---:|---|---|
| Testimonios clientes primaria.mp4 | 74,68 s (1:15) | 480 × 848, vertical | 12.018.991 bytes | H.264 Baseline, ~29,96 fps | AAC LC estéreo, 44,1 kHz, ~62 kbit/s |
| Testimonios Pax 2024.mp4 | 123,72 s (2:04) | 478 × 850, vertical | 23.338.109 bytes | H.264 High, 30 fps | AAC LC estéreo, 44,1 kHz, ~249 kbit/s |

Identidad de originales revisados:

```text
primaria: 8ccf00013a7307aa07d8be4eb1c0cab2de1182dce869223831bdd47ea2092e04
pasajeros: 08414faa1ccbd3997b64dcdbaad6340fedccfc572489e20b4e3a8e13974d6847
```

### Imagen, sonido y límites de la evaluación

- **Primaria:** revisión visual de siete fotogramas repartidos entre 1,87 y 70,95 s. Entrevista nocturna de tres personas con micrófono, composición estable, iluminación cálida y menor detalle en fondos oscuros. Los rostros y el contexto son reconocibles en el tamaño propuesto. No se amplió ni recortó el original.
- **Pasajeros:** siete fotogramas entre 3,09 y 117,53 s. Varias personas jóvenes hablando frente a cámara en un entorno de sierras, luz natural y encuadres consecutivos. No se deducen edades, nombres, colegio ni destino desde la apariencia o desde el ASR.
- **Decodificación:** FFmpeg procesó completamente los dos originales y los dos derivados sin errores. Eso acredita integridad técnica, no calidad artística ni comprensión humana.
- **Señal:** volumen medio detectado de −19,2 y −20,3 dBFS, con picos de −0,7 y aproximadamente 0 dBFS, respectivamente. Estas medidas no certifican inteligibilidad ni ausencia de distorsión.
- **Silencios:** con umbral −35 dB y mínimo 1,2 s, Primaria no registra intervalos. Pasajeros registra 121,711–123,719 s, aproximadamente 2 s al final. La música/ambiente puede impedir detectar pausas de voz: no se confundió silencio acústico con ausencia de discurso.
- **Audio en navegador:** Chromium y Firefox permiten medir señal PCM mediante Web Audio durante reproducción; se informa por separado de escucha humana y revisión editorial. El motor WebKit de Windows de esta máquina no expone Web Audio: allí la señal PCM no se midió. No se hizo una escucha humana certificada ni una prueba del altavoz de un teléfono físico.

### Transcripción y selección comercial

Se adaptó **whisper.cpp** como herramienta portable de auditoría, fuera de la aplicación, con el modelo multilingüe `small-q5_1`, idioma español y CPU. No se subieron voces ni videos a un servicio externo. El binario y el modelo descargados se comprobaron por SHA-256. La aplicación no incorpora estas herramientas como dependencias.

Se obtuvieron borradores TXT/SRT/JSON en `output/testimonials/transcription-drafts/`, todos identificados `AUTOMATICO-NO-VERIFICADO`. El ASR confunde repetidamente el nombre de la marca y algunos lugares; también puede cambiar el sentido de respuestas cortas. Esos textos **no se publicaron**, no se presentaron como citas y no se usaron como subtítulos definitivos.

La prioridad comercial es una hipótesis editorial basada en pertinencia para egresados, pregunta/respuesta, contexto y duración; no se midieron conversiones o preferencias de usuarios.

| Archivo / intervalo candidato | Motivo para revisión | Prioridad editorial | Decisión |
|---|---|---|---|
| Primaria, 7,08–18,76 s | Pregunta y valoración inicial de la experiencia según el ASR | Alta: breve y pertinente para familias | No cortado; revisar escuchando antes de usar como pieza independiente |
| Primaria, 26,12–39,04 s | Pregunta y respuesta sobre acompañamiento según el ASR | Alta: tema relacionado con confianza | No cortado; mantener contexto y verificar cada palabra |
| Primaria, 39,04–58,88 s | Cierre de valoración con ambas participantes según el ASR | Media: la separación de intervenciones requiere revisión | No cortado |
| Pasajeros, 54,00–77,00 s | Una intervención con preguntas y respuestas según el ASR | Alta: experiencia del estudiante | No cortado; no publicar nombres/destinos deducidos |
| Pasajeros, 78,00–100,00 s | Otra intervención sobre actividades y coordinación según el ASR | Alta: variedad de voces | No cortado |
| Pasajeros, 121,711–123,719 s | Señal por debajo del umbral de silencio | Baja para recorte: final del archivo | Conservado; silencio no implica que el cierre visual sea prescindible |

**Seleccionados:** ambos videos completos. Primaria aparece primero por su relación con las familias y su menor duración. Pasajeros aparece como “Voces del viaje”; no se convirtió `2024` del nombre del archivo en una fecha de filmación verificada. **Descartados:** ningún archivo; sí se descartó publicar transcripciones, citas o cortes automáticos no revisados. No se fabricaron identidades, valoraciones, destinos ni declaraciones.

## 2. Permisos de imagen y voz

El usuario aprobó explícitamente el prompt y sus condiciones el 02/11/2026: “usalo, te doy permos” y “hacelo”. Esa declaración se registra como autorización del usuario para el uso web de imagen y voz de los **dos archivos concretos** de la carpeta de testimonios. No autoriza otras carpetas, modificaciones globales ni publicación remota.

| Recurso | Estado en el manifiesto | Evidencia disponible | Límite |
|---|---|---|---|
| Testimonios clientes primaria.mp4 y derivados | Aprobado por declaración del usuario | Confirmación en esta conversación, vinculada al SHA-256 del original | Sin documentos independientes adjuntos ni verificación de edades |
| Testimonios Pax 2024.mp4 y derivados | Aprobado por declaración del usuario | Misma confirmación y SHA-256 específico | Aparecen personas jóvenes; no se presume mayoría de edad ni se afirma disponer de autorizaciones documentales de tutores |

Se conservan procedencia, evidencia y alcance en `src/config/media.ts`. `resolveMedia()` transmite al componente únicamente rutas, posters y condición decorativa; omite notas y autorizaciones privadas. Un estado pendiente/rechazado o un archivo ausente no llega al reproductor. Si no queda ningún testimonio aprobado, el módulo no se renderiza.

El alcance documental independiente sigue siendo una tarea de la agencia; el estado “approved” refleja la confirmación del usuario, no una certificación jurídica de Codex.

## 3. Optimización y conservación

| Derivado público | Peso | Ahorro frente al original | Audio | Poster |
|---|---:|---:|---|---|
| `testimonials/primaria.mp4` | 7.859.047 bytes | ~34,6 % | Copia de la pista AAC original, sin recodificar | `primaria.webp`, 38.788 bytes, fotograma 23,90 s |
| `testimonials/pasajeros-2024.mp4` | 15.471.941 bytes | ~33,7 % | AAC a 96 kbit/s, estéreo | `pasajeros-2024.webp`, 40.848 bytes, fotograma 39,59 s |

Rutas bajo `public/media/travel-days/`. Se conservó la resolución, el encuadre completo, el orden de intervenciones y la duración; no se generaron GIF, loops ni versiones mudas. La baja resolución original no se puede recuperar mediante compresión y no se disimuló con ampliación artificial.

FFmpeg existente: H.264/libx264, CRF 24, preset medium, yuv420p, maxrate 900 kbit/s, bufsize 1800 kbit/s, `+faststart`, sin metadatos de origen ni capítulos. Se comprobó que el átomo `moov` precede a `mdat` en ambos MP4. La reducción total de videos es de aproximadamente 34 %, de 35,36 a 23,33 MB decimales.

Reproducción del proceso, con los mismos originales autorizados:

```powershell
python -B scripts/prepare-testimonials.py --ffmpeg 'output/media-audit/tooling/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe'
```

El script utiliza biblioteca estándar, exige los hashes revisados y se niega a sobrescribir derivados existentes. Los inventarios, logs, audio temporal, contact sheets, modelos y borradores permanecen en `output/testimonials/`, ignorado por Git. Los originales también continúan ignorados.

## 4. Ubicación y diseño

Se compararon estas ubicaciones en la home real:

| Alternativa | Ventajas | Coste / decisión |
|---|---|---|
| Dentro o inmediatamente después del hero | Confianza temprana | Competiría con la consulta principal y el video existente. No seleccionada |
| Después de destinos y antes de Egresados | Continuidad del catálogo | Interrumpiría el acceso a la oferta escolar destacada. No seleccionada |
| **Después de Egresados, antes de “Más formas de viajar”** | La persona ya conoce las propuestas y puede escuchar experiencias antes de consultar; relación directa con familias y estudiantes | **Seleccionada** como hipótesis de recorrido comercial |
| Al final, después de turismo receptivo | Menor interrupción de ofertas | Mucho desplazamiento y menor relación con el material escolar. No seleccionada |

La página Nosotros no se modificó. Las reseñas existentes están enlazadas desde Contacto; no hay una lista de reseñas verificada que deba duplicarse. El módulo añade un enlace a la URL de Google ya configurada, sin estrellas, calificación, conteo ni citas inventadas. La resolución real de ese enlace externo queda pendiente de comprobación manual.

Composición editorial: un reproductor vertical y un selector de dos experiencias; encabezado y controles a su derecha en escritorio, apilados en móvil. Con dos piezas no se justifica un carrusel ni controles de desplazamiento adicionales. Se reutilizan Inter, azul/naranja y fondo profundo del sistema existente. No se añaden fuentes, animaciones decorativas o librerías.

Título: **“El viaje, contado por quienes lo vivieron.”** CTA: **“Consultar por mi viaje”**, con un borrador que menciona los testimonios y abre la línea configurada de Travel Days. La apertura no demuestra envío ni conversión completada.

## 5. Arquitectura e interacción

- `TestimonialsSection` se ejecuta en servidor: resuelve únicamente medios autorizados, comprueba archivos y pasa datos públicos al cliente.
- `TestimonialPlayer` es la isla cliente. Conserva un único elemento `<video>`; cambiar la selección pausa y descarga su fuente anterior sin comenzar la siguiente.
- Antes de reproducir, el elemento carece de `src`; el atributo `preload="none"` es una segunda defensa. Los posters/miniaturas usan Next Image con carga diferida. Se comprueba la ausencia de peticiones MP4 en la red, incluso tras seleccionar otra miniatura.
- La reproducción y el sonido requieren una acción explícita. Los controles nativos dan pausa, búsqueda, volumen y pantalla completa según navegador/plataforma. No hay autoplay ni loop.
- Al comenzar un testimonio se pausan los demás elementos de video de la página. Se pausa también al salir de pantalla o esconder la pestaña, sin reanudar automáticamente.
- El foco llega al reproductor después de comenzar; el selector usa botones con `aria-pressed`, foco visible y etiquetas explícitas. No se simuló un carrusel con roles de pestañas incorrectos.
- Se reserva una caja 9:16 y se usa `object-fit: contain`. Se respeta el encuadre, no hay recortes de rostros ni salto de tamaño al cambiar de fuente. Movimiento reducido no impide un video solicitado por la persona y no dispara animación automática.
- Un fallo ofrece reintento y enlace al MP4. Sin JavaScript aparecen enlaces a los dos videos completos y permanece el CTA. El modal se descartó: la reproducción inline y la pantalla completa nativa evitan un foco atrapado innecesario.
- Los testimonios usan `decorative: false`. El renderer ambiental los rechaza; los slots de hero/escuelas/historia siguen exigiendo `decorative: true`. Se evita que una entrevista termine silenciada por reutilizar un reproductor de fondo.
- No se añaden dependencias, bases de datos, cookies, servicios, DNS o configuración de hosting.

**Accesibilidad pendiente:** no existen subtítulos revisados. Los borradores automáticos no sustituyen captions verificados ni permiten afirmar conformidad integral WCAG del contenido hablado. Esto queda como P1, aunque el componente y sus controles pasen comprobaciones automatizadas.

## 6. Validación y evidencia

La QA se mantiene en `.next-qa`, con `tsconfig.qa.json`, puertos separados y el lock existente. No se eliminó un lock de otra tarea ni se detuvo un servidor ajeno. El servidor de desarrollo del usuario en 3210 se conservó.

| Comprobación | Resultado |
|---|---|
| ESLint | Ejecutado, exit 0 |
| TypeScript (`next typegen` + `tsc --noEmit`) | Ejecutado, exit 0 |
| Build de producción aislado | Compilación, tipos y prerender de las cinco páginas completados; sin modificar infraestructura |
| `npm run verify:media` | Exit 0; 50 variantes/archivos verificados según el contador del manifiesto |
| FFmpeg | Decodificación completa de originales y derivados, exit 0; H.264/AAC y faststart comprobados |
| Revisión global del navegador | Cinco rutas × 390/1440 px: sin overflow, errores de consola ni violaciones detectadas por Axe en el estado inicial de navegación |
| Módulo responsive | Capturas revisadas a 320, 390, 768 y 1440 px en Chromium, Firefox y WebKit; reproducción, foco, selector y no-JS comprobados por etapas |
| Red antes de interactuar | Sin peticiones MP4 de testimonios; también tras cambiar la selección sin reproducir |
| Audio | Señal PCM distinta de cero en los dos videos en Chromium/Firefox. WebKit: comportamiento y reproducción, sin medición PCM disponible |
| Integridad visual | Los 29 hashes históricos y los 36 actuales se conservan; no se afirma que una comparación global de píxeles contra el diseño anterior haya pasado |
| Git | `git diff --check` y `git diff --cached --check` ejecutados, exit 0; staging concurrente preservado |

Las dos primeras corridas focales fueron **82/93** y **86/93**; no se presentan como verdes. Se corrigieron expectativas antiguas de inventario y ruta de FAQ, comprobación de `playsinline` mediante atributo, espera del poster lazy y supuestos de instrumentación de WebKit. El presupuesto de 110 kB se comprueba sobre imágenes activas del manifiesto; las copias históricas no usadas conservan su inspección de metadatos. No se alteró el archivo histórico `primaria-compact-desktop.webp` de 134.680 bytes para satisfacer una prueba ajena al tráfico actual.

La inyección de error utiliza un MP4 local inexistente para producir un 404 real, sin depender de interceptar el backend multimedia del navegador. La prueba mantiene reproducción y recuperación; no se sustituye video/audio real por mocks. En WebKit de esta máquina se observaron dimensiones decodificadas de 320 × 565 para el primer clip, con duración correcta; se comprueba encuadre/aspecto en navegador y resolución codificada mediante FFmpeg.

El cierre de esos casos y las pruebas adicionales de SEO, CSP y formulario se registran al finalizar la última corrida; la cobertura se informa por etapas, no como una suite global única.

### Medición descriptiva de carga inicial

Tres muestras antes y tres después, Chromium de escritorio con viewport 390 × 844, caché del navegador desactivada, CPU ×4, latencia 150 ms, descarga 200.000 bytes/s, subida 93.750 bytes/s y movimiento reducido. Servidor local de producción; no es Lighthouse ni medición de usuarios o teléfono físico. Se aplicó el mismo protocolo a ambos estados.

| Métrica | Antes | Después |
|---|---|---|
| LCP, muestras (ms) | 2192 / 2168 / 2156 | 2144 / 2152 / 2160 |
| LCP, mediana | 2168 ms | 2152 ms |
| CLS observado, tres muestras | 0,00797 | 0,00339 |

La diferencia de LCP de 16 ms no demuestra una mejora. Hubo cambios concurrentes de hero/navegación; no se atribuyen los resultados al módulo ni se extrapolan a producción. En las diez navegaciones posteriores con movimiento reducido no hubo peticiones MP4 antes de interacción. El código de implementación del módulo se conservó sin cambios desde el snapshot de hashes utilizado para esta revisión.

Evidencia privada local:

- `output/testimonials/inventory.json`: inventario, hashes, resoluciones, silencio y señal.
- `output/testimonials/*-decode.log` y `*-contact-sheet.jpg`: integridad y muestreo visual.
- `output/testimonials/derivatives.json`: tamaños, hashes y política de audio de derivados.
- `output/testimonials/transcription-drafts/`: audio temporal y transcripción automática no revisada.
- `output/testimonials/before/audit.json`: cinco rutas × dos anchos, errores, DOM, Axe y tres muestras sintéticas iniciales.
- `output/playwright/`: pruebas de comportamiento, capturas, trazas y medición PCM en navegador.

### Qué no acredita esta entrega

No acredita escucha humana final, exactitud de ASR, captions revisados, pruebas en iPhone/Safari físico, resolución del enlace Google en una cuenta real, mensajes enviados, conversiones, indexación pública, cumplimiento jurídico individual o un deploy. Las capturas del módulo son revisión visual local; no se presenta una suite visual global contra referencias antiguas como aprobada.

## 7. Auditoría global y recomendaciones priorizadas

Las cinco rutas tienen una estructura reconocible, un H1 por página, canonical, metadata y continuidad visual. El modo de revisión evita indexación; el catálogo conserva ocho destinos; WhatsApp no promete una reserva; no se detectaron overflow ni errores de consola en las capturas iniciales a 390/1440 px. Eso no sustituye los resultados finales ni los pendientes siguientes.

Las prioridades corresponden a esta entrega y al lanzamiento del 3/11, no a una estimación estadística de conversión. P0 = bloqueante de lanzamiento o verificación esencial; P1 = importante antes de producción; P2 = posterior; P3 = refinamiento opcional. Esfuerzos orientativos de ejecución técnica; esperas por agencia, asesoría o dispositivos se indican aparte.

### 1. Actualizar las referencias legales antes de publicar — P0

- **Problema / evidencia:** `/terminos`, `src/features/legal/terms.ts`, “Quiénes somos” y “Nuestra responsabilidad”, presenta la Ley 18.829 y su decreto reglamentario como marco vigente. El texto oficial del DNU 70/2023, art. 349, dispone la derogación de esa ley. Este problema ya está documentado en `docs/07-CLIENT-PENDING-DECISIONS.md` y se verificó de nuevo; no se inventa una interpretación sustitutiva.
- **Impacto:** confianza, precisión institucional y condiciones comerciales publicadas.
- **Solución:** revisión de asesoría y agencia; actualizar autoridad, registro, responsabilidad y contratos con redacción aprobada. Sin cambios automáticos en esta tarea.
- **Esfuerzo:** 1–2 h de integración y QA una vez recibida la revisión; plazo legal externo no estimado.
- **Aceptación:** contenido aprobado por la agencia/asesoría, fuentes y fecha registradas, sin atribuir al legajo un alcance no demostrado.

### 2. Cerrar el modo de revisión en el lanzamiento autorizado — P0, puerta de publicación

- **Problema / evidencia:** las cinco páginas observadas exponen `noindex, nofollow`; `src/config/seo.ts` exige opt-in de indexación durante el build. Es correcto para esta entrega local, pero un release que reutilice este build seguiría bloqueado.
- **Impacto:** una publicación visualmente correcta puede no estar preparada para búsqueda orgánica.
- **Solución:** seguir el checklist existente solo cuando se autorice producción; construir con los valores apropiados y comprobar HTML, robots y headers en el dominio real. Mantener previews bloqueadas.
- **Esfuerzo:** 30–60 min de validación de release; depende de autorización y hosting.
- **Aceptación:** solo el build de producción autorizado permite indexación, con canonical/sitemap correctos y comprobación pública separada. No se modificaron flags ni infraestructura aquí.

### 3. Resolver el respaldo y la atribución de afirmaciones comerciales — P0/P1

- **Problema / evidencia:** hero (`scenic-hero.tsx`) dice “La única agencia”; `trust-cards.tsx` muestra “Pioneros” y “Legajo oficial”; `china-section.tsx` presenta una primacía. La documentación previa registra respaldo/alcance pendientes. Los +23 años son trayectoria del fundador según esa documentación, mientras la agencia se presenta desde 2018.
- **Impacto:** afirmaciones amplias pueden generar expectativas distintas del dato realmente acreditado.
- **Solución:** aportar evidencia por afirmación o aprobar copy descriptivo; aclarar la atribución de trayectoria y el alcance del registro con asesoría. No se declara que las afirmaciones sean falsas por falta de prueba local.
- **Esfuerzo:** 1–2 h técnicas después de aprobación; verificación comercial externa pendiente.
- **Aceptación:** cada afirmación tiene evidencia/alcance o reemplazo aprobado; trayectoria personal no se confunde con edad de la agencia.

### 4. Revisar y sincronizar subtítulos de los dos testimonios — P1

- **Problema / evidencia:** `testimonial-player.tsx` no tiene `<track>` porque solo existen borradores ASR con errores observados. Sin captions, personas sordas o que navegan sin sonido no acceden al contenido hablado.
- **Impacto:** accesibilidad del contenido y comprensión en contextos móviles.
- **Solución:** escuchar/revisar ambos originales, corregir texto, hablantes y tiempos; generar WebVTT y registrar su aprobación. No publicar directamente los SRT automáticos.
- **Esfuerzo:** 1–3 h de revisión y sincronización.
- **Aceptación:** captions completos y fieles, activables, sin tapar información esencial; comprobados contra audio y en móvil. La aprobación del componente no se presenta como conformidad total mientras esto falte.

### 5. Validar audio y controles en teléfonos físicos — P1

- **Problema / evidencia:** la automatización puede comprobar MP4, señal PCM, controles y teclado, pero no el altavoz, volumen del sistema ni los controles nativos de Safari/iOS en un dispositivo real.
- **Impacto:** el audio es el propósito central del módulo.
- **Solución:** prueba física iPhone/Safari y Android/Chrome: reproducir, oír, pausar, ajustar volumen, cambiar video, pantalla completa, giro, retorno de pestaña y red móvil.
- **Esfuerzo:** 30–60 min con dispositivos disponibles.
- **Aceptación:** ambos testimonios se escuchan sin solapamiento; el primer sonido requiere acción; el volumen y el retorno de pantalla completa son utilizables. Registrar dispositivo, sistema y navegador.

### 6. Comprobar el destino real del enlace de Google — P1

- **Problema / evidencia:** `site.googleReviewsUrl` es un enlace `share.google`, usado por Contacto y ahora por testimonios. Las pruebas comprueban su presencia/configuración, no su resolución externa ni la ficha que ve el visitante; la documentación previa mantiene esa verificación pendiente.
- **Impacto:** la prueba social pierde utilidad si el enlace caduca o abre una ficha distinta.
- **Solución:** abrir manualmente desde móvil/escritorio, confirmar nombre, dirección y acceso a reseñas; cambiar URL solo por una oficial confirmada si hace falta.
- **Esfuerzo:** 15–30 min, más gestión de ficha si fuera necesaria.
- **Aceptación:** llega a la ficha correcta y permite consultar reseñas sin publicar ninguna durante la prueba. No inventar estrellas ni conteos.

### 7. Alinear la consulta del hero con Primaria/Secundaria — P2

- **Problema / evidencia:** el hero destaca ambos niveles, pero `TripInquiry` ofrece una opción genérica “Egresados” junto al catálogo; la distinción se recupera después en las tarjetas escolares.
- **Impacto:** la primera consulta puede perder contexto del nivel que interesa a la familia o al grupo.
- **Solución:** evaluar opciones de nivel o un paso escolar breve que prepare el borrador específico, reutilizando los mensajes ya aprobados. No convertir los ocho destinos en paquetes escolares por inferencia.
- **Esfuerzo:** 1–2 h y pruebas de consulta/teclado.
- **Aceptación:** se puede iniciar la consulta por nivel sin precio, disponibilidad ni destino escolar inventados; el borrador mantiene el nivel elegido.

### 8. Medir la contribución del módulo a consultas — P2

- **Problema / evidencia:** `ContactEvents` emite eventos locales sin proveedor. El CTA de testimonios se reconoce como clic general a WhatsApp, pero no tiene atribución específica y no hay medición de reproducción/finalización.
- **Impacto:** no se puede comprobar si la ubicación o las piezas generan consultas de mayor calidad.
- **Solución:** definir una allowlist de origen/ID público y eventos mínimos; elegir proveedor/retención con autorización. No registrar textos, voces, mensajes ni datos personales. Clic no equivale a lead confirmado.
- **Esfuerzo:** 2–4 h más decisión de medición.
- **Aceptación:** eventos documentados y comprobados una vez por acción; se distingue intención, apertura y resultado comercial real.

### 9. Mejorar la lectura de la navegación secundaria del footer — P2

- **Problema / evidencia:** `site-footer.module.css` utiliza texto de 11 px en enlaces de columnas y 10 px en un control secundario. Es legible en capturas, pero pequeño para navegación móvil prolongada; no se declara una infracción WCAG solo por el tamaño.
- **Impacto:** más esfuerzo al buscar datos de contacto o información secundaria.
- **Solución:** evaluar escala de 13–14 px y áreas táctiles más amplias, conservando jerarquía y contenido.
- **Esfuerzo:** 45–90 min y revisión de reflow.
- **Aceptación:** enlaces legibles a 320/390 px y zoom 200 %, sin desbordes ni pérdida de opciones; foco claramente visible.

### 10. Preparar versiones breves después de la revisión editorial — P2

- **Problema / evidencia:** los videos completos duran 1:15 y 2:04. Escuchar todo exige tiempo; no hay evidencia de abandono ni se afirma que un corte aumente conversiones.
- **Impacto:** oportunidad de facilitar una primera escucha sin suprimir el acceso al contexto completo.
- **Solución:** revisar los intervalos candidatos del inventario y, si la agencia los aprueba, editar piezas cortas con pregunta/respuesta y un enlace al video completo. Elegir por claridad y pertinencia, no por extraer elogios aislados.
- **Esfuerzo:** 1–2 h después de la revisión de audio/captions.
- **Aceptación:** cada corte documenta archivo, inicio y fin; conserva el sentido y mantiene accesible el original completo. Medir antes de reemplazar el orden actual.

## 8. Archivos de esta entrega

- `src/app/page.tsx`: inserción del módulo en el recorrido.
- `src/config/media.ts`: dos slots, autorización, procedencia y distinción de video hablado/decorativo.
- `src/features/media/files.ts`, `approved-media.tsx`, `ambient-video.tsx`: propagación y protección de esa distinción.
- `src/features/testimonials/testimonials-section.tsx`: resolución en servidor.
- `src/features/testimonials/testimonial-player.tsx`, `testimonials.module.css`: reproductor, selector y estilos.
- `public/media/travel-days/testimonials/`: dos MP4 y dos posters autorizados.
- `scripts/prepare-testimonials.py`: preparación reproducible con validación de originales.
- `tests/testimonials.spec.tsx`: carga de red, reproducción, señal de audio, selección, errores, teclado, responsive y no-JS.
- `tests/media.spec.tsx`, `tests/home-lower.spec.ts`, `tests/secundaria-video.spec.ts`: contratos actualizados para medios, posición del módulo y comprobación portable de `playsinline`.
- Este informe. Otros archivos modificados durante la sesión corresponden a trabajo concurrente y se preservaron.

## 9. Fuentes y soluciones existentes utilizadas

- Skill instalada `ui-ux-pro-max`: consulta local sobre video, acción explícita y accesibilidad. Se preservó el sistema real del sitio en lugar de generar otro tema.
- Guías React/Vercel y documentación de la versión instalada de Next: `node_modules/next/dist/docs/01-app/02-guides/videos.md` y guía de Server/Client Components.
- [HTML video, MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video): controles y comportamiento del elemento nativo.
- [Web Interface Guidelines, Vercel](https://github.com/vercel-labs/web-interface-guidelines/blob/main/command.md): auditoría de interacción, foco, multimedia y layout.
- [whisper.cpp](https://github.com/ggml-org/whisper.cpp), licencia MIT, binario oficial `b5454`; [modelo multilingüe](https://huggingface.co/ggerganov/whisper.cpp/tree/main). Solo auditoría local.
- [DNU 70/2023, texto oficial, art. 349](https://www.argentina.gob.ar/normativa/nacional/decreto-70-2023-395521/texto). La actualización jurídica concreta corresponde a asesoría.
- Documentos existentes `docs/07-CLIENT-PENDING-DECISIONS.md`, `docs/05-DEPLOYMENT-CHECKLIST.md` y registro de medios del proyecto.

## Próximo paso de mayor valor

Revisar escuchando los borradores de captions y cerrar las afirmaciones/documentación de lanzamiento con la agencia. Después, prueba física de audio y validación pública únicamente cuando se autorice el deploy. El módulo local puede revisarse en Inicio, `#testimonios`.
