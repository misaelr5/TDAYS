Alcance: MVP público enfocado en presentar la agencia, mostrar destinos y viajes escolares y transformar interés en consultas a través de WhatsApp. No es un sistema de reservas ni de cobros.

Estado de dominio al 03/11/2026: la delegación de traveldays.tur.ar se configuró en NIC Argentina; la activación y el funcionamiento del dominio definitivo deben verificarse antes de anunciar el lanzamiento como completado. El repositorio por sí solo no prueba el estado operativo actual.

- Dominio objetivo: https://traveldays.tur.ar
- Repositorio: https://github.com/misaelr5/TDAYS
- Desarrollo: Reac Studio
- Documentación complementaria: [`docs/`](docs/)
1. Qué incluye
Área	Funcionalidad
Inicio	Presentación de la agencia con video institucional y accesos a consultas.
Destinos	Catálogo tipado de 8 propuestas con descripción, imágenes y CTA contextual.
Viajes escolares	Primaria, Secundaria y Maestros / El Maestrazo, con medios y guías de consulta.
Testimonios	Videos de pasajeros con reproducción bajo interacción y acceso a reseñas de Google.
Nosotros	Historia, oficina, equipo, acompañamiento y mapa cargado a demanda.
Contacto	Formulario que compone un borrador de mensaje y abre WhatsApp para revisión y envío manual.
Visibilidad	Metadata, canonical, Open Graph, sitemap y JSON-LD TravelAgency.
Institucional	Información de turismo receptivo desde China, redes y términos y condiciones.


Destinos actuales: Brasil, Caribe, Carnavales de Jujuy, Cataratas del Iguazú, Los Túneles, Festival de Jesús María, Bayahíbe y Valeria del Mar.
Rutas públicas
Ruta	Propósito
/	Inicio y propuesta comercial.
/destinos	Destinos y escolares.
/nosotros	Identidad, historia y equipo.
/contacto	Formulario, datos y reseñas.
/terminos	Condiciones comerciales, sujetas a revisión jurídica.


El formulario no persiste consultas ni datos personales en una base propia y no envía mensajes automáticamente. El usuario debe confirmar el envío en WhatsApp. Abrir un enlace no implica una consulta recibida, una reserva confirmada ni un pago.

2. Tecnologías y arquitectura
- Runtime: Node.js 24 y npm (package-lock.json).
- Frontend: Next.js 16.4.2 App Router, React 19.3.1, TypeScript estricto, Tailwind CSS 4 y CSS Modules.
- Interacciones: Motion, GSAP y controles nativos.
- Hosting: Cloudflare Workers mediante @opennextjs/cloudflare y Wrangler.
- QA: Playwright (Chromium, Firefox y WebKit), Axe y validadores internos de medios.
Organización principal
src/
  app/                    # App Router, páginas, layouts y metadata de archivos
  components/             # Componentes reutilizables
  config/
    seo.ts                # URL canónica y política de indexación
    metadata.ts           # Metadata de cada página
    site.ts               # Datos publicados de la agencia
    media.ts              # Procedencia y permisos de medios
  features/
    agency/               # Historia, oficina y equipo
    contact/              # Formulario, validación y borradores
    destinations/         # Catálogo de destinos
    graduates/            # Primaria, Secundaria y Maestros
    media/                # Recursos audiovisuales aprobados
  lib/                    # Utilidades compartidas
