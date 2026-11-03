# Post-lanzamiento — Travel Days

Documento técnico interno. Fecha: 03/11/2026. Complementa `README.md` y los informes numerados de `docs/`.

## 1. Arquitectura

- **Framework:** Next.js 16.4.2 (App Router), React 19.3.1, TypeScript estricto, Tailwind 4 + CSS Modules. Animación con Motion y GSAP ya existentes.
- **Runtime:** Cloudflare Workers mediante `@opennextjs/cloudflare` 1.20.14. Todas las páginas se prerenderizan; el caché incremental se lee de Workers Static Assets (`open-next.config.ts`), sin R2/KV/D1.
- **Imágenes:** `next/image` vía binding `IMAGES` (Cloudflare Images, cupo gratuito de 5.000 transformaciones únicas/mes).
- **Sin backend propio:** no hay base de datos, cuentas, almacenamiento de formularios ni APIs. Las consultas generan un enlace `wa.me` que el visitante envía.
- **Eventos de medición:** `traveldays:measurement` se emite localmente en `window`; no hay proveedor conectado ni cookies.

| Área | Ubicación |
|---|---|
| Rutas y layout (JSON-LD `TravelAgency`) | `src/app/` |
| Origen, rutas públicas e interruptor de indexación | `src/config/seo.ts` |
| CSP | `src/config/security.ts` + `next.config.ts` |
| Contactos y redes | `src/config/site.ts` |
| Manifiesto de medios y autorizaciones | `src/config/media.ts` |
| Destinos (8) | `src/features/destinations/data.ts` |
| Escolares (Primaria, Secundaria, Maestros) | `src/features/graduates/` |
| Testimonios | `src/features/testimonials/` |
| Contacto / borradores WhatsApp | `src/features/contact/` |

## 2. Comandos útiles

```powershell
npm ci
npm run dev                     # http://127.0.0.1:3210
npm run lint
npm run typecheck
npm run verify:media            # manifiesto, hashes y archivos públicos
npm test                        # build QA aislado (.next-qa) + Playwright/Axe en Chromium, Firefox y WebKit
$env:REMOTE_URL = "https://..."; npm run test:remote -- tests/deployment-smoke.spec.ts   # pruebas contra una URL publicada
npm run cf:deploy               # build de revisión (noindex) → Worker travel-days-preview (workers.dev)
npm run cf:deploy:production    # build indexable → Worker travel-days con dominios propios
```

`npm test` y `cf:*` no deben correr en paralelo con otro build sobre el mismo directorio.

## 3. Despliegue en Cloudflare

Cuenta: la asociada a `wrangler whoami` (cuenta de REAC Studio). Subdominio workers.dev: `travel-days-recrear`.

| Worker | Entorno Wrangler | Build | Acceso |
|---|---|---|---|
| `travel-days-preview` | por defecto | revisión: `noindex`, `X-Robots-Tag`, robots `Disallow: /` | `https://travel-days-preview.travel-days-recrear.workers.dev` |
| `travel-days` | `production` | `SITE_INDEXING=true`, `SITE_ENV=production` (lo fija `scripts/cf-deploy-production.mjs`) | `traveldays.tur.ar` y `www` como Custom Domains; `workers_dev: false` |

La redirección `www → apex` (301, conserva ruta y query) está en `next.config.ts`. HTTP→HTTPS lo resuelve Cloudflare en Custom Domains (activar además "Always Use HTTPS" en la zona).

Rollback: `npx wrangler deployments list --name <worker>` y `npx wrangler rollback <version-id> --name <worker>`.

## 4. Variables de entorno (solo nombres)

| Nombre | Uso |
|---|---|
| `SITE_INDEXING` | `true` solo en el build de producción. Se evalúa en build. |
| `SITE_ENV` | `production` solo en el build de producción. |
| `VERCEL_ENV` / `VERCEL` | Solo si alguna vez se usa Vercel; tienen precedencia. |
| `RECREAR_QA`, `RECREAR_TEST_PORT` | Build y puerto de QA locales. |

