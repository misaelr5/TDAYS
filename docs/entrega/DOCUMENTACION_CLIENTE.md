# Travel Days — Documentación de la web

Documento de entrega para Javier Garay, Travel Days (Villa Dolores, Córdoba). Fecha: 3 de noviembre de 2026.

## 1. Qué es el proyecto

Es la nueva web institucional y comercial de Travel Days. Su objetivo es presentar la agencia, mostrar los destinos y los viajes escolares, generar confianza y convertir visitas en consultas por WhatsApp.

Es un **MVP**: una primera versión completa y estable de la web pública. No incluye sistema de reservas, pagos ni cuentas de usuario (ver punto 9).

## 2. Funciones entregadas

| Función | Qué hace |
|---|---|
| Inicio con video | Presenta la agencia con el video institucional autorizado. |
| Egresados | Propuestas de Primaria y Secundaria, cada una con su video, y guía para empezar la consulta. |
| Ocho destinos | Brasil, Caribe, Carnavales de Jujuy, Cataratas del Iguazú, Los Túneles, Festival de Jesús María, Bayahíbe y Valeria del Mar, con foto, descripción y botón de consulta. |
| Maestros / El Maestrazo | Propuesta para docentes dentro de la sección de viajes escolares. |
| Testimonios | Dos videos de pasajeros con audio, que se reproducen solo cuando el visitante los elige, y acceso a las reseñas de Google. |
| Turismo receptivo desde China | Sección informativa al final del inicio. |
| Nosotros | Historia, oficina, equipo, acompañamiento y mapa de la oficina (se carga al pedirlo). |
| Contacto | Formulario de consulta que arma un mensaje para WhatsApp, datos de la agencia y acceso para dejar reseña en Google. |
| Términos y condiciones | Página con las condiciones vigentes aprobadas. |
| Botones de WhatsApp | En el menú, el pie de página, destinos, servicios y contacto. |
| Redes | Instagram y Facebook de la agencia. |
| Buscadores | Títulos, descripciones, mapa del sitio, ficha de la agencia para Google e imagen para compartir en redes. |

## 3. Secciones y navegación

El menú superior tiene: **Inicio**, **Egresados**, **Destinos**, **Nosotros** y **Contacto**. En el celular, el menú se abre con el botón de la esquina. El pie de página repite los accesos, el WhatsApp, el correo y las redes.

Páginas:

- `traveldays.tur.ar/` — Inicio
- `traveldays.tur.ar/destinos` — Destinos y viajes escolares
- `traveldays.tur.ar/nosotros` — La agencia y el equipo
- `traveldays.tur.ar/contacto` — Consultas, datos de la agencia y reseñas
- `traveldays.tur.ar/terminos` — Términos y condiciones

## 4. Cómo funcionan las consultas

1. El visitante completa el formulario de Contacto o toca un botón de WhatsApp.
2. La web prepara un mensaje con los datos que cargó (o con el destino que eligió).
3. Se abre WhatsApp con ese mensaje y **la persona decide enviarlo**.
4. La consulta llega al WhatsApp de la agencia: **+54 9 3544 312904**.

Importante:

- La web **no guarda** consultas ni datos personales. Si alguien no envía el mensaje desde WhatsApp, la agencia no lo recibe.
- La web no confirma reservas ni precios: la conversación sigue por WhatsApp, como hasta ahora.
- Las reseñas se dejan directamente en Google, no en la web.

## 5. Dominio y alojamiento

| Concepto | Estado |
|---|---|
| Dominio | `traveldays.tur.ar` (sin `www`; quien entre con `www` es llevado a la dirección principal). |
| Alojamiento | Cloudflare (plan gratuito para este tipo de sitio). |
| Conexión segura | HTTPS, el candado del navegador. |
| Correo `@traveldays.tur.ar` | Sigue en su proveedor actual. El cambio de la web **no debe** afectar el correo; antes de activar se verifican sus registros. |