public/                   # Medios optimizados y recursos públicos
docs/                     # Auditorías, decisiones y guías
scripts/                  # Verificación y tareas de build/QA
tests/                    # Pruebas automatizadas
wrangler.jsonc            # Cloudflare preview / production
El sitio separa la presentación pública, los datos de configuración y las funcionalidades. Esta modularidad facilita estudiar una ampliación, pero no significa que ya existan base de datos, APIs de negocio, autenticación o pagos.
3. Desarrollo local
Requisitos: Node.js 24, npm y acceso autorizado al repositorio.
git clone https://github.com/misaelr5/TDAYS.git
cd TDAYS
npm ci
npm run dev
Abrir http://127.0.0.1:3210. Evitar ejecutar simultáneamente dos builds sobre el mismo directorio .next.
Comandos disponibles
npm run lint                  # ESLint
npm run typecheck             # Generación de tipos y TypeScript
npm run verify:media          # Integridad de medios aprobados
npm test                      # QA aislado + Playwright
npm run build                 # Build Next.js
npm run cf:build              # Build OpenNext para Cloudflare
npm run cf:preview            # Preview local de OpenNext/Cloudflare
npm run cf:deploy:production  # Script del repo para despliegue productivo
Antes de publicar, revisar la implementación de scripts/cf-deploy-production.mjs, las credenciales de Wrangler y el dominio de destino. Ejecutar comandos localmente no verifica por sí solo el sitio publicado. No correr cf:deploy:production sobre una cuenta/proyecto sin autorización.

Variables de entorno
Copiar .env.example solo cuando el entorno lo requiera. El modo seguro por defecto es revisión:
SITE_INDEXING=false
SITE_ENV=review
El código habilita indexación únicamente si SITE_INDEXING=true y el build se realiza para producción. En Cloudflare, SITE_ENV=production identifica ese entorno; si existe VERCEL_ENV, este tiene prioridad en la lógica vigente. La metadata, robots.txt y otros recursos prerenderizados requieren reconstruir y desplegar después de cambiar variables.

Nunca activar indexación en previews. Tampoco usar robots.txt o noindex como protección para contenido privado.
4. Despliegue en Cloudflare
wrangler.jsonc define dos entornos:
Entorno	Worker	Dominio
Revisión	travel-days-preview	workers.dev
Producción	travel-days	traveldays.tur.ar y www.traveldays.tur.ar mediante Custom Domains


Checklist de salida a producción
1. Confirmar aprobación de los textos y revisión comercial/jurídica de términos, registro, autorizaciones de imagen/voz y afirmaciones de exclusividad.
2. Verificar en NIC Argentina la delegación efectiva a los nameservers asignados por Cloudflare; comprobar que la zona aparezca como Active. No confundir DNS configurado con zona activa.
3. Revisar registros de correo existentes (MX/TXT/SPF/DMARC) antes de cualquier cambio de zona o de DNS.
4. Comprobar que travel-days sea el Worker correcto y asociar los Custom Domains previstos, sin registros A/AAAA/CNAME en conflicto.
5. Definir SITE_INDEXING=true y SITE_ENV=production solo cuando se apruebe el lanzamiento; reconstruir y desplegar el artefacto productivo con esas variables.
6. Comprobar en el dominio real: inicio, 5 rutas, 404, destinos, CTA de WhatsApp, formularios, fotos/videos, mapa, menú responsive y testimonios con audio.
7. Validar HTTPS, redirección de HTTP a HTTPS, redirección de www al origen principal y preservación de ruta/query.
8. Auditar headers efectivos, canonical, Open Graph, /robots.txt, /sitemap.xml y JSON-LD en el HTML servido por Cloudflare.
9. Vincular Search Console y enviar sitemap si corresponde; monitorear errores y rendimiento tras la activación.
Nota sobre el historial: algunos documentos fechados en octubre o noviembre reflejan estados anteriores del hosting, del sitio antiguo o de los DNS. Contrastarlos con el despliegue actual antes de usarlos como prueba de producción.
5. SEO / GEO y accesibilidad
- Canonical principal configurado para https://traveldays.tur.ar, sin www.
- Títulos, descripciones, OG/Twitter, imagen social y sitemap.xml para las cinco rutas públicas.
- JSON-LD TravelAgency con datos de la agencia; no se inventan calificaciones, ofertas ni certificaciones.
- HTML público renderizado y enlaces descriptivos; componentes con alternativas y preferencias de movimiento reducido.
- Playwright/Axe cubren flujos, navegación, responsive y parte de accesibilidad.
No se garantizan posiciones en Google ni apariciones en asistentes de IA. La indexación depende de configuración real, rastreo, contenido y herramientas de buscadores; la auditoría de SEO del 28/10 documenta los límites de lo medido.
6. Medios, privacidad y seguridad
- Fotos y videos se publican desde un manifiesto de medios aprobados; los originales privados no deben versionarse ni servirse desde public/.
- Las autorizaciones de imagen y voz, especialmente de menores, deben conservarse y revisarse para cada uso.
- La web pública no cuenta con base de datos de consultas, usuarios ni pasarela de pagos.
- La validación local, la CSP y los tests mejoran la seguridad, pero no sustituyen monitoreo, control de permisos o una auditoría integral de producción.
- La responsabilidad sobre los datos que puedan conservar WhatsApp, Google u otros servicios es diferente de la ausencia de almacenamiento propio del formulario.
7. Validación y evidencia
El repositorio contiene pruebas y documentos históricos de revisión. En particular:
- [`docs/04-QA-RESULTS.md`](docs/04-QA-RESULTS.md): ejecuciones Playwright/Axe fechadas el 28/10/2026. Documenta una suite con 436 aprobadas, 8 omitidas y 0 fallidas antes de la última modificación puntual, seguida de 72 pruebas focalizadas aprobadas. No debe presentarse como auditoría final del despliegue del 03/11.
- [`docs/02-SEO-GEO-AUDIT.md`](docs/02-SEO-GEO-AUDIT.md): metadata, indexación, JSON-LD y comprobaciones pendientes.
- [`docs/03-SECURITY-AUDIT.md`](docs/03-SECURITY-AUDIT.md): controles y hallazgos de seguridad.
- [`docs/07-CLIENT-PENDING-DECISIONS.md`](docs/07-CLIENT-PENDING-DECISIONS.md): aprobaciones y temas comerciales/jurídicos.
- [`docs/05-DEPLOYMENT-CHECKLIST.md`](docs/05-DEPLOYMENT-CHECKLIST.md): verificaciones del lanzamiento.
Ejecutar controles sobre el código y el dominio final tras cada modificación significativa; no extrapolar resultados de versiones anteriores.
8. Limitaciones de este MVP
No incluye: cuentas, autenticación, reservas online, pagos, cuotas, documentos privados, dashboard administrativo, CMS para editar contenidos, envío automático de formularios ni analítica de tráfico conectada.