No hay secretos de aplicación. Las credenciales de Cloudflare viven en la sesión OAuth de Wrangler del equipo de desarrollo, fuera del repositorio.

## 5. Estado del dominio (verificado 03/11/2026)

| Elemento | Estado |
|---|---|
| Zona `traveldays.tur.ar` en Cloudflare | Creada el 02/11, **pending**, plan Free. NS asignados: `bristol.ns.cloudflare.com`, `dakota.ns.cloudflare.com`. |
| Delegación pública (`tur.ar` → dominio) | Sigue en Hostinger: `orbit.dns-parking.com`, `horizon.dns-parking.com`. |
| Qué sirve hoy `traveldays.tur.ar` | La web anterior en Hostinger (`server: hcdn`). HTTP→HTTPS 301; `www` responde 200 sin redirigir. |
| Worker de producción `travel-days` | Existe con un build de **revisión** del 02/11 (noindex) en `travel-days.travel-days-recrear.workers.dev`. Sin Custom Domains. Se sobrescribe con `npm run cf:deploy:production`. |
| Preview `travel-days-preview` | Había sido eliminado de la cuenta (error 1042). Recreado hoy con el código actual. |

**Correo a preservar** (DNS público actual; MXroute):

| Tipo | Nombre | Valor |
|---|---|---|
| MX 10 | `traveldays.tur.ar` | `everest.mxrouting.net` |
| MX 20 | `traveldays.tur.ar` | `everest-relay.mxrouting.net` |
| TXT | `traveldays.tur.ar` | `v=spf1 include:mxlogin.com -all` |
| TXT | `_dmarc` | `v=DMARC1; p=none` |

No se encontró DKIM con el selector `x`; revisar en el panel de MXroute si hay otro selector. El token OAuth de Wrangler **no tiene permiso de lectura DNS**, así que no se pudo confirmar desde aquí que la zona pendiente haya importado estos registros.

### Pasos para activar producción (bloqueo externo)

1. En el panel de Cloudflare → `traveldays.tur.ar` → DNS: confirmar que existen los MX, SPF, DMARC (y DKIM si lo hay) de la tabla. Agregar los faltantes. Borrar o dejar sin proxy los A/CNAME de apex y `www` que apuntan a Hostinger (los Custom Domains los reemplazan).
2. En NIC Argentina (titular del dominio): cambiar los servidores DNS a `bristol.ns.cloudflare.com` y `dakota.ns.cloudflare.com`.
3. Esperar a que Cloudflare marque la zona como **Active** (minutos a 48 h).
4. `npm run cf:deploy:production` (build indexable + Custom Domains apex y `www`).
5. En la zona: SSL/TLS "Full (strict)" y "Always Use HTTPS".
6. Verificar: las 5 rutas 200, `www` → 301 a apex, `robots.txt` con `Allow` y sitemap, sin `X-Robots-Tag`, canonical, JSON-LD, video con 206, enviar un correo de prueba a `info@traveldays.tur.ar`.
7. Search Console: verificar la propiedad y enviar `https://traveldays.tur.ar/sitemap.xml`.
8. Opcional: deshabilitar workers.dev del preview cuando ya no se use para revisión.

## 6. Pruebas realizadas (03/11/2026)

