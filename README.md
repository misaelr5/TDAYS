# Travel Days

**Estado vigente (03/11/2026):** ver [docs/entrega/](docs/entrega/): [post-lanzamiento técnico](docs/entrega/POST_LANZAMIENTO.md), [documentación para el cliente](docs/entrega/DOCUMENTACION_CLIENTE.md) y [virtudes](docs/entrega/VIRTUDES_TRAVEL_DAYS.md). La preview está publicada en Cloudflare Workers; la activación en `traveldays.tur.ar` espera la delegación DNS en NIC Argentina. Los párrafos siguientes son antecedentes.

Revisión vigente del 01/11: [video anterior restaurado y nuevo módulo de Egresados](docs/14-REVISION-EGRESADOS-Y-VIDEO-2026-11-01.md). El [informe previo](docs/13-AUDITORIA-DISENO-2026-11-01.md) se conserva como antecedente. Trabajo local, sin publicación.

Revisión actual del 29/10: [entrega, validación y pendientes](docs/11-ENTREGA-2026-10-29.md), con [evaluación Cloudflare](docs/08-CLOUDFLARE-EVALUATION-2026-10-29.md). Los informes del 28/10 se conservan como antecedentes.

Web de consulta de la agencia de Villa Dolores, Córdoba. RECREAR es la base definitiva; el material y las referencias históricas se conservan. El origen de producción confirmado es **https://traveldays.tur.ar**, sin `www`. Este trabajo es local: no acredita despliegue ni configuración del dominio.

## Desarrollo y arquitectura

Node 24 (`.nvmrc`) y npm con lockfile. Next 16.4.2 App Router, React 19.3.1, TypeScript estricto y Tailwind 4. La interacción reutiliza Motion, GSAP, controles nativos y CSS Modules. No se añadieron dependencias en la estabilización.

```powershell
npm ci
npm run dev
```

El servidor de desarrollo utiliza `http://127.0.0.1:3210`. No ejecutar builds sobre `.next` mientras un servidor sirve ese directorio. QA usa `.next-qa`, `tsconfig.qa.json`, un puerto separado y un lock; build y generación de tipos deben ejecutarse secuencialmente.

| Área | Ubicación |
|---|---|
| Páginas, layout y metadata de archivos | `src/app/` |
| Origen, rutas públicas e interruptor SEO | `src/config/seo.ts` |
| Metadata por página | `src/config/metadata.ts` |
| Contactos y redes publicados | `src/config/site.ts` |
| Permisos, procedencia y créditos de medios | `src/config/media.ts` |
| Catálogo tipado de ocho destinos | `src/features/destinations/` |
| Capítulos y equipo de Nosotros | `src/features/agency/` |
| Viajes escolares y guía para grupos | `src/features/graduates/` |
| Borradores y validación de contacto | `src/features/contact/` |
| Decodificación segura de fragmentos | `src/lib/fragment.ts` |
| Build aislado y pruebas | `scripts/qa.mjs`, `tests/` |

El contenido y el catálogo se renderizan en servidor. Componentes cliente añaden navegación, paneles, carrusel y animación. La URL determina el capítulo de Nosotros, incluidos enlaces a encabezados internos; los enlaces conservan alternativas sin JavaScript. Inter se carga localmente, sin peticiones a Google Fonts.

## Páginas y consultas

- `/`: hero con el video autorizado original y su póster responsive, consulta con borrador, propuestas visibles de Egresados de primaria y secundaria, ocho destinos, otras formas de viajar y turismo receptivo desde China.
- `/destinos`: catálogo para consulta y módulo escolar ampliado con Primaria, Secundaria y Maestros/El Maestrazo.
- `/nosotros`: oficina, historia, respaldo declarado, equipo, acompañamiento y mapa de Google que solo carga tras solicitarlo.
- `/contacto`: Mi viaje (formulario), La agencia (ubicación y horarios) y Mi experiencia (enlace a la ficha de Google para reseñas).
- `/terminos`: condiciones existentes, pendientes de revisión comercial/legal. No fueron reescritas en esta etapa.
- `/quienes-somos` está retirada y devuelve **404**: no es alias ni redirección y no figura en el sitemap.

