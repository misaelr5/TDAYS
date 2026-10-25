# Medios autorizados

El manifiesto de `src/config/media.ts` permanece vacío: no hay fotografías ni
videos de viajes aprobados localmente. Las ilustraciones de RECREAR se conservan.
No se descargó material de Drive ni se movieron originales a `public/`.

## Flujo

1. Conservar originales y autorizaciones fuera de `public/`.
2. Confirmar contexto, titular y permiso de publicación; la presencia en Drive no
   equivale a autorización. No registrar datos personales de pasajeros.
3. Preparar derivados y recortes autorizados; preservar el original.
4. Colocar únicamente esos derivados en `public/media/` y registrar su procedencia,
   evidencia real, estado, alt y focos desktop/móvil en el manifiesto tipado.
5. Ejecutar `npm run verify:media`, build y pruebas; revisar recortes y peso reales.

Se admiten imágenes PNG/JPEG/WebP/AVIF y video decorativo MP4/WebM con poster por
variante. Rutas locales en minúscula, sin traversal, codificaciones, query strings,
fragmentos o extensiones activas. Focos numéricos de 0 a 100. Una imagen informativa
requiere texto alternativo. Pendientes y rechazados no se renderizan.

`src/features/media/files.ts` comprueba archivos y destinos reales del filesystem;
un symlink/junction no permite escapar de `public/media`. El verificador rechaza
registros aprobados inválidos o incompletos. La comprobación de archivo también
protege el render: ante un archivo ausente se mantiene el fallback.

`npm run build` ejecuta `prebuild`; el ejecutor de QA llama al mismo verificador
antes de invocar Next directamente. No se desactiva la validación de tipos.

## Presentación y privacidad

`Postcard` conserva marcos, proporción y leyenda. `ApprovedMedia` es un componente
de servidor; usa `getImageProps` para producir picture/srcset de Next y un único
recorte móvil hasta 767 px. Los focos cambian por variante mediante CSS aislado.
Sin medio publicable devuelve la ilustración existente sin agregar contenedores.

El resolver omite identificadores internos, autorización y procedencia de sus
props públicas. El único componente cliente de medios recibe rutas y focos.
No importar el manifiesto como valor desde componentes cliente.

Los videos de las postales enlazadas muestran únicamente su poster, evitando
botones interactivos dentro de enlaces. La capacidad de video decorativo fuera
de enlaces requiere activación explícita con `MediaContent allowVideo` en servidor.
Su SSR no publica src ni autoplay. Después de hidratar aplica reduced-motion,
Save-Data, red lenta, visibilidad y pausa del usuario. No hay video activado ahora.
Sin JS, con error o reproducción denegada se conserva el poster.

La validación de derechos sigue siendo humana. El script comprueba consistencia,
rutas y existencia; no acredita autoría ni permisos ni mide calidad de archivos.
La reproducción/decodificación con material final y dispositivos físicos está pendiente.
