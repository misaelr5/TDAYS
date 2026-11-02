# Checklist de despliegue autorizado

28/10/2026. No se ejecutó publicación, configuración DNS ni activación de indexación.

## Infraestructura observada

`traveldays.tur.ar` resuelve a 77.37.42.200 / 89.116.213.199; `www` a 77.37.42.187 / 147.79.105.134 (snapshot DNS, puede cambiar). HTTP redirige con 301 al HTTPS del mismo hostname. Ambos HTTPS responden 200; `www` **no** redirige al origen sin www. Fetch valida cadena TLS; no se auditó renovación/cuenta del certificado.

Home pública: title Travel Days, dirección antigua Luis Laje 681. `/destinos`, `/contacto`, `/robots.txt` y `/sitemap.xml` públicos devuelven 404. Header server `hcdn`; por contenido/rutas se confirma que no sirve el artefacto Next validado aquí. Evidencia JSON: `domain.json` y `public-site.json` en output/production-readiness. No confundir el dominio operativo anterior con publicación de este release.

No hay `.vercel/project.json`, vercel.json o integración de proveedor de métricas en los archivos de aplicación revisados. No se accedió a panel Vercel/DNS ni se confirma qué cuenta/proyecto/plataforma comercial contratará el cliente. Los scripts del sitio funcionan con un hosting Node compatible, no con un servidor de archivos estáticos arbitrario (usa optimizador de imágenes de Next).

## Hosting: decisión comercial

[Vercel Hobby](https://vercel.com/docs/plans/hobby) limita uso a personal/no comercial: no usarlo como base contractual para Travel Days. [Vercel Pro](https://vercel.com/docs/plans/pro-plan) documenta tarifa de plataforma de USD 20/mes, un asiento de despliegue y USD 20 de crédito de uso, más excesos/add-ons según producto. Revisar cotización/impuestos/límites vigentes al contratar, transferencia de video, optimización de imágenes y alertas de gasto; no se presume costo total fijo.

Alternativa técnica: hosting comercial Node 24 compatible con Next 16, TLS, reverse proxy/CDN, ejecución `next build`/`next start`, cache de imágenes/estáticos, logs sin datos personales, supervisión del proceso y recuperación. Requiere comparar operación y presupuesto; no se eligió ni compró proveedor. En cualquiera, la agencia debe conservar acceso al dominio y la cuenta.

## Pasos exactos, después de la autorización

1. Cerrar decisiones de 07, revisión legal y QA de 04. No declarar release listo mientras existan P0 sin resolver.
2. Revisar `git status`, diff total y delta contra snapshot; excluir originales privados, output, ZIPs, env reales, grabaciones y recursos no aprobados. Staging explícito por archivo. Conservar todos los commits existentes; sin rebase/squash/force.
3. Confirmar identidad `git var GIT_AUTHOR_IDENT` y remoto. Crear commits lógicos solo al autorizar entrega/publicación. Revisar `git diff --cached --check`, enviar cada commit a main y verificar `git rev-parse HEAD` contra `git ls-remote origin refs/heads/main`. Si remoto divergió, inspeccionar y pedir aprobación de integración.
4. Seleccionar hosting comercial compatible, Node 24, npm/lockfile, proyecto/rama correctos, build `npm ci` y `npm run build`. QA local utiliza el script aislado, no mezclar su dist con producción.
5. Primera preview protegida: `SITE_INDEXING=false`. En Vercel verificar `VERCEL_ENV=preview`. Probar rutas, formularios, medios, CSP, OG y noindex en HTML/headers antes del dominio.
6. Tras aprobación explícita de lanzamiento, configurar el dominio en el proyecto y después DNS con los valores indicados por el proveedor. Preservar MX/TXT de correo y guardar rollback del DNS anterior. No hay valores DNS de Vercel inferidos en este documento.
7. Configurar HTTP→HTTPS y www→sin-www conservando ruta/query. Comprobar que HTTP/www llega al destino final sin cadenas evitables; no basarse solo en canonical. No redirigir los hostnames de preview al sitio público.
8. Configurar `SITE_INDEXING=true` solo en Production aprobada; Vercel usa su `VERCEL_ENV=production`. Otro hosting requiere además `SITE_ENV=production`. Mantener previews en false. Hacer build nuevo, no reciclar uno de revisión.
9. Verificar estado READY/equivalente, hash/artefacto desplegado y dominio real. Revisar cinco páginas (200), 404, imágenes, WhatsApp activo confirmado por usuario, formulario sin falsa recepción, menú y consola.
10. Comprobar canonical/OG/Twitter, JSON-LD, robots con Allow/sitemap, sitemap de cinco entradas, ausencia de X-Robots-Tag global/noindex en páginas públicas y noindex en 404. Validar esquema con herramientas oficiales. Confirmar headers efectivos del CDN y CSP en mapa/video/forms.
11. Configurar Search Console con propiedad de la agencia y enviar sitemap; actualizar dirección del Perfil de Empresa existente solo con URL oficial confirmada. Configurar un único proveedor de métricas y monitoreo tras decisión de privacidad/costo.
12. Registrar fecha, commit, deployment URL, resultado público y plan de rollback al deployment anterior. Volver a verificar estado Git; staging o push no prueban despliegue.

HSTS se decide con el responsable de infraestructura una vez verificados HTTPS, renovación y todos los subdominios afectados. No activar preload como paso automático.
