# Cloudflare: evaluación y plan de prueba

Revisión: 29/10/2026. Revisión para cliente: 30/10; entrega prevista: 03/11. Solo investigación y documentación: no se instalaron adaptadores, no se cambió runtime/configuración, no se desplegó ni modificó DNS.

## Decisión recomendada

**Conservar Next.js y el despliegue Node compatible para la entrega.** El repositorio ya tiene una configuración y QA de Next; cambiar de compilador/runtime introduce otra matriz de validación a días de la revisión. Si Cloudflare es un requisito de contratación, probar OpenNext en una copia aislada con las versiones actuales antes de comprometer producción. Es una recomendación específica de riesgo para este proyecto existente, no la recomendación general actual del proveedor.

Cloudflare actualmente recomienda **vinext** para Next.js en Workers y reserva su guía OpenNext principalmente al mantenimiento de aplicaciones existentes. La recomendación del proveedor no demuestra compatibilidad de esta web sin ejecutar la prueba. [Guía Cloudflare Next.js](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/).

## Hechos del repositorio inspeccionados

- `package.json`: Next 16.4.2, React/React DOM 19.3.1, Node >=24 <25, npm/lockfile. No hay vinext, OpenNext ni Wrangler en las dependencias.
- `next.config.ts`: build Next, headers de seguridad/CSP y bloqueo de indexación; ninguna exportación estática o configuración Cloudflare.
- Cinco rutas públicas, metadata/robots/sitemap prerenderizados; consultas como borradores de WhatsApp. No hay backend de consultas, DB, cuentas ni pagos que deban migrarse.
- `next/image` y `getImageProps` aparecen en cabecera, medios, secciones y 404. El optimizador de imágenes es una dependencia de despliegue real, aunque las páginas sean estáticas.
- `src/config/seo.ts`: dominio canónico `https://traveldays.tur.ar`; indexación exige `SITE_INDEXING=true` y entorno `production`. Canonical de producción en una preview es deliberado y no autoriza indexarla.
- Revisión de nombres de variables de entorno: sin `CLOUDFLARE_*`/`WRANGLER_*`; no se encontraron binario Wrangler ni directorios de autenticación en las dos ubicaciones habituales inspeccionadas. No se buscaron/imprimieron tokens. Esto no prueba que el usuario carezca de una cuenta en el navegador.
- Mayor archivo de `public`: `maestrazo-termas-desktop.mp4`, 1.337.806 bytes. No se deben subir los originales privados.
- Rama observada `main`, HEAD `226b78884199765f4a0cb0011dcc9b79c0a83600`, con cambios locales extensos. Crear un worktree desde HEAD solamente omitiría ese trabajo: primero consolidar o copiar el estado revisado sin secretos/artefactos. No se cambió de rama ni se creó una rama que aparente contener cambios que siguen sin commit.

## Comparación de alternativas

| Alternativa | Viabilidad para esta web | Adaptaciones y riesgo | Clasificación |
|---|---|---|---|
| A. Pages con exportación estática | Posible con adaptaciones; no desplegable tal cual | Export `output: "export"`, resolver imágenes, trasladar headers y comprobar 404/metadata/URLs. Hosting sencillo, pero el portal futuro requiere otra aplicación o migración | ADAPT |
| B. Workers con vinext | Candidato actual del proveedor; compatibilidad de esta web no probada | Cambia Next build por Vite/reimplementación de APIs. Revisar fuentes locales, imágenes, metadata, CSS/GSAP/Motion, enlaces y CSP; suite completa y medición nuevas | ADAPT |
| C. Workers con OpenNext | Candidato para mantener `next build`; versión instalada dentro del rango declarado | Adaptador + Wrangler, workerd, bindings de imágenes/caché, Linux/WSL y QA de runtime. Menor cambio conceptual del compilador, no cero cambio operativo | INTEGRATE |
| Next en hosting Node compatible | Ruta actual de menor cambio | Elegir cuenta/plan comercial, operación, TLS, caché, logs, rollback y verificar dominio. No se contrató proveedor | REUSE |

### A. Pages

La guía Pages admite export estático, build `npx next build`, salida `out`. [Pages: static Next.js](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/).

