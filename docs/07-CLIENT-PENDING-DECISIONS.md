# Confirmaciones y decisiones de Javier

28/10/2026. No es asesoramiento jurídico definitivo.

**Actualización 02/11/2026:** según informó el usuario, Javier aprueba los textos vigentes (hero, trust cards, sección China y términos) tal como están publicados, y se autoriza el lanzamiento e indexación en `traveldays.tur.ar`. Observación técnica que se mantiene: los términos citan la Ley 18.829, derogada por el DNU 70/2023 (art. 349); actualizar la cita cuando la asesoría lo indique.

## Datos contrastados

| Dato | Clasificación en esta entrega | Evidencia/acción |
|---|---|---|
| Felipe Erdman 222, Villa Dolores, Córdoba | VERIFICADA con el usuario | Confirmación explícita durante esta sesión. La dirección Luis Laje 681 del sitio público queda DESACTUALIZADA para el nuevo release. |
| +54 9 3544 312904 / wa.me/5493544312904 | VERIFICADA con el usuario | Confirmó línea activa de WhatsApp. Formato argentino contrastado con ayuda oficial de WhatsApp; no se envió un mensaje real. |
| facebook.com/traveldayseducativos | VERIFICADA con el usuario | Confirmación explícita en esta sesión. Ya existente en site.ts; no se inventó slug desde el nombre informal. |
| Fundación 2018, Javier fundador y más de 23 años de trayectoria personal | VERIFICADA como dato aportado por el usuario | No significa que la agencia tenga 23 años. Mantener atribución en tarjetas y textos. |
| Dos correos, Instagram y horarios del prompt | Coinciden con proyecto; aportados por usuario | No se probó recepción de correo ni control de cuentas sociales. |
| TikTok @traveldaysoficial1 | PENDIENTE DE VALIDACIÓN de URL | No agregar enlace construido sin URL oficial aprobada. |
| Perfil de Empresa de Google | PENDIENTE DE VALIDACIÓN de URL/gestión | Existe share.google para reseñas; no prueba ownership de ficha ni calificación. |

## Bloqueos de contenido antes de publicar

| Prioridad | Afirmación / lugar | Clasificación | Decisión requerida |
|---|---|---|---|
| P0 | Ley 18.829 vigente / autoridad / Decreto 2182/72 en `src/features/legal/terms.ts` | DESACTUALIZADA al menos en referencia a la ley | Revisión de asesoría. DNU 70/2023 art. 349 deroga Ley 18.829. No sustituir automáticamente todo el régimen por una interpretación de Codex. |
| P0 | Legajo 18904 como acreditación del Ministerio en términos, Nosotros, trust cards y módulo escolar | RESPALDO DOCUMENTAL LOCAL; alcance legal/redacción PENDIENTES | El PDF privado RNAV nombra Travel Days, OLIZHAY SAS y legajo 18904. No lo convierte en autorización estatal vigente ni en certificado estudiantil. Corregir la atribución al Ministerio con asesoría. |
| P0 | “La única agencia” en hero; “Pioneros” en trust cards | NO RESPALDADAS documentalmente en esta tarea | Javier debe aportar alcance/evidencia o aprobar redacción descriptiva sin exclusividad. |
| P0 | “Primera empresa” y convenio de turismo chino en `china-section.tsx` | NO RESPALDADAS documentalmente en esta tarea | Verificar convenio, vigencia, alcance y comparación; retirar exclusividad solo con redacción aprobada. |
| P1 | Calidad Turística Nivel Bronce | RESPALDO DOCUMENTAL LOCAL | PDF a nombre de Travel Days, FAEVYT-SECTUR, vigencia Ago-2026 a Jul-2028. Comprobados contenido y fechas del archivo, sin consulta individual de autenticidad/estado al emisor. |
| P0 | Certificado estudiantil / rol comercial | PENDIENTE DE VALIDACIÓN | Ninguno de los dos PDFs revisados es un Certificado Nacional de Autorización de Turismo Estudiantil. Determinar con asesoría si opera como organizador o comercializador y la documentación aplicable; no inferir incumplimiento por la ausencia de ese documento en esta carpeta. |
| P0 | Confirmación de reservas/pagos, cancelaciones, reintegros, responsabilidad, aceptación por navegación y cesión de datos en términos | PENDIENTES DE APROBACIÓN | Revisar operación real y marco aplicable con Javier/asesoría; no aprobar condiciones por inferencia técnica. |
| P1 | Tratamiento efectivo de consultas fuera de web | PENDIENTE DE VALIDACIÓN | Revisar qué conserva la agencia en WhatsApp/email, quién accede y cuánto tiempo. No trasladar la afirmación “la web no guarda” a todos los servicios de terceros. |
| P1 | Símbolo ® del hero y formación/asistencia paramédica declarada | PENDIENTES DE RESPALDO/ALCANCE | Confirmar derecho de uso del distintivo y alcance profesional/comercial de los servicios declarados; los dos PDFs revisados no documentan esos extremos. No se agregaron afirmaciones nuevas. |
| P1 | Usos de medios | Permisos por recurso registrados en manifiesto | Conservar evidencia del alcance. P168–170 escolares y P130/V067 tienen autorizaciones previas específicas; no extenderlas a los otros 340 originales. |

