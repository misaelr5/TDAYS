# Seguridad — alcance de release

28/10/2026. Revisión proporcionada al sitio informativo actual; referencia [OWASP ASVS 5.0](https://asvs.owasp.org/). No es certificación ASVS ni pentest exhaustivo.

## Superficie observada

No hay DB, auth, sesiones, pagos, uploads, API routes propias ni Server Actions. Formularios generan texto local y abren un enlace a WhatsApp por decisión del visitante. No se crean endpoints ni rate limiting ficticio para un backend inexistente. Si se agrega persistencia, la validación del cliente será insuficiente: deberá existir validación/autorización servidor y antiabuso según riesgo.

## Hallazgos y controles

| ID | Severidad residual | Evidencia / tratamiento |
|---|---|---|
| SEC-01 | Media | Sin CSP inicialmente. Se agrega `productionCsp` en `src/config/security.ts` y header en `next.config.ts`. Permite self, scripts/estilos inline requeridos por prerender/animaciones, imágenes data/blob y frame de www.google.com para el mapa bajo clic. Bloquea objetos, framing, orígenes de scripts externos, eval, formularios fuera de self y base externa. Desarrollo queda separado para HMR. Validación real en 04. |
| SEC-02 | Media | `unsafe-inline` no elimina XSS. No se fuerza nonce (haría todas las páginas dinámicas) ni SRI experimental. No hay texto de formularios en innerHTML: React lo escapa; único JSON-LD escapa `<`. Si aparece HTML externo/portal, reevaluar CSP estricta y superficie. |
| SEC-03 | Baja / operativa | X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, X-Frame-Options DENY, Permissions-Policy sin cámara/micrófono/geolocalización y poweredByHeader false ya existían y se conservan. HSTS debe evaluarse en hosting tras comprobar dominio/HTTPS; no se activa preload/includeSubDomains a ciegas. |
| SEC-04 | Pendiente de hosting | Noindex no protege acceso. Previews con material no público requieren Deployment Protection o equivalente. La CSP y headers locales no acreditan la configuración del CDN público. |
| SEC-05 | Sin alertas del registro al ejecutar | `npm audit` completo y `--omit=dev`: 0 info/low/moderate/high/critical. No se corrió audit fix ni se cambiaron dependencias. JSON originales en output/production-readiness. Esto no descarta vulnerabilidades todavía desconocidas. |
| SEC-06 | Limitada por revisión | Escaneo por patrones de claves privadas, tokens GitHub, AWS y OpenAI en texto del working tree e historial Git: sin coincidencias. Se registran solo conteos/rutas, nunca valores. No prueba ausencia absoluta de secretos ni revisa credenciales de servicios externos. |
| SEC-07 | Control existente conservado | `.env*` excluidos salvo ejemplo seguro, originales privados excluidos de Git/public. `resolveMedia` verifica rutas reales dentro de public/media, permisos y existencia, y no serializa procedencia/autorizaciones. Tests cubren traversal/junction, permisos pendientes, texto y recursos. |
| SEC-08 | Privacidad de intención | Eventos locales emiten solo nombre de evento, ruta pública allowlisted y slug de destino allowlisted. Nunca valores, teléfono, texto, URLs de WhatsApp, query/hash ni referrer. Sin cookies/storage/red. Conectar proveedor requiere revisión propia. |

Referencias de código (líneas de esta entrega): `next.config.ts:10` y `:16` (powered-by/CSP); `src/config/security.ts:5` (directivas); `src/features/contact/messages.ts:16` (validación); `src/features/contact/contact-events.tsx:17` y `:37` (allowlist y comienzo de interacción); `src/app/layout.tsx:50` (escape JSON-LD); `src/features/media/files.ts:38` (no serializar procedencia/autorizaciones).

## Mapeo ASVS acotado

- Codificación/validación: formularios tipados con límites, validación adicional para teléfono/mes/cantidad; React escapa texto; URLs de WhatsApp centralizadas/encoded.
- Configuración/frontend: CSP, headers, enlaces externos con noreferrer/noopener, validación de fragmentos preexistente.
- Protección de datos: sin almacenamiento de consultas, logs personales ni telemetría externa agregada; medios sujetos a permiso por recurso.
- Componentes: versiones fijadas y lockfile, audit separado por entorno.
- Autenticación, autorización de recursos, criptografía de sesiones y operaciones financieras: fuera de alcance actual, requisitos obligatorios para fase 2 en 06.

## Reproducción y límites

`npm audit --json`, `npm audit --omit=dev --json`, `npm test -- tests/production.spec.ts tests/contact.spec.ts tests/media.spec.tsx tests/seo.spec.ts`. Revisar headers servidos y CSP violations, además de compilación.

No se hizo explotación destructiva, envío de consultas a personas, cambio DNS, revisión de cuentas/secretos del hosting ni auditoría de toda infraestructura. No se identificó una vulnerabilidad alta/crítica en este alcance; no equivale a garantía de seguridad. Se probó el mapa con red real y captura en Chromium, sin infracciones CSP. El handoff efectivo/recepción por WhatsApp y otros dispositivos requieren control manual; QA no envía consultas. El schema de datos comerciales confirmados se validó por fragmento en Schema.org, sin publicar el sitio.

Al conectar un proveedor de métricas habrá que revisar consentimiento, payload y retención y autorizar sus orígenes exactos en CSP. El sitio actual no incluye scripts externos de analítica; `connect-src 'self'` se mantiene hasta esa decisión.