Pendientes a valorar: subtítulos de testimonios, revisión legal de términos y afirmaciones institucionales, validación manual del dominio y Search Console, mediciones de rendimiento móvil en producción, monitoreo y analítica consensuada.
9. Futuro sistema de gestión (propuesta, no implementado)
Una siguiente fase puede incorporar:
1. Accesos seguros para agencia y responsables de contrataciones.
2. Gestión de grupos, pasajeros, viajes y contratos.
3. Planes de cuotas, pagos, comprobantes y conciliación.
4. Panel administrativo, permisos, auditoría y seguimiento.
5. Notificaciones y reportes priorizados según necesidades reales.
La arquitectura futura está analizada en [`docs/06-FUTURE-PLATFORM-ARCHITECTURE.md`](docs/06-FUTURE-PLATFORM-ARCHITECTURE.md). La elección entre un único proyecto modular, app independiente o subdominio debe tomarse con el alcance, el tratamiento de datos de menores, la seguridad y los proveedores de pago ya definidos. No crear autenticación o procesamiento de tarjetas desde cero sin evaluar soluciones mantenidas.

Esta fase requiere análisis, presupuesto y aprobación propios; ningún módulo del portal se presenta como funcional en este release.
10. Entrega, mantenimiento y propiedad operativa
- El cliente debe conservar acceso a la titularidad del dominio, correo, cuentas de infraestructura, ficha de Google y redes.
- Los cambios de contenido se solicitan al equipo de desarrollo; no hay CMS ni panel de edición en esta versión.
- Revisar periódicamente dependencias, medios, enlaces, disponibilidad, backups y vencimiento del dominio.
- Las condiciones comerciales, derechos de imagen y textos legales deben validarse con Travel Days y sus asesores.
Responsables de desarrollo: Reac Studio · https://reacstudio.com
