# Hero de paisaje y footer · 25/10/2026

Se sustituyeron el hero de luz y sombras y el footer anterior por una
implementación basada en la imagen y el video de `src/inspo/`. Se inspeccionaron
visualmente la composición del hero, el bloque de explicación y el pie de página.
También se localizó la [referencia original de Indotravi](https://dribbble.com/shots/23800373-Indotravi-Travel-Landing-Page).

## Composición

- Paisaje grande con título y subtítulo centrados.
- Logo a la izquierda, navegación en una cápsula translúcida al centro y contacto
  a la derecha. Navbar sólida al desplazar y en las páginas interiores.
- Barra redondeada con destino, fecha aproximada y cantidad de viajeros.
- Cuatro tarjetas blancas superpuestas al borde del hero: comienzo en 2018,
  ocho destinos, viajes de egresados y atención personal.
- Footer oscuro con tres columnas de enlaces y un bloque amplio de contacto,
  cápsula de WhatsApp, iconos de contactos reales y copyright centrado.

Se mantiene Inter y el logo original. La referencia se adapta al contenido real
de Travel Days: no se copiaron cifras, testimonios, idiomas, login, redes no
confirmadas ni un newsletter sin infraestructura.

## Fondo pendiente

El usuario confirmó que tiene la fotografía original en otra carpeta y que la
compartirá más adelante. Por eso el hero usa una ilustración SVG temporal,
identificada como ilustración, con un lago y montañas en la composición de la
referencia. No se publicaron fotografías de terceros ni imágenes generadas.

El slot `hero` del manifiesto existente admite la fotografía cuando se entregue
la ruta y pueda registrarse su autorización. `MediaContent` ahora permite `sizes`
y carga prioritaria: el hero usará `100vw`, `loading="eager"` y prioridad alta;
el resto conserva la carga diferida y sus tamaños existentes. Si se registra un
video se utiliza el poster, sin iniciar reproducción.

## Funcionamiento

`ScenicHero` se renderiza en servidor. Sólo `TripInquiry` necesita estado de
cliente: prepara un borrador con los valores elegidos, permite revisarlo y ofrece
el enlace a WhatsApp. Editar cualquier campo invalida el borrador. No hay
solicitud de disponibilidad, reserva, envío automático ni almacenamiento de datos.

Sin JavaScript se ofrecen enlaces de consulta y de destinos. El menú móvil
conserva Escape, ciclo y restauración de foco y bloqueo de scroll. Los campos
tienen etiquetas accesibles y el resultado recibe foco después de prepararse.

El footer se renderiza en servidor y utiliza exclusivamente rutas y contactos
existentes. La cápsula derecha es un enlace de contacto, no un campo de email.
No se añadieron dependencias ni se reutilizó código de repositorios externos.

## Validación

Se actualizó `tests/hero.spec.ts` para el diseño nuevo, sus siete anchos,
comportamiento de navbar, consulta contextual y alternativa sin JavaScript.
Las capturas históricas permanecen inmutables y su comparación estricta no se
ejecuta como validación del diseño nuevo. Se guardan capturas actuales para
inspección visual en `output/playwright/scenic/` y
`output/playwright/scenic-{hero,footer}-{390,1440}.png`.

Se ejecutaron lint, TypeScript y build de producción aislado, más la suite
funcional de sitio, hero, interacción, accesibilidad, contenido, contacto y medios.
Resultado: 78/78 pruebas aprobadas y Axe sin infracciones en las comprobaciones
ejecutadas. Lint terminó sin errores ni advertencias. El informe final de pruebas
está en `output/playwright/results.json`.

Se conservaron los cambios previos y concurrentes del proyecto y el módulo de
Egresados. No hubo commit, push ni deploy.
