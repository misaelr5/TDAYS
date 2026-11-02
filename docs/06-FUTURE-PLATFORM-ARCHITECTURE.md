# Segunda fase — límites del portal

Propuesta, 28/10/2026. No implementa AccessBand ni copia código/interfaz ajena. No agrega Supabase, DB, auth, rutas de portal, endpoints financieros o tablas.

## Separación actual suficiente

`src/app` contiene páginas/metadata públicas; config mantiene dominio/contactos; features encapsula catálogo, agencia, escuela, medios y contacto. No hay dependencia de tablas futuras. Reservar conceptualmente `/portal` o `/mi-viaje` sin crear placeholders, enlaces de acceso que no funcionan ni entradas en sitemap. El público no deberá recibir saldos, pasajeros, menores o documentos por props ni estado compartido.

El layout actual incluye header/footer institucional y cliente de animaciones. Si se elige un único proyecto, introducir entonces route groups `(public)` y `(portal)`, trasladando las envolturas visuales al layout público sin cambiar URLs. Auth/servicios de negocio server-only y layout privado separados; no conectar la web institucional a tablas de viajes para presentar su contenido comercial.

## Alternativas por decidir

| Opción | Beneficio | Costo/riesgo | Cuándo evaluarla |
|---|---|---|---|
| Mismo Next modular | Reutiliza marca, tooling y un despliegue | Mayor acoplamiento de releases, cookies y radio de impacto; necesita layouts/bundles separados | Equipo pequeño y MVP acotado |
| App separada, misma organización de código | Despliegues y dependencias independientes | Más configuración, testing y ownership | Ritmo/riesgo del portal distinto al marketing |
| App separada en subdominio | Frontera clara de origen/sesión y operación | DNS/TLS, autenticación y observabilidad propios | Pagos/documentación y equipo/escala justifican aislamiento |

Subdominio es una decisión de despliegue, no reemplaza autorización por recurso. No se decide separación final sin usuarios, presupuesto, flujo contractual y proveedor de pagos confirmados.

## MVP y responsabilidades

MUST HAVE inicial: identidad de adulto/responsable, acceso solo a sus contrataciones, viajes/grupos, planes/cuotas y vencimientos, estado de pago verificable, comprobantes autorizados, gestión administrativa con roles y auditoría. SHOULD HAVE: comunicaciones y reportes/conciliación operativa. NICE TO HAVE: automatizaciones multicanal y paneles avanzados. No capturar información de menores hasta definir necesidad, base legal y retención.

Límites propuestos: identidad/acceso; viajes/grupos/contratos; pasajeros/responsables; plan de pagos y ledger; integración de pagos/webhooks; conciliación; documentación privada; notificaciones; administración/auditoría. Son módulos de un sistema pequeño inicialmente, no microservicios.

## Build vs reuse pendiente de validación

- REUSE/INTEGRATE: autenticación mantenida (Supabase Auth es candidato), PostgreSQL administrado y proveedor de pagos habilitado en Argentina. No desarrollar autenticación o procesamiento de tarjetas desde cero.
- ADAPT: SDK oficial, mecanismos de webhooks e idempotencia del proveedor que se contrate. Evaluar licencia, actividad/seguridad, documentación, exportación, soporte, precios, límites y lock-in en el momento de seleccionarlo. Sin recomendación de repositorios no inspeccionados.
- BUILD: reglas del negocio de Travel Days, controles por viaje/responsable y conciliación, una vez aprobados. No diseñar ahora esquema de tablas/migraciones ni elegir importes/estados comerciales definitivos.

Antes de implementar, comparar herramientas de gestión turística existentes con este alcance; una solución de mercado puede reducir mantenimiento. El diferencial no debe ser recrear funciones de pagos/auth que ya ofrecen proveedores.

## Requisitos de seguridad y consistencia

1. Autenticación real, sesiones seguras y recuperación; RBAC más autorización por recurso en servidor. Si Supabase: RLS por defecto denegatoria, pruebas de aislamiento y service role exclusivamente servidor.
2. Cada pasajero/responsable accede únicamente a sus recursos. No usar una URL difícil de adivinar o noindex como autorización. MFA y mínimo privilegio para administración según análisis de riesgo.
3. Saldo y estados financieros son derivados de registros verificados del servidor. El cliente nunca elige su saldo, monto confirmado o propietario de la operación.
4. Pagos mediante checkout/tokenización del proveedor: no almacenar tarjetas. Importes/moneda deben definirse en servidor con representación exacta, no aritmética flotante del navegador.
5. Idempotencia en creación de operaciones y procesamiento de webhooks; verificar firma, antigüedad/replay, orden y duplicados. Confirmar con proveedor/conciliación; un redirect de éxito no confirma pago.
6. Transacciones consistentes, auditoría de cambios administrativos/financieros, correcciones trazables y conciliación de fallos. Reintentos y notificaciones no deben duplicar cobros.
7. Documentos en almacenamiento privado con acceso temporal autorizado, sin URLs públicas adivinables ni indexación; validación de upload y controles antiabuso.
8. Minimización de datos de menores, retención/borrado aprobados, logs redactados, backups cifrados y simulacro de restauración; definir RPO/RTO y responsable operativo.
9. Portal noindex y fuera del sitemap, detrás de controles de acceso reales. Verificar que caché/CDN no comparte respuestas privadas; revisar CSRF/cookies, límites de tasa y validación servidor según arquitectura.

## Condiciones para iniciar

Aprobar usuarios/roles y casos de acceso, contratos/moneda/pagos parciales/reintegros, responsable legal y tratamiento de datos, proveedor/comisiones, volumen, operación y soporte. Después elaborar modelo de dominio y pruebas de autorización/conciliación antes de migraciones. La skill de PostgreSQL debe leerse cuando se diseñen o modifiquen estructuras reales, no se agrega persistencia en esta fase.