El formulario prepara un mensaje revisable y abre WhatsApp cuando el visitante lo decide. Editar los datos invalida el borrador. No hay persistencia de formularios, backend, cuentas, reservas, pagos o administración. Preparar un borrador o abrir WhatsApp no confirma envío, reserva ni compra. La reseña se escribe y publica en Google, no en la web. Su apertura definitiva debe comprobarse manualmente; no se envían mensajes ni reseñas desde las pruebas.

## Medios

El estado conservado del manifiesto registra 42 variantes aprobadas: fotografías licenciadas de los ocho destinos con créditos visibles, oficina, siete retratos, fotos escolares, la foto de Maestros y videos/posters del hero y la historia. Ese número incluye variantes y recursos compartidos; no significa 42 fotos diferentes. La incorporación concurrente de la foto P130 y el video V067 tiene autorizaciones específicas del 28/10/2026 registradas en el manifiesto; no la realizó la estabilización.

Los originales privados están excluidos de Git y del bundle. Las fotos escolares P168–P170 tienen autorización registrada. La autorización de P130 no se extiende al resto de fotos de la fiesta. Dos perfiles del equipo conservan fallbacks mientras no haya retratos aprobados. Historia utiliza el recurso de V067; con movimiento reducido muestra solo su poster. Ver [medios](docs/Medios.md), [destinos y licencias](docs/Media-Destinos.md) y [viajes escolares](docs/School-Travel-Redesign.md); los documentos históricos pueden describir permisos anteriores al manifiesto actual.

`src/app/opengraph-image.jpg` es una composición estática de 1200×630 hecha con la fotografía de oficina ya aprobada (`page:nosotros`) y texto existente. Next la sirve como metadata de archivo. Puede reproducirse con `node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/generate-social-image.mjs`; usa el procesador de imágenes instalado por Next, sin añadir dependencias. Revisar visualmente cualquier regeneración.

## SEO preparado, apagado por defecto

`src/config/seo.ts` centraliza `https://traveldays.tur.ar` y las cinco rutas públicas. Todas tienen canonical y metadata social con URLs absolutas. El sitemap incluye únicamente esas rutas y omite fechas de modificación no documentadas. JSON-LD describe una `TravelAgency` con nombre, URL, teléfono, email, dirección estructurada, horarios y redes ya publicados; no agrega calificaciones, ofertas o certificaciones.

La indexación exige `SITE_INDEXING=true` y entorno de build `production`. `VERCEL_ENV` tiene precedencia sobre `SITE_ENV`; una preview sigue bloqueada aunque se configure el flag. Fuera de Vercel, usar `SITE_ENV=production` únicamente para el lanzamiento aprobado. Ausente, `false` o cualquier otro valor mantiene revisión:

| Configuración del build | HTML | robots.txt | Headers |
|---|---|---|---|
| Ausente / distinta de `true` | `noindex, nofollow` | `Disallow: /`, sin referencia al sitemap | `X-Robots-Tag: noindex, nofollow` en todas las rutas |
| `SITE_INDEXING=true` en entorno production | `index, follow` en páginas públicas | `Allow: /` y sitemap absoluto | Sin bloqueo global de indexación |
| Flag true en preview/development/review | `noindex, nofollow` | `Disallow: /` | Bloqueo global |

El sitemap existe en ambos modos. En revisión queda cubierto por el header y no se anuncia en robots. Las 404 siguen sin canonical y con `noindex` aunque el resto del sitio esté habilitado.

La metadata y estas rutas se prerenderizan: **cambiar una variable sin reconstruir no actualiza los archivos generados**. Usar el mismo valor durante build y ejecución. Nunca habilitarlo en previews. `.env.example` documenta el valor seguro; no se creó un `.env` que active indexación.

