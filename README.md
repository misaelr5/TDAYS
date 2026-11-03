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


10. Entrega, mantenimiento y propiedad operativa
- El cliente debe conservar acceso a la titularidad del dominio, correo, cuentas de infraestructura, ficha de Google y redes.
- Los cambios de contenido se solicitan al equipo de desarrollo; no hay CMS ni panel de edición en esta versión.
- Revisar periódicamente dependencias, medios, enlaces, disponibilidad, backups y vencimiento del dominio.
- Las condiciones comerciales, derechos de imagen y textos legales deben validarse con Travel Days y sus asesores.
Responsables de desarrollo: Reac Studio · https://reacstudio.com
