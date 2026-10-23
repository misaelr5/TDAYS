# Referencia y decisiones · 23/10/2026

## Fuente y alcance

Referencia principal: `2026-10-23 17-17-21.mp4`, 1920 × 1080, aproximadamente 10,98 segundos, 60 fps. Se extrajeron 22 fotogramas de inspección y fotogramas completos adicionales en `output/reference/`.

El usuario confirmó explícitamente **Travel Days con la composición y animaciones del video**. Los dos textos adjuntos complementan el alcance. No se recibió el prompt original íntegro de Baseline: se aplicaron las técnicas descritas en el complemento, sin afirmar inspección de esa implementación.

El video muestra una presentación de una web de café «brewns» dentro de otra plataforma. La notebook y el panel lateral de esa plataforma son el marco de presentación; no se reprodujeron como secciones de la web pública.

| Tiempo aproximado | Observado | Adaptación realizada |
|---|---|---|
| 0–1,5 s | Notebook mostrando la portada; transición desenfocada | Se omite el mockup externo. La página abre directamente en el hero |
| 2–3,5 s | Portada oscura, titular a izquierda, bolsa y vaso inclinados a derecha, texto manuscrito, navegación pequeña | Titular de Travel Days, pasaporte y tarjeta de embarque, postcard y parallax; logo original |
| 4–5 s | Fondo claro, título de tres líneas, ghost script y cuatro productos enmarcados | Catálogo de destinos, cuatro postales por vista desktop y desplazamiento a los otros cuatro |
| 5–6,5 s | Reloj grande con bebida central y direcciones debajo | Avión en reloj circular, dirección y horarios de Travel Days |
| 6,5–7,5 s | Titular oscuro, partículas/granos, vaso grande y texto institucional | Sellos y pasaporte, historia real de la agencia |
| 7,5–9 s | Fondo de producto, recibo colgante e invitación a comprar, footer | Postales y avión, recibo como invitación a consultar, contacto por WhatsApp y footer |
| 9,5–11 s | Vuelve el mockup de notebook | No se fuerza un loop de página ni navegación automática |

El video permite observar desplazamiento, entradas de texto y superposiciones. No permite recuperar el código original, duración exacta de cada easing, todos los estados hover, breakpoints o una escena 3D navegable. Las distancias de parallax son ajustes propios para aproximar su efecto.

## Dirección visual revisada antes de construir

- Tinta navy `#111d2a`, fondo profundo `#09121d`, papel `#eeede8`, blanco de papel `#f9f7ee`, arena `#c8b796`, acento de foco `#e78a4d`.
- Inter local para navegación, titulares compactos y textos; Caveat local para anotaciones manuscritas, en lugar de imponer Onest.
- Hero con texto alineado a izquierda y objetos a derecha; luego bloque claro con jerarquía editorial; reloj; bloque oscuro; recibo central y cierre.
- El elemento memorable es el conjunto de documentos de viaje. No se añadieron estadísticas, testimonios, dashboard, grilla de servicios o secciones ajenas al video.
- Al revisar el plan, se descartó un hero turístico genérico con buscador y fotografía de stock: no respondía a la composición observada ni contábamos con fotos aprobadas.

## Reusar, adaptar, integrar, construir

- **REUSE:** versiones y convenciones de Travel Days, sus ocho destinos, contactos, logo e Inter. Next/React/Tailwind ya resuelven rutas, prerender y estilos. [Next.js App Router](https://nextjs.org/docs/app).
- **ADAPT:** composición de la referencia y técnicas de texto del complemento de Baseline. No se importa una plantilla turística que imponga otra composición o contenido comercial.
- **INTEGRATE:** Motion para animación ligada al scroll y preferencias de movimiento; enlaces `wa.me` para iniciar consultas por gesto del usuario. [Motion useScroll](https://motion.dev/docs/react-use-scroll), [accesibilidad](https://motion.dev/docs/react-accessibility).
- **BUILD:** documentos, paisaje vectorial, recibo y adaptación de las cinco secciones. No se construye un motor de animación propio.

Motion: licencia MIT, repositorio público de Motion Division, actualización de npm del 22/10/2026 y versión 14.6.0 verificados al investigar. Tiene documentación oficial y adopción documentada. Se revisaron sus dependencias y las auditorías npm; esto no equivale a una investigación exhaustiva de todo su historial de seguridad. No requiere servicios de pago ni API alojada y limita su uso a los componentes interactivos. [Repositorio](https://github.com/motiondivision/motion), [documentación](https://motion.dev/docs/react).

## Recursos del complemento de Baseline

Incorporados: máscaras y stagger de palabras, easing centralizado, parallax moderado, ghost script, tarjetas con elevación, menú fullscreen escalonado, detalle de papel y secuencia coordinada por scroll.

Descartados: loader y porcentaje ficticio, autoplay, carrusel de hero no observado, cursor personalizado, motor TextEngine propio, escala tipográfica por JavaScript, GSAP/ScrollTrigger/Lenis y Three.js. La referencia no prueba que necesitemos esas tecnologías. CSS y un único motor de motion cubren lo implementado.

Las ilustraciones no sustituyen definitivamente el material fotográfico real. La siguiente mejora de mayor valor es incorporar fotos autorizadas y ajustar sus recortes sobre esta composición. No se ha verificado fidelidad fotográfica ni un equivalente exacto a la escena original de café.
