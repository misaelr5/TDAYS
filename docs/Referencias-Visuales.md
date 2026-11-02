# Referencias visuales actuales e historia

## Qué se conserva

Las 29 imágenes de `tests/__screenshots__/chromium/` y `tests/baseline.sha256.json` corresponden a la etapa original. No se sobrescribieron. El verificador exige sus hashes exactos antes y después de QA.

## Diseño que define la regresión actual

Se capturó el build intacto del commit aprobado **226b78884199765f4a0cb0011dcc9b79c0a83600**, conservado por la auditoría anterior en una carpeta temporal. Se sirvió en 3213, sin reconstruirlo con los cambios de este sprint. Las 36 imágenes nuevas están en `tests/__screenshots__/chromium/current/`: las cinco páginas a 320, 360, 375, 390, 768, 1024 y 1440 px, más el menú a 390 px.

La captura utiliza Chromium 156.0.8078.4 sobre Windows, viewport de 900 px de alto, escala 1, locale es-AR, timezone de Córdoba y movimiento reducido, como Playwright. La regresión actual fija además transparencia reducida y contraste sin preferencia mediante emulación de Chromium; el modo normal de transparencia tiene controles separados de Axe y captura. Se esperan las fuentes y las imágenes reales; después se restaura el scroll inicial de página y carrusel. No se modifica, reemplaza ni elimina el DOM. La procedencia y SHA-256 de cada archivo se registran en `tests/current-visual-reference.json` y se verifican automáticamente.

No se utilizó `--update-snapshots`. Las capturas se generaron explícitamente desde el build aprobado, antes de comparar la implementación modificada. Los siete estados de Términos no tenían referencia histórica y se incorporaron por primera vez.

## Por qué las capturas antiguas difieren

| Cambios ya integrados | Referencias actuales que los incorporan |
|---|---|
| `93171dd`: destinos, Nosotros, menú y footer móvil | Catálogo fotográfico, capítulos y navegación actuales |
| `55f7295`: Inicio, Egresados y reseñas de Google | Hero, módulo escolar y Contacto vigentes |
| `bc2536d`: DJ Mosca, Facebook y China | Equipo, enlaces y bloque de turismo receptivo |
| `d0263a8`: escolares/El Maestrazo y China al final | Composición de Inicio y catálogo ampliado |
| `226b788`: fotografías escolares y selector | Fotos autorizadas y encuadre/selector aprobados |

Cada caso de la suite conserva la comparación informativa con la imagen histórica cuando existe: captura real, imagen de diferencias en el área común, dimensiones y conteo de píxeles distintos. Una diferencia histórica ya esperada no equivale a una regresión actual ni a igualdad. La regresión actual usa `toHaveScreenshot` con **cero píxeles distintos**, sin normalización del DOM ni tolerancias ampliadas.

Los contratos de tarjetas comprueban las ocho consultas y fotografías actuales, no rotaciones de `.postcard` retiradas. Nosotros conserva su H1 y narrativa durante la captura.

## Cambios concurrentes

Mientras se implementaba esta etapa aparecieron modificaciones ajenas en trece archivos CSS. El usuario confirmó conservar ese CSS y revisar sus diferencias. Se capturaron 36 candidatos sin cambiar dimensiones de página, se revisaron diferencias y vistas reales, y se corrigió el texto blanco del CTA de catálogo sobre el nuevo fondo blanco opaco. Las referencias finales incorporan esas superficies y registran hashes de sus archivos fuente.

También se preservaron ajustes de encuadre escolar, la foto P130 de Maestros y el video/poster V067 de historia incorporados concurrentemente. El usuario confirmó conservarlos e incluirlos en la revisión visual; el manifiesto registra permisos específicos del 28/10/2026. Se revisaron los recursos y su presentación en el snapshot; esto no constituye publicación ni una ampliación de permisos. La comparación inicial del commit y los mapas posteriores están en `output/playwright/stabilization/reference-226b788/` y `current-review/`. La referencia final se capturó en una copia aislada, después de detectar ediciones concurrentes y un servidor de desarrollo ajeno en la carpeta original.

Se mantienen los encuadres e intenciones nuevas, sin aceptar un cambio por igualdad forzada. No se cambió el presupuesto de tamaño de medios: si un recurso nuevo lo excede, la suite debe fallar y conservar esa evidencia aunque su apariencia ya esté registrada.

No hay comando automático para aceptar una nueva apariencia. Cualquier actualización futura debe conservar la historia, guardar el antes/después y registrar aprobación, motivo y hashes.

## Release 1.0: conservar el estado local de entrada

El master prompt del 28/10 exige conservar el trabajo local y no rediseñar. Al comenzar ya existían `src/components/reac/` y la inserción de su firma en el footer; las 36 referencias anteriores todavía no los incluían. Esa discrepancia aumenta la altura del footer, sin ser un cambio visual implementado por el release.

Se reconstruyó una copia del estado inicial desde Git y `output/production-readiness/initial-local-state.zip`, sirviéndola separadamente. Se capturaron las cinco rutas y el menú con contextos nuevos, caché de navegador desactivada mediante routing, misma emulación y sin normalizar el DOM. La comparación de 35 páginas contra el estado modificado dio 32 imágenes idénticas; tres de Nosotros (768/1024/1440) mantienen dimensiones y difieren únicamente en el poster comprimido de Florio. Se revisó su apariencia. El primer intento con un contexto compartido reutilizaba imágenes responsive en caché y fue descartado.

La revisión se conserva en `initial-vs-release.json`, `initial-captures/`, `release-captures/` y `previous-visual-reference.json` bajo output/production-readiness. Las referencias actuales registran ahora la firma preexistente y la compresión; su manifiesto conserva la revisión anterior y añade hashes de las fuentes de la firma y del formulario/video. Los PNG anteriores están en el ZIP inicial. Las 29 referencias históricas permanecen intactas. Se mantiene comparación estricta sin tolerancias adicionales.

La primera ejecución fue interrumpida por un build iniciado por error en el directorio QA compartido. Su log/capturas se conservan como diagnóstico, no como ejecución aprobada. La aceptación se basa exclusivamente en la repetición desde build limpio documentada en 04-QA-RESULTS.

Después de esa comparación se aclaró el subtítulo de la tarjeta +23 años: “Trayectoria de Javier Garay en turismo”, conforme al dato aportado por el usuario, manteniendo la fundación comercial en 2018. Se capturaron siete candidatos nuevos de Inicio; todos conservan las dimensiones anteriores y los únicos píxeles diferentes pertenecen a esa línea. Se revisó además `clarified-home/card-390.png`. Se registran candidatos y mediciones en `output/production-readiness/clarified-home/`; el manifiesto incorpora hashes de trust-cards, trip-inquiry y layout. No cambia el diseño de las ocho tarjetas de destinos.
