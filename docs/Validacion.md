# Validación inicial · 23/10/2026

Evidencia de la primera implementación, previa al cambio de rutas y formularios. Ver [revisión vigente de Contacto y navegación](Contacto-Navegacion.md).

## Probado

- `npm run lint`: sin errores ni warnings.
- `npm run typecheck`: tipos de rutas y TypeScript estricto aprobados.
- `npm run build`: build de producción aprobado; las cuatro páginas son estáticas/prerenderizadas. Sin advertencias de configuración en el build final.
- `npm audit --omit=dev --json` y `npm audit --json`: cero vulnerabilidades reportadas al cierre. Versiones exactas y `package-lock.json` actualizado.
- Playwright CLI con Chrome, sobre **producción local**, cuatro rutas × seis anchos (320, 360, 390, 768, 1024, 1440): 24 casos con HTTP 200, un H1 por ruta, sin desbordamiento horizontal del documento, imágenes rotas o enlaces sin nombre.
- Consola final: cero errores y cero warnings. Sin errores JavaScript de página durante la auditoría.
- Menú a 390 px: abre como modal, bloquea scroll, mantiene foco dentro al usar Shift+Tab, cierra con Escape, restaura el botón de apertura y desbloquea scroll. Navegar a Destinos cierra el diálogo y llega a `#destinos`.
- Carrusel móvil: siguiente desplaza 354 px; ArrowLeft vuelve a 0. Controles deshabilitados en extremos e indicador ajustado a la capacidad de la vista.
- Catorce enlaces WhatsApp presentes en la portada: número configurado correcto y mensaje precargado. **No se enviaron mensajes ni se abrieron conversaciones durante el test.**
- Parallax: la matriz de transformación cambia al desplazarse; con movimiento reducido, la transformación calculada del grupo es `none`.
- JavaScript desactivado a 390 px: título, ocho tarjetas y enlace de consulta presentes. La navegación al pie permite recorrer rutas; el menú animado y sus controles requieren JavaScript.
- axe-core, etiquetas WCAG 2 A, 2 AA y 2.1 AA sobre portada a 390 px: 24 reglas aprobadas, cero infracciones detectadas. Esto es una revisión automatizada limitada a esa vista, no una certificación integral.
- `robots.txt`: HTTP 200 y `Disallow: /`. Ruta inexistente: HTTP 404.
- Comparación visual de capturas con fotogramas: se revisaron hero, orden de cinco bloques, proporciones desktop, reloj, tarjetas y recibo. Se corrigieron espaciado de títulos, contenido comprimido del pasaporte móvil, ciclo de foco y superposición de una postal sobre el texto de cierre.

## Evidencia

- `output/reference/details-0.jpg` a `details-2.jpg`: secuencia del video.
- `output/playwright/home-1440-final.png` y `home-390-final.png`: páginas completas.
- `output/playwright/hero-1440-final.png` y `hero-390-final.png`: portada.
- Capturas equivalentes de `destinos`, `quienes-somos` y `contacto` a 390 y 1440 px.
- `output/playwright/menu-390.png`, `home-no-js-390.png`.
- `output/playwright/audit-summary.json`: resultados de los 24 casos e interacciones.
- `output/playwright/audit-result.txt`: salida de Playwright CLI; `audit.js`: auditoría utilizada.
- `output/playwright/console-final.txt`, `audit-production.json`, `audit-dependencies.json`.

La evidencia se guarda localmente en `output/`, excluido de Git para no versionar capturas y logs por defecto. Capturas de inspección anteriores pueden permanecer en esa carpeta; los archivos `*-final` y el resumen contienen la revisión vigente.

Para repetir la auditoría, iniciar primero la producción local con `npm run start` después de construir:

```powershell
npx --yes --package @playwright/cli playwright-cli -s=recrear open http://127.0.0.1:3210 --browser chrome
npx --yes --package @playwright/cli playwright-cli -s=recrear run-code --filename output/playwright/audit.js
```

## No probado y límites

- Dispositivos físicos, Safari/iOS, Android y Firefox.
- Core Web Vitals en producción, Lighthouse o pruebas de carga. No se atribuyen puntuaciones de rendimiento.
- Reservas, envíos, correo, pagos o integraciones de backend: no forman parte de esta implementación.
- Fotografías y video real de destinos: siguen pendientes de entrega y autorización. La vista ilustrada no permite afirmar fidelidad fotográfica al original.
- Dominio público, Git remoto, publicación e indexación: no se modificaron. No se hizo commit, push ni deploy.

## Siguiente paso

Revisar visualmente esta versión con el usuario e incorporar fotografías autorizadas a `approvedPhotos`, ajustando recortes por destino. Las decisiones de backend, Auth y Supabase quedan para otra etapa; no se construyeron abstracciones especulativas.