**Estado de activación al 3/11/2026:** la nueva web ya está construida, probada y funcionando en Cloudflare. Para que aparezca en `traveldays.tur.ar` falta un único paso administrativo: cambiar los servidores de nombre (DNS) del dominio en **NIC Argentina** por los de Cloudflare. Ese cambio lo hace quien tenga acceso a la cuenta de NIC Argentina del dominio. Mientras tanto, en `traveldays.tur.ar` se sigue viendo la web anterior. Una vez hecho el cambio, la activación puede tardar desde minutos hasta 24–48 horas en verse en todos lados.

## 6. Contenido

Todo el contenido publicado (textos, fotos, videos y testimonios) fue aportado o aprobado por la agencia. Las fotos de los destinos son imágenes con licencia y créditos visibles. Los videos y fotos con personas se usan con la autorización informada por la agencia.

**Responsabilidad sobre imágenes de menores:** la agencia debe conservar las autorizaciones de imagen y voz (firmadas por madres, padres o tutores) de las personas que aparecen en los videos y fotos escolares y en los testimonios. Si alguna familia pide retirar un video o una foto, avisar y se quita a la brevedad.

## 7. Qué puede modificar la agencia y cómo pedir cambios

La web no tiene un panel de edición: los cambios los hace el desarrollador. Esto evita errores accidentales y mantiene la web rápida y segura.

Cambios habituales que se pueden pedir:

- Actualizar teléfono, correo, horarios, dirección o redes.
- Agregar, quitar o editar un destino (texto y foto).
- Cambiar fotos o videos (con autorización de las personas que aparecen).
- Ajustar textos de cualquier sección o de los términos.
- Agregar nuevos testimonios.

**Cómo pedirlo:** enviar por WhatsApp o correo al desarrollador la página y sección, el texto nuevo tal como debe quedar y, si corresponde, las fotos o videos en su mejor calidad original. Para personas que aparecen en imágenes, confirmar que hay autorización.

## 8. Mantenimiento básico

- **Dominio:** renovar `traveldays.tur.ar` en NIC Argentina antes de su vencimiento. Si el dominio vence, la web y el correo dejan de funcionar.
- **Cuentas:** la agencia debe conservar el acceso a NIC Argentina, al correo, a la ficha de Google y a las redes.
- **Ficha de Google:** mantener actualizados dirección, horarios y el enlace a la web. Pedir reseñas a los pasajeros después de cada viaje.
- **Revisión periódica:** se recomienda una revisión técnica cada 3 a 6 meses.

## 9. Limitaciones de esta versión (MVP)

- No hay reservas, pagos, cuotas, cuentas de usuario ni panel de administración.
- No hay precios ni fechas de salida publicados: se informan por WhatsApp.
- Los formularios no envían correos ni guardan consultas: todo pasa por WhatsApp.
- Los testimonios en video todavía no tienen subtítulos.
- No hay estadísticas de visitas conectadas (se pueden sumar más adelante, respetando la privacidad de los visitantes).
- Los términos y condiciones conservan una referencia a la Ley 18.829, que fue derogada; conviene que un asesor actualice esa cita.

## 10. Mejoras futuras posibles

- Sistema propio de pasajeros: registro de grupos y pasajeros, reservas, plan de cuotas, pagos y panel para la agencia.
- Subtítulos en los testimonios.
- Estadísticas de visitas y consultas.
- Más testimonios y galerías de viajes realizados.
- Páginas individuales por destino.

Cada mejora se presupuesta por separado.

## 11. Responsabilidades

| Travel Days | Desarrollo |
|---|---|
| Veracidad de textos, precios, condiciones y datos comerciales. | Funcionamiento técnico de la web entregada. |
| Autorizaciones de imagen y voz, especialmente de menores. | Aplicar los cambios solicitados y aprobados. |
| Renovación del dominio y acceso a sus cuentas. | Mantener la configuración técnica y el despliegue. |
| Responder las consultas que llegan por WhatsApp. | Informar problemas técnicos y proponer soluciones. |
| Revisión legal de los términos y condiciones. | No publicar contenido sin aprobación de la agencia. |