| Verificación | Resultado |
|---|---|
| `npm run lint` | Sin errores ni advertencias. |
| `npm run typecheck` | Sin errores. |
| `npm run verify:media` (prebuild) | Correcto. |
| `npm run cf:build` | Correcto; 10 rutas estáticas (`/`, `/destinos`, `/nosotros`, `/contacto`, `/terminos`, 404, `robots.txt`, `sitemap.xml`, icono, imagen OG). |
| `npm test` completo (build QA + Playwright/Axe en Chromium, Firefox y WebKit, 570 casos) | 561 OK, 8 omitidos por diseño, 1 fallo: la precarga RSC cancelada en WebKit (sección 7). Tras el ajuste, `seo`, `school-travel` y `testimonials` se repitieron con build nuevo: 75/75. |
| Rangos en workerd local (`opennextjs-cloudflare preview`) | `206` exacto para `0-1`, `0-63`, sufijo `-100`, final de archivo; tope de 4 MB en `0-`; `416` para rangos inválidos; `200` sin rango; bytes idénticos al original; HEAD 200; inexistente 404. |
| Playwright contra la URL publicada (`npm run test:remote`): `deployment-smoke`, `navigation-regressions`, `school-travel`, `contact`, `testimonials`, `accessibility`, `hero` en Chromium escritorio y WebKit móvil 390×844 | 111 OK + 3 fallos en la primera pasada (2 por HEAD lento del cliente de pruebas y 1 por la precarga en WebKit). Tras corregir la prueba y el fixture, `deployment-smoke` + `school-travel` repetidos: 32/32. |
| HTTP en la preview publicada | 5 rutas 200; `/quienes-somos` y rutas inexistentes 404; `robots.txt` `Disallow: /`; `X-Robots-Tag: noindex, nofollow`; CSP, `X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy` presentes; `/_next/image` 200 WebP; los 68 archivos de `/media` 200; los 12 MP4 responden 206. |
| Seguridad | Sin secretos ni `.env` versionados; sin formularios que envíen datos; `npm audit`: 5 moderadas solo en dependencias de build (P2). |

No probado: iPhone/Android físicos, envío real por WhatsApp, recepción de correo, indexación real y Search Console.

## 7. Errores corregidos en esta entrega

| Problema | Impacto | Corrección |
|---|---|---|
| Workers Static Assets responde `200` con el archivo completo a peticiones `Range`, y no envía `Content-Length`. | Safari en iPhone/iPad exige rangos para reproducir video: testimonios, montajes escolares y El Maestrazo podían no reproducirse en iOS. Además, cada búsqueda en un video descargaba el archivo entero. | `cloudflare/worker.mjs` envuelve el Worker de OpenNext; `run_worker_first: ["/media/*"]` envía solo los medios a ese código, que responde `206` con `Content-Range`, `416` para rangos inválidos y como máximo 4 MB por respuesta. El resto de las rutas no cambia. |
| URL de preview caída (Worker `travel-days-preview` eliminado de la cuenta). | Sin entorno de revisión público. | Redesplegado con el código actual. |
| JSON-LD `TravelAgency` sin `image`. | Propiedad recomendada para negocios locales. | Se agregó la imagen social ya aprobada. Test actualizado. |
| `scenic-hero-classic` sin ningún import. | Código muerto. | Eliminado. |
| `deployment-smoke` hacía HEAD secuencial de todos los medios; sin `Content-Length`, el cliente de Playwright espera ~5 s por HEAD (también con el build anterior) y la prueba excedía 150 s. | Falso fallo; el sitio respondía en ~0,1 s. | GET para imágenes y GET con rango para MP4 (además verifica el 206). |
| Fixture de Playwright tomaba como error de la página la cancelación de una precarga RSC en WebKit al recargar o volver atrás (también ocurría con el build anterior). | Falso fallo en WebKit; la navegación funcionaba. | Se ignora solo ese mensaje para URLs `?_rsc=`. |

## 8. Pendientes priorizados

**P0 (bloquean producción, externos):**

- Delegar NS en NIC Argentina y comprobar antes los registros de correo en la zona (sección 5).
- Ejecutar `npm run cf:deploy:production` y la verificación pública una vez activa la zona.

**P1:**

- Probar en un iPhone físico: reproducción de testimonios y videos escolares, menú y formulario. El WebKit de Playwright en Windows no reemplaza Safari real.
- Abrir manualmente WhatsApp desde un teléfono y confirmar que llega el mensaje (las pruebas bloquean salidas externas a propósito).
- Archivar autorizaciones firmadas de imagen y voz para testimonios y videos escolares con menores (hoy consta la declaración del usuario del 02/11).
- Actualizar la cita de la Ley 18.829 en términos (derogada por DNU 70/2023, art. 349) con asesoría.
- Activar HSTS desde Cloudflare tras verificar HTTPS en apex y `www`, sin `includeSubDomains` ni preload al inicio.
- Subtítulos verificados para los dos testimonios.
- Search Console y actualización del enlace en la ficha de Google.

