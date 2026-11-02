# SEO, GEO y entidad local

28/10/2026. El sitio se mantiene en revisión y no se habilitó indexación pública.

## Preparación implementada/conservada

- Canonical absoluto en las cinco rutas públicas `/`, `/destinos`, `/nosotros`, `/contacto`, `/terminos`; origen `https://traveldays.tur.ar` centralizado. Title/descripción/OG/Twitter propios, `es-AR`, imagen social local 1200×630 autorizada y metadataBase existentes conservados.
- Sitemap con esas cinco URLs, sin fechas inventadas, rutas privadas o `/quienes-somos` retirada (404). Se evalúan sus respuestas reales en QA.
- Contenido principal renderizado en HTML; navegación descriptiva y alternativas sin JS existentes. Sin páginas masivas, keyword stuffing, reseñas ficticias ni `llms.txt`.
- JSON-LD pasa de Organization a su subtipo TravelAgency; mantiene ID estable y utiliza nombre, teléfono, correo, dirección estructurada, horarios y redes de `site.ts`. No se agregan coordenadas, código postal desconocido, ratings, Review, Offer, precios, certificados ni antigüedad de 23 años como antigüedad de la agencia.
- TravelAgency hereda LocalBusiness y Organization: no se duplican tres entidades para la misma agencia. WebSite/WebPage/BreadcrumbList/FAQPage se evaluaron; no se agregan grafos o breadcrumbs invisibles sin utilidad actual. Las preguntas escolares visibles siguen en HTML sin prometer resultados FAQ enriquecidos.

## Interruptor de lanzamiento

`SITE_INDEXING=true` **y** entorno de build `production` son necesarios. Si existe `VERCEL_ENV`, manda sobre `SITE_ENV`; `VERCEL=1` sin entorno reconocido falla cerrado.

| Build | HTML/headers | robots |
|---|---|---|
| Local/revisión, o flag distinto de `true` | noindex, nofollow y X-Robots-Tag global | Disallow /, sin anuncio de sitemap |
| Vercel preview/development incluso con flag y SITE_ENV=production | noindex, nofollow | Disallow / |
| Vercel production + flag aprobado | index, follow en páginas públicas | Allow / + sitemap |
| Otro hosting con SITE_ENV=production + flag aprobado | index, follow | Allow / + sitemap |

El sitemap existe en revisión pero queda bajo noindex global; esto no protege su contenido. `Disallow` evita que un bot lea el noindex HTML: no sirve para retirar por sí solo URLs ya indexadas. Previews privadas requieren acceso protegido en hosting. Las 404 mantienen noindex sin canonical. Reconstruir después de cambiar variables.

## Coherencia comercial y GEO

Confirmación explícita del usuario en esta sesión: **Felipe Erdman 222**, línea activa **+54 9 3544 312904**, Facebook **https://www.facebook.com/traveldayseducativos**. Ya coincidían con el repo. El documento del usuario coincide también en correos, Instagram y horarios. No se construyó URL de TikTok a partir de un alias.

La web pública aún muestra Luis Laje 681; no se traslada esa dirección antigua al nuevo sitio. El nombre informal de Facebook del documento no era una URL: se conserva la URL ahora confirmada. El enlace `share.google` existente es de reseñas; no se convierte en una ficha de empresa verificada ni se usa para agregar valoraciones.

La fundación en 2018 y trayectoria personal de Javier de más de 23 años son datos aportados por el usuario. Persisten afirmaciones de exclusividad y acreditaciones pendientes: ver documento 07. No se generó copy comercial nuevo para sostenerlas.

GEO se trabaja como contenido claro, entidad coherente, ubicación/contacto, navegación y HTML accesible. No se promete posición ni citación por un motor. Faltan Search Console y verificación manual de ficha de Google. No hay datos de tráfico o visibilidad IA que permitan afirmar mejoras de ranking.

## Fuentes y límites

- [Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features): mantiene fundamentos SEO; no exige archivos ni schema especial para IA.
- [Google: noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing).
- [Schema.org TravelAgency](https://schema.org/TravelAgency).
- Guías locales de Next 16.4.2: metadata/OG, JSON-LD, robots/sitemap; JSON serializado con escape de `<` ya existente.

Se envió el fragmento JSON-LD renderizado al [Schema Markup Validator](https://validator.schema.org/), usando la pestaña de código: **1 TravelAgency, 0 errores y 0 advertencias**. Evidencia `output/production-readiness/schema-validator.txt` y `.png`. No se publicó ni se habilitó indexación para hacer esta validación. El servicio comprueba vocabulario/estructura, no la veracidad comercial ni elegibilidad de resultados en Google. Rich Results Test sobre la URL final y Search Console siguen pendientes. Los tests locales contrastan además los datos publicados y los resultados HTTP/navegador se registran en 04.
