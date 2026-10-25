# Migración · etapa 1 · base recuperable y QA

Decisión del usuario: RECREAR es la base definitiva. TravelDays original se consulta
como fuente; su diseño anterior no se importa. La migración se revisa por etapas.
El diseño vigente se conserva y cualquier corrección visual se propone aparte.

## Respaldo previo

- Commit de partida: `7b5cc0e1272957fb7849100f59a122145ec7b693`.
- Remoto local: `https://github.com/misaelr5/TDAYS.git` (sin fetch ni cambios de remoto).
- Copia: `D:\Backups\TravelDays\RECREAR-stage1-2026-10-25T11-11-33-760Z`.
- 43 archivos, 6.542.518 bytes; todos comparados por SHA-256 tras copiar.
- `manifest.json` registra hashes, Git, originales y archivos locales no seguidos
  del proyecto fuente. No copia `.git`, instalaciones, builds ni resultados.
- Incluye el video original. Para recuperar, copiar `source/` a una carpeta nueva,
  verificar con el manifiesto y ejecutar `npm ci`; no sobrescribir trabajo vigente.

## Reutilización y dependencias

Se adaptan contratos de las pruebas del original y de las auditorías locales de
`output/playwright/`. Los selectores y las capturas corresponden a RECREAR.

- `@playwright/test` 1.64.1: runner, servidor de pruebas, capturas, reportes y trazas.
  Proyecto oficial de Microsoft; Apache-2.0; requiere Node >=20.
- `@axe-core/playwright` 4.14.0: integración de axe con el runner. Proyecto oficial
  de Deque; MPL-2.0; requiere Node >=22.12.0. Reutiliza axe-core ya instalado.
- Dependencias exclusivas de desarrollo, versiones exactas; sin servicio externo
  ni coste de hosting. No se agregó otra librería de interfaz o animación.
- La instalación informó cero vulnerabilidades en el árbol instalado. Es una
  comprobación puntual del registro npm, no una auditoría de todo el código.