**P2:**

- 5 vulnerabilidades moderadas en `glob`/`minimatch`, dependencias de build de `@opennextjs/cloudflare`. No se ejecutan en el Worker; `npm audit fix --force` propone un downgrade incompatible. Revisar en la próxima actualización de OpenNext.
- Wrangler 4.157 disponible (instalado 4.156).
- Analítica con consentimiento usando `traveldays:measurement`.
- CI (lint, typecheck, tests) en GitHub Actions.
- Los medios bajo `/media/*` no reciben `X-Robots-Tag` en la preview (los bloquea `robots.txt`).
- Lista de fuentes de `tests/current-visual-reference.json` conserva el hash histórico del hero clásico eliminado (es procedencia, no se verifica).

## 9. Riesgos conocidos

- **Correo:** si al delegar NS faltan los MX/SPF en Cloudflare, el correo `@traveldays.tur.ar` deja de recibir. Mitigación: paso 1 de la sección 5 y un correo de prueba inmediatamente después.
- **Plan Free de Workers:** 10 ms de CPU por petición. El manejo de rangos copia como máximo 4 MB por respuesta; la primera petición con rango de cada video lee el archivo completo una vez por isolate para conocer su tamaño. Revisar en *Observability* errores de CPU tras el lanzamiento; si aparecen, generar un mapa de tamaños en build o pasar a Workers Paid (USD 5/mes).
- **Cloudflare Images:** 5.000 transformaciones únicas/mes gratis. El sitio usa pocas variantes, pero conviene revisar el uso el primer mes.
- **OpenNext en Windows:** advierte compatibilidad parcial. El build actual funcionó; si un build falla de forma extraña, construir en WSL o CI.
- **Afirmaciones comerciales** ("la única agencia", "pioneros", convenio con China, legajo): aprobadas por Javier el 02/11 según el usuario, sin respaldo documental revisado por desarrollo.
- **Consentimiento de menores:** declarado, no documentado en el repositorio.

## 10. Propuesta: aplicación de pasajeros y cuotas

Objetivo: que la agencia gestione grupos, pasajeros, reservas, planes de cuotas y pagos sin planillas sueltas. **No implementado.** Se presupuesta y diseña aparte.

**Principios:** mismo repositorio y mismo proveedor (Cloudflare) para no sumar costos fijos; la web pública sigue estática y separada del área privada; datos personales de menores con el mínimo necesario.

**Arquitectura sugerida:**

- Rutas privadas bajo `src/app/(admin)/` y `src/app/(portal)/` con `robots: noindex`, fuera de `publicPaths` y del sitemap.
- Dominio de negocio en `src/features/passengers/`, `src/features/bookings/`, `src/features/installments/`, siguiendo la convención actual de `src/features/*`.
- Datos: Cloudflare D1 (SQLite) para grupos, pasajeros, reservas, cuotas y movimientos; R2 solo si hay comprobantes adjuntos. Migraciones versionadas en el repo.
- Autenticación: Cloudflare Access para el personal de la agencia (sin desarrollar login propio en la primera fase); enlaces firmados o login por correo para familias en una segunda fase.
- Pagos: integrar un proveedor local (por ejemplo, Mercado Pago) con webhooks verificados; la web nunca almacena datos de tarjetas.
- Al agregar rutas dinámicas: revisar `open-next.config.ts` (hoy asume todo prerenderizado) y ampliar la CSP (`connect-src`, `form-action`, `frame-src`) solo con los orígenes del proveedor de pagos.

**Puntos de extensión ya existentes:**

- `traveldays:measurement`: contrato de eventos listo para conectar analítica con consentimiento.
- `src/features/contact/messages.ts`: armado del mensaje de consulta; puede derivar a un endpoint propio en lugar de WhatsApp.
- `src/config/site.ts` y `src/features/destinations/data.ts`: datos tipados que un panel podría reemplazar por D1.

**Fases sugeridas:** 1) panel interno de grupos y pasajeros; 2) planes de cuotas y registro manual de pagos; 3) portal de familias con estado de cuenta; 4) cobro online.