Los textos anteriores se preservan en el estado local protegido. No se publican ni se crean nuevas condiciones contractuales. El lanzamiento permanece bloqueado por revisión comercial/legal; no basta activar el interruptor SEO.

## Certificados privados inspeccionados

Se leyeron ambos PDFs completos (una página cada uno), con extracción de texto y render local; no se modificaron ni copiaron a public/ o Git. `certificate-review.json` conserva SHA-256 y texto limitado, y los PNG de revisión permanecen en output/production-readiness, ignorado por Git.

- `src/fotos videos y contenido traveldays/Fotos/certificado_5467_18904.pdf`: certificado RNAV, marca Travel Days, razón social OLIZHAY SAS, legajo 18904. El archivo no aporta por sí solo prueba de CNAET ni vigencia de la antigua Ley 18.829. La razón social contractual debe confirmarse con Javier antes de reescribir términos.
- `src/fotos videos y contenido traveldays/Fotos/certificado-bronce-18904.pdf`: Sello de Calidad Turística para Agencias de Viajes, Nivel Bronce, Travel Days; vigencia visible **Ago-2026 a Jul-2028**. Existe respaldo documental local para esa afirmación; no corresponde clasificarla como carente de documento.

El programa de calidad FAEVYT/Secretaría de Turismo está descrito en [la fuente gubernamental](https://www.argentina.gob.ar/node/508052). El contexto local de adhesión al RNAV figura en [Córdoba Turismo](https://cordobaturismo.gov.ar/prensa/cordoba-adhirio-al-registro-nacional-de-agentes-de-viajes/). Esas páginas no son una validación individual del certificado de Travel Days. El acceso automatizado al PDF público de requisitos FAEVYT devolvió 403; no se inventa una comprobación registral individual. No se incorporan sellos, PDFs privados ni nuevos claims a la web en esta entrega.

## Opciones concretas de copy para aprobación

No implementadas. Javier puede aportar prueba de exclusividad o aprobar alternativas descriptivas: hero “Viajes de egresados en Traslasierra”; tarjeta “Viajes escolares” con “Primaria, secundaria y maestros”; China “Consultá por turismo receptivo desde China”. Para el legajo, evaluar “Registro RNAV · N.º 18904” con asesoría, apoyado en el documento provisto, sin atribuirlo al Ministerio ni equipararlo al CNAET. Los contratos, pagos, cancelaciones y responsabilidad requieren redacción jurídica específica; estas opciones no los sustituyen.

## Fuentes oficiales consultadas

- [DNU 70/2023, texto oficial](https://www.argentina.gob.ar/normativa/nacional/395521/texto), art. 349.
- [Resolución 1/2024, reglamento de turismo estudiantil](https://www.argentina.gob.ar/normativa/nacional/norma-402532/texto), aprueba reglamento y deroga Resolución 23/2014. Su anexo distingue organizadores de comercializadores por cuenta y orden; esa clasificación de Travel Days debe verificarse, no presumirse.
- [Ayuda oficial: formato internacional WhatsApp](https://faq.whatsapp.com/1294841057948784/?locale=es_LA).

Se consultaron fuentes oficiales actuales disponibles; esto no certifica cumplimiento de todos los niveles provincial/municipal ni vigencia de documentación individual. Asesoría debe revisar normativa complementaria y la situación concreta.

## Decisiones operativas y segunda fase

P0: autorizar publicación solo tras cierre legal y QA. P1: proveedor/plan comercial de hosting, responsable DNS y preservación de correo, iPhone real, ficha de Google. P2: un proveedor de analítica, consentimiento/retención y responsable de seguimiento; no se conectó GA4/Vercel Analytics automáticamente. P3: alcance, presupuesto y arquitectura del portal según 06.

## Contrato de medición preparado

`window` emite `traveldays:measurement`. Consumidor futuro debe respetar consentimiento y allowlist. No hay almacenamiento ni servicio remoto conectado.

| Evento | Disparador | Interpretación |
|---|---|---|
| contact_whatsapp_click | Clic no cancelado a línea configurada | Intención de abrir WhatsApp |
| destination_inquiry_click | Clic de tarjeta a WhatsApp, slug allowlisted | Interés por un destino |
| contact_form_start | Primer foco o pulsación en control de consulta por instancia de formulario | Inicio de interacción, sin valores; incluye Safari aunque el clic no mueva foco |
| contact_form_whatsapp_open | Clic del borrador preparado hacia WhatsApp | Handoff solicitado; no prueba app abierta ni envío |
| phone_click | Clic en tel | Intención de llamar |
| email_click | Clic en mailto | Intención de escribir |
| social_click | Clic a Instagram/Facebook configurados | Salida a red social |

Payload solo `{event, page, destination?}`; page sin query/hash y limitada a cinco rutas; destination solo slugs del catálogo, sin texto libre. Un clic puede emitir evento general y uno específico: no sumarlos como leads distintos. No se genera `lead_confirmed`: requiere confirmación humana/CRM autorizada y un diseño de privacidad separado.