Referencias: [Next y Playwright](https://nextjs.org/docs/app/guides/testing/playwright),
[comparación visual](https://playwright.dev/docs/test-snapshots),
[axe y Playwright](https://playwright.dev/docs/accessibility-testing).
Se consultaron además las guías incluidas en la versión instalada de Next para
`distDir`, `typescript.tsconfigPath` y Playwright.

## Repetir la validación

Node 24 y npm; instalar primero con `npm ci`. Si falta el navegador:

```powershell
npx playwright install chromium
```

Ejecutar secuencialmente:

```powershell
npm run lint
npm run typecheck
npm run build
npm test
```

`npm test` construye una versión de producción para QA en `.next-qa/`, verifica
que el puerto 3211 esté libre y ejecuta Playwright con un solo worker. No reutiliza
ni detiene servidores existentes. El desarrollo sigue usando 3210 y `.next/`.
Puede elegirse otro puerto con `$env:RECREAR_TEST_PORT = '3212'`.

No ejecutar builds, generación de tipos ni dos suites simultáneamente en esta
carpeta. Next reescribe `next-env.d.ts` incluso al usar otro `distDir`; el ejecutor
lo guarda y restaura byte por byte después del build de QA. `tsconfig.qa.json`
separa los tipos y la caché de QA. Un lock evita dos ejecuciones del propio runner.
Si una terminación forzada dejara `output/playwright/qa.lock`, comprobar primero
que no hay una ejecución activa antes de retirar únicamente ese archivo.

Para filtrar una prueba sin omitir la reconstrucción de QA:

```powershell
npm test -- tests/contact.spec.ts
```

## Referencia visual

`tests/__screenshots__/chromium/` conserva 28 capturas completas: cuatro rutas en
320, 360, 375, 390, 768, 1024 y 1440 px, más una captura del menú móvil. Es contenido
de referencia que debe versionarse junto a las pruebas, no un resultado temporal.
Los reportes, trazas y diferencias van a `output/playwright/`, ignorado por Git.

Las capturas usan Chromium, fuentes locales, alto de 900 px y reduced-motion.
La comparación exige cero píxeles distintos. El entorno de referencia es Windows;
cambiar navegador, sistema o fuentes puede requerir una referencia separada y
revisión humana. La prueba de movimiento normal se ejecuta aparte de las capturas.
Antes de capturar se recorren las imágenes para activar su carga diferida y se
vuelve al inicio. Las capturas completas disponen de 20 segundos para estabilizarse;
este plazo no cambia la tolerancia visual.

Actualizar capturas es una acción explícita:

```powershell
npm run test:visual:update
```

Revisar cada diferencia antes de aceptar una referencia nueva. No actualizarla
para esconder un cambio de diseño. La creación inicial establece una referencia;
una segunda ejecución sin actualizar comprueba su estabilidad.

## Cobertura y límites

- Estructura, H1, overflow y recursos de las cuatro rutas en siete anchos.
- Ocho destinos y consultas específicas al WhatsApp documentado.
- Menú, Escape, foco, scroll, navegación, carrusel y extremos.
- Consulta y opinión: obligatorios, espacios, teléfono, límites, Unicode,
  puntuación opcional, foco del borrador e invalidación al editar.
- Ausencia de almacenamiento y envíos; no se abre WhatsApp ni otros servicios.
- Reduced-motion, parallax normal, contenido y alternativas sin JavaScript.
- Metadatos actuales, noindex, robots, headers, 404 y `/quienes-somos` retirada.
- axe en las cuatro rutas a 390 y 1440 px; sus resultados no sustituyen una
  revisión manual ni acreditan conformidad completa con WCAG.

No se verifican recepción real de WhatsApp, Safari/iPhone físico, producción
pública ni rendimiento con fotografías finales.

Limitaciones previas observadas en el código y reservadas para etapas posteriores:

- Sin JavaScript, el botón del menú no abre el diálogo. La prueba verifica que las
  cuatro rutas siguen accesibles desde el footer y que Contacto ofrece alternativas.
  La mejora de la cabecera corresponde a la etapa 4 y se propondrá por separado.
- Los errores de formulario tienen `role="alert"` y validación nativa, pero falta
  asociar explícitamente los errores de aplicación a cada campo; etapa 4.
- En `/nosotros`, “Conocé nuestra historia” apunta a la misma ruta; etapa 3.

## Resultados

Validación del 25/10/2026, local en Windows, Node 24.15.0 y Chromium 156.0.8078.4:

| Comprobación | Resultado |
| --- | --- |
| `npm run lint` | Aprobado |
| `npm run typecheck` | Aprobado |
| `npm run build` | Aprobado; las cuatro páginas siguen prerenderizadas |
| `npm test` | 75 aprobadas, cero fallos, cero omitidas; 2,1 minutos de pruebas |
| Regresión visual sin actualizar referencias | 29 comparaciones aprobadas, cero píxeles de diferencia |
| axe, cuatro rutas por dos anchos | Ocho análisis sin infracciones detectadas |
| `npm audit --json` | Cero vulnerabilidades reportadas |
| Puerto ocupado | Rechazo antes del build; listener y hashes preservados |
| `next-env.d.ts` | Restaurado al hash original tras QA |
| Integridad de aplicación y recursos | 30 archivos sin cambios frente al respaldo |
| Integridad del original | 849 archivos y su estado Git local preservados |
| Integridad del respaldo | 43 copias verificadas nuevamente |
| `git diff --check` | Aprobado |

Se revisaron visualmente capturas de las cuatro páginas a 390 y 1440 px, además
del menú móvil. Las siete anchuras están cubiertas por pruebas y referencias.
No se modificaron `src/`, `public/` ni el video; no hubo commits, push ni deploy.
Al cierre había un servidor `next dev` en 3210, iniciado después del relevamiento
inicial. Se conservó. Las pruebas reportadas usaron exclusivamente producción de
QA en 3211; ese servidor de QA terminó al concluir la suite.

Evidencia local:

- `output/playwright/results.json` y `output/playwright/report/index.html`.
- `output/playwright/dependency-audit.json`.
- `output/playwright/port-guard.json`.
- `output/playwright/integrity-stage1.json`.
- `output/playwright/review/`: recortes/copias para revisión; las referencias
  originales permanecen en `tests/__screenshots__/chromium/`.

La primera pasada detectó problemas de la propia prueba: se juzgaba el logo
lazy del footer antes de activar su carga, y el plazo de captura de cinco segundos
era insuficiente para Home a 1440 px. Se corrigieron las esperas sin cambiar la web
ni reducir el rigor de las comprobaciones. Los resultados iniciales se conservan
en `output/playwright/initial-results.json`.
También se sustituyó una espera con `requestAnimationFrame`, bloqueada al desactivar
JavaScript, por una comprobación observable de la clase de la cabecera. La suite
final completa se ejecutó después de estas correcciones, sin actualizar imágenes.

## Próxima etapa

Después de la revisión: recuperar manifiesto y autorización de medios, manteniendo
las ilustraciones mientras no haya fotografías autorizadas. Las etapas 3–5
completan contenido institucional/catálogo, accesibilidad/SEO y validación integrada.
La publicación queda fuera del alcance autorizado.
