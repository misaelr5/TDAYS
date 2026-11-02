# Video de Primaria: Tío Joe — 02/11/2026

Reemplaza el montaje de fotografías anterior en el slot `school:primaria`, compartido por Inicio y Destinos. Reutiliza AmbientVideo y conserva el área visual 3:2 de ambas tarjetas. Sin nuevas dependencias ni cambios en Secundaria.

El usuario confirmó autorización de imagen, incluidos menores, y aclaró usar únicamente `video primaria/Tío Joe primaria.mp4`. Pidió reemplazar las fotos por un montaje equilibrado con prioridad en diversión. Original privado, intacto y excluido de Git. SHA-256: `0e840da55470dcfae8adaef8b470411e31e8314860e4e97ecb142b451bf115e8`.

## Edición

Fuente vertical de 480×848, duración 90,16 s. Montaje final de 12 s a 30 fps, dos planos simultáneos, sin audio. Cada plano conserva 480×640 del original (recorte vertical desde y=80). Separador naranja de 4 px. Se seleccionan actividades, juegos y momentos del grupo; se omiten la presentación y el cierre con logo.

| Inicio en montaje | Plano izquierdo: inicio original | Plano derecho: inicio original | Duración |
| --- | ---: | ---: | ---: |
| 0 s | 31,5 s: escalada | 54,2 s: tobogán | 3 s |
| 3 s | 46,2 s: juego en el agua | 59,4 s: toboganes | 3 s |
| 6 s | 64,2 s: coreografía del grupo | 49,5 s: grupo en el agua | 3 s |
| 9 s | 81,3 s: espuma | 12 s: llegada del grupo | 3 s |

MP4 H.264, yuv420p, faststart, sin audio ni metadatos del original. Desktop: 960×640, 3.506.946 bytes; mobile: 672×448, 1.739.649 bytes. Póster WebP a 0,7 s: 83.626 y 47.872 bytes. Los nombres `primaria-tio-joe-*` evitan reutilizar la caché del montaje anterior. La ampliación del original no añade detalle a la fuente.

Conserva carga por cercanía al viewport, pausa manual persistente, imagen fija con movimiento reducido o ahorro de datos y consulta por WhatsApp. Guion, selección visual, hojas de revisión y render reproducible en `output/primaria-video/`, ignorado por Git. El documento 16 conserva el historial del montaje anterior.

## Validación

- Lint, TypeScript, build de producción aislado y diff check: correctos. Verificador de medios: 46 variantes aprobadas. Los 29 hashes históricos y 36 hashes de referencias anteriores permanecen intactos.
- Inspección técnica de ambos MP4: duración 12 s, resoluciones correctas y ausencia de audio. Original privado excluido de Git, sin modificaciones.
- Revisión visual y reproducción en Inicio/Destinos a 390 y 1440 px: correctas, sin desbordes. Capturas en `output/playwright/primaria-tio-joe/`.
- Ejecución inicial de las suites escolares y de video en Chromium/WebKit: 33 aprobadas de 34. Un caso de Primaria móvil en WebKit agotó la espera de 5 s de arranque; su captura final mostraba el video reproduciéndose. Se amplió únicamente la espera de arranque a 15 s, sin alterar el reproductor ni omitir comprobaciones.
- Ese caso pasó tres repeticiones aisladas en WebKit contra desarrollo, con pausa manual persistente y movimiento reducido. Resultados en `output/primaria-video/recheck-results.json`; la ejecución inicial se conserva en `initial-results.json`. No se repitió la batería completa después del ajuste de espera. La repetición contra producción no pudo iniciarse porque otra ejecución estaba reconstruyendo `.next-qa`; se preservó su bloqueo.

No se ejecutó la suite completa ni se probaron dispositivos físicos. Trabajo local, sin commit, push ni despliegue en esta entrega.
