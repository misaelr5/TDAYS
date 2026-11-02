# Release 1.0 — preparación de producción

Contexto: 28/10/2026. Entrega objetivo: 03/11/2026. Trabajo local, sin commit, push, merge, deploy, DNS ni activación de indexación.

## Estado inicial y conservación

- `main` y `rediseno-destinos-nosotros-menu`: `226b78884199765f4a0cb0011dcc9b79c0a83600`. `git ls-remote` confirmó el mismo hash en ambas ramas remotas. La auditoría de `32fd5c8`/`93171dd` quedó atrás.
- 46 archivos tracked modificados inicialmente; 240 archivos locales modificados/nuevos preservados en `output/production-readiness/initial-local-state.zip`, con `initial-manifest.json`, estado e índices/diffs binarios. El ZIP no contiene originales privados ni dependencias. No es un backup completo del repositorio.
- Se conservan cambios previos de navegación, CSS, ocho tarjetas, medios P130/V067, SEO, formularios y referencias visuales. No se atribuyen a este release.
- Stack observado: Node 24.15.0, npm 11.12.1, Next 16.4.2, React 19.3.1, TypeScript 6.0.3 estricto, CSS Modules/Tailwind 4.3.3, Motion/GSAP; Playwright 1.64.1 y Axe 4.14.0. Sin backend de consultas, autenticación, DB ni pagos.
- Servidor de desarrollo ajeno en 3210 conservado. QA usa `.next-qa`, puerto separado y lock.
- Cambio concurrente detectado después del snapshot: `src/app/globals.css` sustituye fades de pestañas por desplazamiento lateral completo. Se conserva, no es implementación de esta entrega; la comparación estática con reduced motion mantiene dimensiones y la suite ejercita navegación con/sin movimiento.

## Implementado en esta entrega

| Cambio | Archivos |
|---|---|
| Indexación requiere aprobación literal y build de producción; Vercel preview tiene precedencia | `src/config/seo.ts`, `.env.example`, `tests/seo.spec.ts` |
| CSP de producción compatible con prerender y animaciones; conserva headers existentes | `src/config/security.ts`, `next.config.ts` |
| JSON-LD TravelAgency con dirección estructurada y horarios reales | `src/config/site.ts`, `src/app/layout.tsx` |
| Mes/año, pasajeros y localidad opcionales; validación y borrador sin persistencia | `src/features/contact/messages.ts`, `contact-form.tsx` |
| Calendario no se cierra al reemplazar el día enfocado en WebKit; Viajeros mantiene foco habilitado/Escape; skip link entra al primer Tab | `src/features/hero/trip-inquiry.tsx`, `src/app/layout.tsx`, `tests/hero.spec.ts` |
| +23 años atribuidos a la trayectoria de Javier Garay; fundación de la agencia conserva 2018 | `src/features/hero/trust-cards.tsx`, `tests/production.spec.ts` |
| Contrato de eventos locales sin datos personales ni proveedor | `src/features/contact/contact-events.tsx`, layout y `src/features/hero/trip-inquiry.tsx` |
| Reutilizar poster visible antes de descargar video | `src/features/media/ambient-video.tsx` |
| Prioridad inmediata solo para la foto LCP inicial del catálogo, manteniendo otras siete diferidas | `src/components/destination-cards.tsx`, `src/features/media/approved-media.tsx`, `tests/media.spec.tsx` |
| Poster Florio dentro del presupuesto, sin tocar original ni encuadre | `public/media/travel-days/trips/maestrazo-florio-desktop.webp` |
| Firefox y WebKit; contratos de producción, formulario y privacidad de eventos; distinguir cancelaciones de precargas por motor | `playwright.config.ts`, `tests/production.spec.ts`, `tests/fixtures.ts`, `tests/accessibility.spec.ts` |
| Referencias actualizadas al footer preexistente y poster comprimido, con evidencia previa conservada | `tests/__screenshots__/chromium/current/`, `tests/current-visual-reference.json`, `docs/Referencias-Visuales.md` |
| Documentación de release | `docs/01-*.md` a `docs/07-*.md`, README |

