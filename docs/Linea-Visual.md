# Línea visual unificada · 25/10/2026

El usuario aprobó extender a toda la web la línea del hero y reemplazar el reel
por tarjetas como Apple Cards Carousel. Confirmó fondo claro, ocho destinos,
enlaces al catálogo, ilustraciones hasta recibir fotos y retirada de manuscritas,
titulares gigantes en mayúsculas y objetos de pasaporte/recibo.

## Objetivo y estado previo

El hero y el footer ya tenían una composición nueva, pero destinos conservaba
franjas expandibles y un encabezado de gran tamaño. Nosotros, Contacto y el cierre
con recibo seguían otro tratamiento visual. La intervención unifica esos módulos
sin alterar destinos, contactos, metadatos de revisión, privacidad o datos de negocio.

## Marca y arquitectura

Se inspeccionó visualmente el logo original `5.png` de TravelDays y se copiaron
sus bytes sin modificación a `public/media/logos/travel-days-color.png`. El SHA-256
de ambos archivos es
`7FB69B7EC1B3C57D4EE0C748BBFA4E64232F2102B03A8C0DE04ED742C22367B7`.
Sus colores predominantes son azul `#006CF9`, naranja `#F58634` y blanco.

- Inter es la única fuente cargada; Caveat y su licencia se conservan como recursos
  históricos. Los titulares pasan a formato oración y peso moderado.
- Los tokens comunes definen color, superficies, foco, radios de 24 px y sombras.
  Las superficies glass usan transparencia, borde de luz y `backdrop-filter`.
- El vidrio se concentra en tarjetas y controles. Los textos y las acciones tienen
  fondos suficientes para mantener la legibilidad; el naranja actúa como acento.
- Se retiraron los componentes visuales de pasaporte, tarjeta de embarque, postales,
  sellos, recibo e impresora y su CSS global. Landscape mantiene la ilustración
  original y los medios continúan resolviéndose en servidor.
- Inicio, catálogo, Egresados, Nosotros, Contacto, footer, menú y 404 comparten
  tipografía y tokens. El contenido institucional y los formularios se conservaron.

## Solución reutilizada y diferencias con el adjunto

Se consultaron el código entregado por el usuario y la
[documentación oficial de Apple Cards Carousel](https://ui.aceternity.com/components/apple-cards-carousel).
Se eligió **ADAPTAR** su composición sobre React, Next.js, Motion y CSS existentes.
No se incorporaron paquetes ni se importaron demos, fotos o textos de ejemplo.

| Aspecto | Adaptación y motivo |
| --- | --- |
| Tarjetas | Medidas de referencia: 224×320 en móvil y 384×640 en escritorio, radios 24 px, título superior y controles inferiores. |
| Acción | Enlaces `/destinos#slug`, según la elección explícita del usuario. El catálogo mantiene las consultas WhatsApp específicas. |
| Panel emergente | No se implementan modal, CarouselContext, Card expansible ni useOutsideClick porque el flujo elegido navega al catálogo. |
| Medios | ApprovedMedia/Landscape renderizados en servidor reemplazan las URL de la demo. Sin fotos externas ni datos inventados. |
| BlurImage | Se utiliza el renderer de medios existente y no un wrapper que mezcla props de Next Image con un img normal. |
| Estilos | CSS Modules en lugar de copiar utilidades literalmente: permite integrar el fondo claro, Inter y la identidad confirmada. |
| Dependencias | Se reutiliza Motion y los iconos SVG propios; no se necesitan Tabler, clsx, tailwind-merge ni un instalador de componentes. |
| Movimiento | Contenido visible desde SSR, hover discreto y scroll sin animación con movimiento reducido; sin entradas que oculten contenido sin JS. |
| Desplazamiento | Anchos reales y ResizeObserver sustituyen cálculos fijos. Flechas, teclado y estados se actualizan al redimensionar. |
| Tema | Fondo claro confirmado; no se añade un selector de tema ni modo oscuro. |

Los cambios principales están en globals/layout, sections, header/footer,
destination-cards, ui/apple-cards-carousel y los CSS de Agency, Contacto y Egresados.

## Validación y límites

Las pruebas de destinos se actualizaron para diferenciar ocho enlaces de exploración
en Inicio de ocho consultas WhatsApp en el catálogo. Se comprueba navegación al
ancla, scroll horizontal sin mover la página, extremos, teclado y uso sin JS.
Las garantías sobre datos comerciales, permisos de medios, privacidad y perfiles
pendientes siguen cubiertas.

La revisión visual utiliza capturas actuales de las cuatro páginas y del carrusel
en escritorio y móvil en `output/playwright/unified-*.png`. Las 29 capturas
históricas se conservan con sus hashes; la comparación estricta con la composición
anterior no se utiliza para aprobar este rediseño intencional.

La primera ejecución detectó que el helper de imágenes intentaba desplazar el logo
del menú cerrado. El helper omite imágenes no visibles y el logo del menú carga
de forma anticipada desde el mismo recurso local. La validación se repite después
de esa corrección.

El hero conserva la ilustración temporal hasta recibir la foto original. Los
destinos mantienen ilustraciones, como pidió el usuario. No hay precios, fechas,
disponibilidad o nuevos servicios confirmados. No se hizo commit, push ni deploy.

## Próximo paso y aprendizaje

El siguiente paso visual de mayor valor es incorporar las fotos originales y
autorizadas a los slots existentes, manteniendo intacta la composición.
Conceptos transferibles: tokens compartidos para consistencia, contenido en servidor
con interacción mínima en cliente y enlaces HTML como base de mejora progresiva.