Next export no soporta el optimizador de imágenes predeterminado ni `headers()` del servidor. Tampoco auth/Server Actions/ISR dinámico. Un `next build` prerenderizado normal no equivale a `output: "export"`. [Next: static exports](https://nextjs.org/docs/app/guides/static-exports).

Para esta web: preparar un loader compatible o derivados responsive sin perder tamaños/calidad; trasladar CSP/noindex/headers a `public/_headers` y comprobar respuestas reales; conservar cinco rutas y 404. Evitar activar `images.unoptimized` globalmente como atajo sin medir el efecto. No se hizo un build exportado: **viabilidad inferida**, no validada. El formulario actual no necesita servidor porque prepara un borrador; el portal privado deberá separarse del export.

### B. vinext: aclaración sobre beta y versiones

El pedido lo describe como beta. En la consulta actual del registro oficial npm, `latest` fue **1.4.0**, publicado el 28/10, y `beta` sigue apuntando a **1.0.0-beta.0**. La release GitHub 1.4.0 figura `prerelease: false`. Por lo tanto, no se debe presentar la distribución estable consultada como beta sin matiz. Esto tampoco certifica madurez para cada aplicación. [Registro oficial vinext](https://registry.npmjs.org/vinext), [release 1.4.0](https://github.com/cloudflare/vinext/releases/tag/vinext%401.4.0).

El README advierte brechas de compatibilidad y diferencias en optimización de fuentes locales/imágenes y módulos nativos. Propone `vinext check` antes de migrar. Reimplementa APIs sobre Vite, no adapta la salida Next. Licencia MIT. [Repositorio oficial](https://github.com/cloudflare/vinext).

Riesgos propios: la fuente local, los posters/videos autorizados, `getImageProps`, la metadata de archivo y las animaciones ya tienen contratos verificables. Revalidarlos requiere tiempo; la coincidencia de peers React 19.3.1 no demuestra igualdad de render. No ejecutar `vinext init` en main: instala paquetes y modifica configuración/scripts. Un spike futuro puede comenzar por `npx vinext@1.4.0 check` en una copia; comando propuesto, no ejecutado.

### C. OpenNext

La documentación admite Next 16 y recomienda Linux/WSL/CI ante soporte Windows limitado. El runtime Next debe ser Node; el despliegue final corre en workerd con APIs compatibles, no en un proceso Node completo. [Soporte OpenNext](https://opennext.js.org/cloudflare).

El registro npm consultado devuelve `@opennextjs/cloudflare` **1.20.14**, publicado 28/10, licencia MIT, peer `next: ">=15.5.28 <16 || >=16.4.1"`, `wrangler: "^4.148.0"`. Next 16.4.2 cumple ese rango declarado. Wrangler consultado: **4.156.0**, Node >=22 y licencia MIT OR Apache-2.0; satisface ese peer y Node 24. [Registro OpenNext](https://registry.npmjs.org/@opennextjs%2Fcloudflare), [registro Wrangler](https://registry.npmjs.org/wrangler).

Ambos repositorios estaban activos/no archivados, con pushes del 29/10; las releases vinext/OpenNext consultadas son del 28/10. La actividad y las licencias permiten evaluarlos, pero no reemplazan audit de dependencias, advisories ni prueba de integración tras instalarlos. No se afirma ausencia de vulnerabilidades de esos paquetes no instalados. [OpenNext oficial](https://github.com/opennextjs/opennextjs-cloudflare), [vinext oficial](https://github.com/cloudflare/vinext).

## Receta propuesta de prueba OpenNext

**No ejecutada.** Aplicar en copia aislada del estado completo revisado, o en rama después de una consolidación autorizada. No modificar la checkout de QA mientras se ejecuten builds. Usar Linux/WSL para reducir diferencias de tooling Windows.

1. Registrar hashes de origen y conservar el rollback. Copiar solo fuentes, assets públicos aprobados y configuración: nunca originales, `.env` reales, `.next`, `node_modules` u `output`.
2. Instalar versiones fijadas y revisar diff/lockfile, licencia y `npm audit` antes del build:

```powershell
npm install --save-exact @opennextjs/cloudflare@1.20.14
npm install --save-dev --save-exact wrangler@4.156.0
```

3. Añadir `open-next.config.ts` con `defineCloudflareConfig()` y `wrangler.jsonc` de prueba, siguiendo la [configuración manual Cloudflare](https://developers.cloudflare.com/workers/framework-guides/web-apps/opennext/):

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "travel-days-review",
  "main": ".open-next/worker.js",
  "compatibility_date": "2026-10-29",
  "compatibility_flags": ["nodejs_compat"],
  "workers_dev": true,
  "assets": { "directory": ".open-next/assets", "binding": "ASSETS" },
  "images": { "binding": "IMAGES" },
  "vars": { "SITE_INDEXING": "false", "SITE_ENV": "review" }
}
```

No agregar `routes`, custom domain ni recursos de producción. La fecha es una propuesta para el spike; se debe probar, no actualizar automáticamente cada build. Agregar `.open-next/`, `.wrangler/`, `.dev.vars*` a exclusiones Git de esa rama. Asegurar cache immutable para `/_next/static/*`; el adapter no sustituye la verificación de headers reales.

4. Mantener `npm run build` como Next build. Usar `defineCloudflareConfig()` vacío inicialmente; añadir caché R2 y self-reference solo si el comportamiento que se adopte lo requiere. El comando `migrate` puede crear recursos R2: no usarlo a ciegas. [Instalación OpenNext](https://opennext.js.org/cloudflare/get-started).
5. Imágenes requieren `IMAGES` o loader propio. Confirmar habilitación/costo y resultado responsive; no llamar éxito a HTML con imágenes rotas. [OpenNext Images](https://opennext.js.org/cloudflare/howtos/image).
6. Definir las variables de **build** además de ejecución. En terminal de la copia:

```powershell
$env:SITE_INDEXING = 'false'
$env:SITE_ENV = 'review'
npx opennextjs-cloudflare build
npx opennextjs-cloudflare preview
```

`preview` sirve workerd local, no crea una URL alojada. Validar allí primero. El `webServer` actual de Playwright arranca `next start`: para probar Cloudflare configurar un runner dedicado contra esta preview, conservando el runner Next. Pasar la suite Next no demuestra compatibilidad Workers.

7. Para alojar la prueba hace falta cuenta/proyecto de la agencia y autenticación con privilegios mínimos. Puede usarse login Wrangler interactivo o token en secreto de CI, sin guardarlo en config/commits/`NEXT_PUBLIC_*`. No hay secretos de aplicación necesarios para el formulario actual. Con cuenta confirmada, nombre de prueba libre y autenticación, el comando propuesto es `npx opennextjs-cloudflare deploy`, que despliega únicamente el Worker de prueba de esta config. Revisar cuenta y plan antes: no ejecutarlo contra un Worker existente. Usar URL workers.dev sin asociar dominio; restringir acceso de revisión con la plataforma y mantener noindex. Noindex no es privacidad.

## Validación de aceptación y costes

- Comprobar cada página y las ocho fichas actuales, mensajes/contexto WhatsApp sin envío real, menú/foco, formularios, mapa bajo demanda, videos/reduced motion y 404 con HTTP correcto.
- Verificar HTML rastreable, canonical, JSON-LD, OG/Twitter, robots/sitemap, noindex y CSP/headers efectivos también para assets/404; confirmar ausencia de secretos/originales en artefactos.
- Comparar capturas 360/390/430/768/1440 con el estado preservado, especialmente tarjetas aprobadas. Medir Lighthouse móvil en condiciones comparables y revisar consola/CSP de los tres motores. No aceptar una mejora de score a costa de funciones/diseño.
- Hacer `wrangler deploy --dry-run` y revisar tamaño/startup antes del remoto. Workers publica límites de 25 MiB por asset y 64 MiB sin comprimir por Worker al consultar esta fecha; el archivo público mayor observado queda por debajo del primero, pero no se generó bundle del adaptador. Comprobar CPU/memoria/requests y límites del plan elegido. [Límites vigentes](https://developers.cloudflare.com/workers/platform/limits/).
- Cotizar Workers, transformaciones de Images y cualquier R2/observabilidad realmente usado. No prometer hosting gratuito o gasto fijo sin tráfico/plan medidos. Evitar habilitar productos que esta web no necesita.

## Arquitectura futura y bloqueos

La separación documentada en [06-FUTURE-PLATFORM-ARCHITECTURE](06-FUTURE-PLATFORM-ARCHITECTURE.md) es suficiente ahora: catálogo/config públicos y features no dependen de pasajeros/pagos. No se identificó un acoplamiento que justifique agregar auth, DB o servicios anticipadamente. Portal separado o route groups se decidirán con alcance/roles/proveedor de pagos. Un deploy estático no obliga a reescribir el sitio público cuando el portal tenga otro origen; un deploy Workers tampoco resuelve por sí solo autorización ni caché privada.

**Pendiente:** cuenta/proyecto/autenticación Cloudflare, presupuesto/Images y ejecución del spike/build/QA en workerd. Sin esos datos no se pudo crear un entorno remoto ni verificar su URL. No se cambió de rama porque el estado actual sin commit requiere una copia/consolidación fiel antes; una referencia a HEAD no contendría los cambios revisados. No hay despliegue Cloudflare listo acreditado. La publicación definitiva y DNS continúan condicionados a autorización explícita y checklist de [05](05-DEPLOYMENT-CHECKLIST.md).

## Apéndice: cambio concurrente del 29/10, observado alrededor de las 18:25

**Este apéndice actualiza el estado inicial anterior; las afirmaciones de ausencia de adaptador/configuración describen la primera inspección.** Otro hilo incorporó OpenNext/Wrangler y comenzó pruebas locales mientras se realizaba esta evaluación. No son instalaciones, implementaciones, builds ni despliegues hechos por el autor de este informe. Se preservan íntegramente; aquí se revisan archivos y procesos sin intervenir en ellos. La receta anterior es una propuesta histórica, no una instrucción para reinstalar sobre este estado nuevo.

### Configuración nueva observada

- `package.json`/lockfile ahora incluyen `@opennextjs/cloudflare: 1.20.14` y `wrangler: 4.156.0`, con scripts `cf:build`, `cf:preview`, `cf:deploy`, `cf:typegen`. Los scripts normales siguen siendo `next dev`/`next build`/`next start`; Next 16.4.2 y React 19.3.1 siguen fijados.
- `open-next.config.ts` usa `staticAssetsIncrementalCache` y `enableCacheInterception: true`. La implementación instalada declara caché de solo lectura para datos prerenderizados, sin revalidación, y guarda artefactos bajo `cdn-cgi/_next_cache`. Es coherente con la web pública estática actual; no se debe reutilizar sin revisión para saldos, documentos, auth, ISR o escrituras del portal futuro.
- `wrangler.jsonc`: Worker `travel-days-preview`, entrada `.open-next/worker.js`, fecha 2026-10-29, flags Node/strict public fetch, assets e `IMAGES`, observabilidad y workers.dev habilitados. Sin `routes` ni custom domains; `preview_urls: false` no deshabilita el hostname principal workers.dev. El archivo no contiene `SITE_INDEXING`/`SITE_ENV`: el bloqueo depende del build/entorno efectivo; el código Next sigue seguro por defecto, pero hay que comprobarlo en el artefacto antes de alojarlo.
- `public/_headers` añade caché immutable para bundles, nosniff y política de referrer de assets. HTML servido por Worker debe conservar CSP/noindex y demás headers de Next; comprobar respuesta efectiva y 404, no inferirlo del archivo. La cifra comercial sobre Images incluida en un comentario de Wrangler no se validó en esta inspección y no constituye una cotización.
- `playwright.cloudflare.config.ts` hereda proyectos/casos de la suite, cambia origen a 3212 por defecto y escribe resultados en `output/playwright-cloudflare/`. Arranca preview del artefacto existente, **no lo reconstruye**. Una suite contra ese proceso solo valida los bytes del build previo, que podrían anteceder a cambios de aplicación.
- `.gitignore`, ESLint y `tsconfig.json` excluyen `.open-next`/`.wrangler`; se añadieron exclusiones de secretos locales `.dev.vars*` a Git. `tsconfig.qa.json` redefine `exclude`, por lo que **no hereda** las exclusiones nuevas: se observaron `.open-next/**/*.d.ts` y `.wrangler/tmp/**/middleware-loader.entry.ts` potencialmente incluidos por su glob `**/*.ts`. Revisar esa contaminación al generar tipos/QA; no se modificó la configuración desde esta auditoría.
- Se observaron procesos ajenos de preview workerd/Wrangler en 8787 y 3212, y una suite Chromium de Cloudflare. No se detuvieron, reutilizaron ni se interpreta su presencia como resultado aprobado. También se observó una suite de otra checkout `RECREAR-refactor`, que no acredita esta checkout.
- Cambio concurrente de aplicación detectado: `src/app/layout.tsx` importa `src/app/fonts/inter.ts` y un nuevo `InterLatin.woff2`, conservando un face extendido. No se atribuye a esta evaluación ni se certifica comparación visual/tipográfica en este apéndice.

### Riesgo concreto de concurrencia

`next.config.ts` mantiene la salida ordinaria `.next`; solo `RECREAR_QA=1` selecciona `.next-qa` y `tsconfig.qa.json`. `cf:build` invoca el build normal a través del adaptador y **no toma el lock de `scripts/qa.mjs`**. Puede colisionar con un dev que sirva `.next`, otro build CF/Next o `next typegen`; todos pueden tocar `next-env.d.ts`. Los reportes CF están separados, pero eso no aísla build ni generación de tipos. Ejecutar builds/typecheck secuencialmente con coordinación entre hilos y verificar qué artefacto sirve cada suite. No borrar locks ni parar procesos ajenos para despejar el puerto.

### Auditoría nueva: cuatro paquetes HIGH, una cadena de advisory

El lockfile nuevo invalida el resultado inicial de cero vulnerabilidades. La auditoría preservada en `output/readiness-20261029-174200/audit-concurrent-lock.json` informa **4 HIGH, 0 críticas**. Corresponden a una misma vulnerabilidad propagada por la cadena:

```text
@opennextjs/cloudflare 1.20.14
  -> @opennextjs/aws 4.1.13
    -> @node-minify/core 9.0.2
      -> glob 10.3.3
```

GHSA-5j98-mcp5-4vw2 / CVE-2025-64756 afecta el CLI `glob -c/--cmd` al procesar nombres de archivos maliciosos mediante shell; el parche de la rama 10 está en **10.5.0**. El advisory distingue expresamente la API de biblioteca como no afectada. [Advisory oficial](https://github.com/advisories/GHSA-5j98-mcp5-4vw2).

En la instalación actual, `@node-minify/core/dist/index.js` usa `globSync` (líneas 176/189), y `@opennextjs/aws/dist/minimize-js.js` importa el minificador para tooling de build. No se demostró una ruta pública explotable ni una invocación de ese CLI vulnerable. Esto contextualiza el alcance, **no elimina el aviso del lockfile** ni autoriza presentarlo como cero. Ser dependencia clasificada de producción no demuestra por sí sola que el CLI esté expuesto en el Worker final; verificar bundling/rutas antes de afirmarlo.

Propuesta mínima para el responsable de la integración, **no aplicada aquí**: evaluar un override dirigido y fijado, que actualice únicamente esa copia transitiva de glob manteniendo la API mayor 10:

```json
{
  "overrides": {
    "@node-minify/core": { "glob": "10.5.0" }
  }
}
```

Después actualizar lock de forma deliberada, revisar diff, ejecutar auditoría completa/producción, builds Next/OpenNext y pruebas de comportamiento. El paquete padre fija glob 10.3.3: el override requiere validación, no se presume compatible por compilar. `npm audit` sugiere cambiar el adaptador a 1.20.9; no ejecutar `audit fix --force` ni degradarlo automáticamente, porque podría alterar compatibilidad/parches independientes. Alternativa preferible si aparece: release upstream que resuelva la cadena y siga soportando las versiones instaladas. Ninguna corrección de dependencias se ejecutó desde esta revisión.

`docs/12*` todavía no existía al realizar este control estático. Cualquier guía o resultado posterior debe contrastarse con archivos/logs finales y atribuirse a su ejecución real. Permanecen sin acreditarse en este apéndice: aprobación de suite CF, autenticación de cuenta, preview remota, producción y DNS.

### Candidato de resolución aislado, sin integrar

Se copiaron `package.json`/lock nuevos a `output/readiness-20261029-174200/dependency-spike/` y se probó el override anterior con `npm install --package-lock-only --ignore-scripts --no-fund` exclusivamente sobre esa copia. **Exit 0; auditorías completa y `--omit=dev`: exit 0 y cero vulnerabilidades en el lock candidato.** No se creó `node_modules` en la copia ni se modificaron manifiesto/lock/node_modules raíz; sus hashes antes/después coinciden. Este resultado no actualiza la auditoría del lock raíz de cuatro HIGH.

`integration.patch` contiene el candidato; `git apply --check` desde raíz dio exit 0 sin aplicar cambios. El diff modifica nueve entradas del lock: glob 10.3.3→10.5.0, jackspeak y package-json-from-dist vinculados al glob nuevo, más seis entradas opcionales Tailwind/WASM normalizadas por npm. Ver `lock-changes.json`, `audit*.json`, logs y README de esa carpeta. No se redujeron dependencias a ciegas para esconder el diff.

La resolución/auditoría es una validación parcial. Falta acordar la integración con el hilo que ejecuta CF, materializar el candidato y repetir builds/QA Next/OpenNext sin concurrencia. Hasta entonces no declarar la instalación raíz libre del advisory ni funcionalmente validada con el override.

### Integración posterior y prueba de build en copia, 18:34

El responsable de la entrega informó coordinación para pausar instalaciones/builds del otro hilo, aplicó el candidato en raíz y ejecutó `npm install --ignore-scripts` con exit 0. Esta revisión comprobó el override presente y la copia instalada de **glob 10.5.0**. Los resultados posteriores de auditoría/QA raíz corresponden al informe principal y deben registrarse allí; los ceros del candidato anterior no se convierten retroactivamente en resultados de la raíz. npm emitió una advertencia de deprecación de glob 10.5.0: el parche resuelve este advisory en la rama 10, pero queda deuda de mantenimiento/upstream para una cadena soportada. La advertencia no equivale por sí sola a otro CVE demostrado.

Se creó `output/readiness-20261029-174200/opennext-validation-copy/` con **168 archivos** seleccionados de fuentes públicas, scripts y configuración, sin originales privados/inspo ni `.env` reales. Se enlazó `node_modules` mediante junction a la instalación corregida. Solo en la copia se ajustaron `turbopack.root` y `outputFileTracingRoot` a la raíz real para admitir ese enlace; `.next`, `.open-next`, logs y `next-env.d.ts` se generaron en la copia. No se ejecutó build sobre los artefactos raíz que sirven las previews ajenas.

Comando ejecutado: `npm run cf:build`, cwd de la copia, `SITE_INDEXING=false`, `SITE_ENV=review`, `RECREAR_QA` ausente. Resultado **exit 1**. `verify:media` verificó 42 variantes; Next compiló (33,1 s), completó TypeScript y prerenderizó las rutas. El adaptador falló al generar los assets de caché: `ENOENT` para `.next/standalone/.next/server/pages-manifest.json`.

El diagnóstico estático encontró ese manifest en `.next/standalone/output/readiness-20261029-174200/opennext-validation-copy/.next/server/pages-manifest.json`. `required-server-files.json` confirma ese `relativeAppDir`: la raíz de tracing elevada para el junction produce un standalone anidado, mientras el adaptador de esta ejecución buscó la ruta plana. Es una limitación de este montaje de prueba; no demuestra regresión de glob ni éxito del build OpenNext. Tampoco se alcanzó una validación completa del minificador parcheado.

Evidencia: `cf-build-validation.log`, `cf-build-exit.json`, `cf-build-diagnosis.json` y manifiesto de copia en esa carpeta. No se repitió un build raíz ni se creó preview/deploy remoto para sortear el fallo. Próximo paso de Cloudflare: ejecutar build completo en checkout/copia Linux autónoma con dependencias propias o resolver explícitamente el layout monorepo del adaptador; después suite contra workerd sobre el artefacto corregido. El build Next parcial aprobado aquí no sustituye esos controles.

### Único reintento del montaje, 18:36

Se autorizó un reintento exclusivamente en la copia: conservar `turbopack.root` real para el junction y cambiar `outputFileTracingRoot` a `process.cwd()` de la copia, intentando producir standalone plano. **Exit 1.** Next 16.4.2 advierte que ambas raíces deben coincidir y da precedencia a `outputFileTracingRoot`; el filesystem de compilación queda entonces limitado a la copia y no puede resolver `next/package.json` detrás del junction, fuera de esa raíz. Se verificaron 42 medios antes del fallo, pero esta segunda ejecución no completó compilación ni llegó al adaptador/minificador.

Logs/exits: `cf-build-validation-2.log` y `cf-build-exit-2.json`. El primer intento conserva su éxito de compilación/TypeScript y su fallo posterior, sin mezclarlos con este reintento. No hubo tercer intento, build raíz, preview ni deploy desde esta tarea. La comprobación OpenNext con dependencias corregidas queda pendiente de una checkout autónoma con dependencias propias; ni el resultado del primer intento ni la existencia de artefactos anteriores acredita ese cierre.