Se reutilizan soluciones existentes (ADAPT/REUSE): Metadata API, headers y optimización de imágenes de Next; formulario nativo + validación tipada; manifiesto y verificador de medios; Playwright/Axe. BUILD se limita a una política de entorno y un pequeño contrato de eventos. No se añaden paquetes de aplicación ni se actualizan versiones. Los motores Firefox/WebKit se descargaron con el Playwright ya instalado.

## Decisión de release

Los resultados vigentes están en [04-QA-RESULTS](04-QA-RESULTS.md). Las aprobaciones pendientes están en [07-CLIENT-PENDING-DECISIONS](07-CLIENT-PENDING-DECISIONS.md).

| Estado solicitado | Conclusión |
|---|---|
| A. Lista técnicamente | Compilación/QA local aprobadas. No se declara cierre productivo completo: rendimiento móvil bajo objetivo e integración final del dominio/hosting pendientes. |
| B. Aprobación comercial/legal | Pendiente en contratos, exclusividades, atribución/alcance del legajo y situación de turismo estudiantil. RNAV y Bronce sí tienen respaldo documental local inspeccionado; ver 07. |
| C. Publicada y verificada | No. Sin push/deploy/DNS. El dominio sigue sirviendo la versión anterior. |

| Prioridad | Condición | Acción |
|---|---|---|
| P0 | Texto legal desactualizado, alcance del legajo/rol estudiantil y exclusividades pendientes | Revisión de Javier/asesoría antes de publicación e indexación; RNAV/Bronce sí tienen documentos locales revisados |
| P0 | El dominio sirve otro sitio; /destinos y /contacto públicos devuelven 404 | Publicación autorizada y verificación del artefacto correcto |
| P1 | Rendimiento móvil de laboratorio por debajo de 90 | Reducir costo de video, imágenes y JS según medición, conservando diseño |
| P1 | www devuelve 200 en lugar de redirigir al origen canónico | Configurar hosting al lanzar |
| P1 | Sin comprobación física en iPhone ni validación de la URL final en herramientas de Google | Verificar antes del cierre comercial; Schema.org Validator ya dio 0 errores/advertencias |
| P2 | Sin proveedor de analítica/monitorización conectado | Definir responsable, privacidad y presupuesto |
| P3 | Portal de pasajeros/cuotas/pagos | Diseñar segunda fase por separado |

## Consolidación Git propuesta

1. Revisar el delta contra el snapshot inicial y el diff total contra `226b788`; distinguir trabajo anterior, esta entrega y cambios concurrentes.
2. Cerrar P0 y repetir los checks tras cualquier modificación aprobada.
3. Cuando se autorice publicación, preparar commits pequeños: estabilización previa, preparación técnica, documentación; incluir solamente archivos revisados. No usar `git add .` a ciegas.
4. Ambas ramas parten del mismo commit observado: no hace falta merge para el trabajo actual de main. Si cambian los remotos, volver a inspeccionar y solicitar aprobación para integrar divergencias.
5. Conservar commits individuales, autoría del usuario, sin squash/rebase/force. Cada commit de una entrega autorizada debe enviarse; aquí no se crea ninguno.

## Conceptos útiles

Una variable de build queda incorporada en las páginas estáticas: cambiarla en ejecución no rehace robots ni metadata. Una apertura de WhatsApp es intención, no lead confirmado. La CSP limita orígenes y superficies de ataque, pero permitir scripts inline impide considerarla una defensa completa contra XSS.

Los motores pueden diferir en foco nativo: WebKit no enfoca por clic ciertos botones. Un `blur` sin destino no prueba que el usuario salió del componente; al cambiar el mes se reemplaza un día del calendario y después se enfoca el nuevo. Se conserva el cierre por foco externo real, clic externo y Escape, sin interceptar toda la navegación del navegador.
