# Montaje compacto de fotos de Primaria — 02/11/2026

Montaje integrado en Inicio y Destinos, con el mismo tamaño de área visual que Secundaria: 3:2. Dos franjas horizontales, una fotografía arriba y otra abajo, con cambios alternados. Se conserva Secundaria sin modificaciones.

El usuario pidió usar las tres fotos de `egresados y fotos varisa`, excluir `IMG_E2648.JPG`, apilarlas y finalmente reducirlas mediante recortes para igualar Secundaria. Permiso de imagen registrado para P168–P170, incluidos estudiantes y acompañantes. Asignación editorial sin afirmar curso o colegio.

## Edición final

Cada franja tiene proporción 3:1. Recortes centrados en los grupos, priorizando rostros; los originales permanecen intactos. Fundidos de 0,4 segundos, acercamiento leve y desfase de 5,4 segundos entre franjas. Bucle de 10,8 segundos a 30 fps, sin audio ni metadatos de origen. Se reutiliza AmbientVideo con pausa, variantes responsive, movimiento reducido y ahorro de datos. Sin dependencias nuevas.

Computadora: 960×640, 3.028.642 bytes. Celular: 672×448, 1.679.649 bytes. Archivos `primaria-compact-*`, con nombres nuevos para evitar caché anterior. Herramientas locales en `output/primaria-compact/`, ignorado por Git.

| Original | SHA-256 | Recorte x0,y0,x1,y1 |
|---|---|---|
| 482197228_1221605856357025_5238093494456184970_n.jpg | baaea4384caff96a1bcdbb1b158e59b1d4f2dc260106cbf91540b7e5cd92bd87 | 0,501,1600,1034 |
| 1.jpg | e21107d8414de1f2e50053df1994e783d037c661d33f4978f38975df9e8fa7b2 | 0,653,1440,1133 |
| 591143606_18050933660664862_2957467923872386535_n.jpg | bbb7ed6d74185b4e6c71f87107e787b4a39d40c1b61db2fd7017b6a1bd939c63 | 0,605,1440,1085 |

## Validación final

- Lint, medios (46 archivos aprobados), build aislado, TypeScript y diff check: aprobados.
- 16 pruebas focalizadas en Chromium y WebKit contra el build de producción aislado: aprobadas. Inicio y Destinos a 390/1440 px, igualdad de áreas visuales y tarjetas en escritorio, accesibilidad con axe, consultas, ausencia de desbordamiento, reproducción/pausa y movimiento reducido de ambos montajes. Capturas finales revisadas.
- 29 referencias históricas y 36 actuales conservan sus hashes. No se ejecutó la suite completa ni se probaron dispositivos físicos.
- Publicación en GitHub autorizada por el usuario; el commit incluye únicamente este montaje y su integración. Los cambios concurrentes de Familias, Maestros, destinos y agencia quedan fuera. El push no acredita despliegue público.