Bloquear rastreo impide que Google lea el `noindex` HTML. Esta combinación preserva el modo de revisión pedido y añade el header, pero **no es un control de privacidad**. Las previews privadas requieren protección de acceso en el hosting. [Guía de Google](https://developers.google.com/search/docs/crawling-indexing/block-indexing).

### Activación futura en producción

1. Cerrar la revisión legal y comercial y resolver las validaciones pendientes de [Estabilización y SEO](docs/Estabilizacion-SEO.md).
2. Verificar en el hosting que el proyecto apunta a esta web y que `traveldays.tur.ar` tiene DNS correcto y certificado HTTPS válido.
3. Configurar redirección permanente de HTTP a HTTPS y de `www.traveldays.tur.ar` al origen sin `www`, conservando ruta y query. El control del 28/10 confirmó HTTPS pero www sigue respondiendo 200; el dominio sirve una versión anterior. Ver [checklist actual](docs/05-DEPLOYMENT-CHECKLIST.md).
4. Mantener `SITE_INDEXING=false` o ausente en previews. Establecer `SITE_INDEXING=true` **solo** en Production aprobada; fuera de Vercel, agregar `SITE_ENV=production`.
5. Hacer un build y despliegue nuevo con ese valor, sin reutilizar un build de revisión. Este repositorio no se publicó en esta etapa.
6. En el dominio real revisar las cinco páginas, canonical, OG/Twitter e imagen social, JSON-LD, `/sitemap.xml`, `/robots.txt`, 404 y headers efectivos. Confirmar que el hosting no añade otro `noindex` y conserva los headers de seguridad.
7. Verificar la propiedad en Search Console y enviar el sitemap después de autorizar el lanzamiento. No se accedió a Search Console en este trabajo.

## Validación local

```powershell
npm run lint
npm run typecheck
npm run verify:media
npm test
```

`npm test` construye producción aislada, valida medios y hashes y ejecuta Playwright/Axe. El puerto predeterminado es 3211; puede cambiarse con `RECREAR_TEST_PORT` a otro libre distinto de 3210. No borrar un `qa.lock` sin identificar su proceso propietario.

```powershell
# Prueba local del modo indexable; no configura ningún hosting.
$env:SITE_INDEXING = 'true'
$env:SITE_ENV = 'production'
$env:RECREAR_TEST_PORT = '3212'
npm test -- tests/seo.spec.ts
Remove-Item Env:SITE_INDEXING
Remove-Item Env:SITE_ENV
# Reconstruye revisión y ejecuta la suite completa antes de cerrar.
npm test
```

Las 29 capturas originales y sus hashes permanecen como historia. Las 36 referencias en `tests/__screenshots__/chromium/current/` cubren cinco páginas en siete anchos y el menú. Su procedencia y los ajustes concurrentes preservados se registran en `tests/current-visual-reference.json`. Se fija transparencia reducida para esa comparación y se prueba el catálogo en ambos modos de transparencia con Axe. La suite compara el DOM real y guarda diferencias históricas informativas; no sustituye el hero, no elimina la narrativa ni compara rotaciones retiradas. Ver [estrategia visual](docs/Referencias-Visuales.md).

El estado de Release 1.0 se detalla en [preparación de producción](docs/01-PRODUCTION-READINESS.md), con [QA actual](docs/04-QA-RESULTS.md), [seguridad](docs/03-SECURITY-AUDIT.md), [SEO/GEO](docs/02-SEO-GEO-AUDIT.md), [decisiones del cliente](docs/07-CLIENT-PENDING-DECISIONS.md) y [arquitectura futura](docs/06-FUTURE-PLATFORM-ARCHITECTURE.md). [Estabilizacion-SEO](docs/Estabilizacion-SEO.md) conserva resultados históricos.

La consulta permite mes/año, pasajeros y localidad opcionales sin guardar datos. `traveldays:measurement` emite eventos locales con nombres/rutas/slugs permitidos; no hay proveedor, cookies ni transmisión externa de analítica. La CSP de producción conserva prerender y animaciones; los scripts inline necesarios siguen permitidos. CI y monitorización externa siguen pendientes.

Playwright incluye Chromium, Firefox y WebKit; instalar sus motores con `npx playwright install chromium firefox webkit` si faltan. Las referencias de píxeles se comparan solo en Chromium. WebKit automatizado no acredita Safari/iPhone físico, indexación real ni rendimiento de usuarios.

El historial de migración y las diferencias con el video original siguen disponibles en `docs/Migracion-Etapa-1.md`, `docs/Migracion-Etapas-2-5.md` y `docs/Bitacora.md`.
