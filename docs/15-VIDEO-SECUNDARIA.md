# Video de Secundaria — 02/11/2026

Montaje local integrado en Inicio y Destinos. No acredita publicación remota.

El usuario confirmó en esta conversación que ambos videos tienen autorización de imagen, incluidos los menores. La evidencia y los hashes de los originales están en `src/config/media.ts`. Los originales siguen privados y excluidos de Git.

Se reutiliza `AmbientVideo`: bucle sin sonido, pausa manual persistente al salir y volver al encuadre, póster con movimiento reducido o ahorro de datos y variantes responsive. Sin dependencias nuevas. El encuadre 3:2 contiene dos planos verticales y evita el recorte intenso de un único original vertical.

## Edición

Duración: 12 segundos, 30 fps. MP4 H.264 con faststart, sin audio ni metadatos del original. Póster WebP.

| Plano | Original | Inicio | Duración |
|---|---|---:|---:|
| Izquierdo | TRAVEL DAYS.mp4 | 3,8 s | 3 s |
| Izquierdo | TRAVEL DAYS.mp4 | 10 s | 3 s |
| Izquierdo | TRAVEL DAYS.mp4 | 19,3 s | 2,5 s |
| Izquierdo | TRAVEL DAYS.mp4 | 49,5 s | 3,5 s |
| Derecho | Video tiro bungee.mp4 | 4 s | 2 s |
| Derecho | Video tiro bungee.mp4 | 15,7 s | 1 s |
| Derecho | Video tiro bungee.mp4 | 16,7 s | 6 s |
| Derecho | TRAVEL DAYS.mp4 | 121,5 s | 3 s |

Computadora: 960×640, 3.875.694 bytes. Celular: 672×448, 1.943.427 bytes. La generación y las hojas de revisión se conservan localmente en `output/secundaria-edit/` (ignorado por Git).

## Validación de esta entrega

- `npm run verify:media`: 44 archivos aprobados verificados.
- `npm run lint`, `tsc --noEmit --incremental false`, `npm run build:qa` y `git diff --check`: salida 0.
- 12 pruebas focalizadas aprobadas en Chromium y WebKit contra el servidor de desarrollo, con resultados separados en `output/secundaria-edit/`: Inicio/Destinos a 390/1440 px, enlaces de consulta, accesibilidad con axe, ausencia de desbordamiento, reproducción responsive, pausa manual al salir/volver y póster con movimiento reducido. Capturas de ambas resoluciones revisadas.
- Build de producción aislado en `.next-qa`: aprobado; no se ejecutó la suite completa ni se verificaron dispositivos físicos. Sin commit, push ni despliegue.
