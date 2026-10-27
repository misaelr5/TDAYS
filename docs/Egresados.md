# Egresados · 25/10/2026

Se reemplazó el reloj de Inicio por un módulo de viajes de egresados, siguiendo
la composición de imagen vertical y explicación por pasos de las dos referencias
de `src/inspo/`. Se inspeccionaron tanto la imagen WebP como el video MP4. Son
referencias de diseño, no material audiovisual de grupos de Travel Days.

## Implementación

- Inicio: presentación, ilustración, tres pasos de consulta, acceso a
  `/destinos#egresados` y consultas específicas por WhatsApp.
- Destinos: el mismo módulo después de los ocho destinos, con información
  adicional para primaria y secundaria, contexto real de la trayectoria de
  Javier y tres preguntas desplegables para estudiantes y familias.
- Frases solicitadas: “Una vez en la vida” y “No te quedes sin tu viaje”.
- Footer: enlace directo a Egresados. El reloj fue retirado también de Nosotros
  por cambios concurrentes posteriores.

La sección se renderiza en servidor. El componente compartido admite una
versión ampliada, con CSS Modules para evitar afectar otros módulos. Los textos
y el mensaje de consulta están en `src/features/graduates/data.ts`.
Los desplegables utilizan `<details>` y `<summary>` nativos y funcionan con
teclado y sin JavaScript. No se añadieron dependencias, servicios ni formularios.

## Medios y contenido

La escena SVG es una ilustración editorial propia, identificada visualmente y
con texto alternativo. No representa un destino ofrecido ni un viaje realizado.
Los slots existentes `graduates` y `graduates-detail` permiten sustituirla por
material autorizado mediante el manifiesto actual. En ausencia de aprobación se
mantiene la ilustración. La sección utiliza el poster si se registra un video;
no inicia reproducción automática.

Se reutilizaron el resolver de medios, `MediaContent`, la configuración de
WhatsApp y el contenido institucional existente. Se consultaron las guías
oficiales de [imágenes de Next.js](https://nextjs.org/docs/app/api-reference/components/image)
y [video](https://nextjs.org/docs/app/guides/videos); no hace falta incorporar
una biblioteca de UI para esta composición.

No se publicaron precios, fechas, destinos específicos de egresados,
servicios incluidos, testimonios ni disponibilidad. La información detallada
se presenta como temas para consultar antes de contratar.

## Validación

- `npm run lint`: aprobado.
- `npm run typecheck`: aprobado, conservando los bytes previos de `next-env.d.ts`.
- Build de producción aislado mediante `scripts/qa.mjs`: aprobado; rutas estáticas.
- 78 pruebas existentes de sitio, hero, interacción, contacto, contenido, medios
  y accesibilidad aprobadas. Incluyen cuatro rutas, siete anchos de 320 a 1440 px,
  reflow al 200%, navegación sin JavaScript y Axe en móvil y escritorio.
- Rebuild final y repetición de diez controles de catálogo, Axe y movimiento:
  aprobados. La prueba de parallax ahora fuerza scroll real en Nosotros; llevar
  a la vista un elemento ya visible no verifica la respuesta al desplazamiento.
- Comprobación adicional de orden después del catálogo, enlace desde Inicio,
  teléfono y mensaje de WhatsApp, acordeón con teclado y funcionamiento sin JS.
- Revisión visual de las capturas reales del módulo en escritorio y móvil.
- Las 29 capturas históricas conservaron sus hashes. La suite de comparación
  con esas capturas no se ejecutó: conserva el diseño anterior al módulo y
  requiere tratar estos cambios visuales como intencionales.

Capturas en `output/playwright/egresados-{home,destinos}-{390,1440}.png`.
En las capturas aisladas del módulo se ocultan temporalmente navbar, skip link
y herramientas de desarrollo para que los elementos fijos no tapen el contenido;
no se ocultan en la aplicación.

No hubo commit, push ni deploy. Se conservaron los cambios previos y concurrentes
del repositorio, incluida la retirada concurrente del bloque institucional de
Inicio. Sobre el ajuste concurrente de su prueba hacia Nosotros, se corrigió
únicamente el desplazamiento para evitar una comprobación sin scroll.

## Pendientes

La mejora de mayor valor es incorporar fotografías propias de grupos con
autorización y propuestas comerciales confirmadas. Hasta entonces la sección
permite descubrir el servicio y consultar por cada grupo, sin prometer un paquete.

Conceptos transferibles: composición de servidor para contenido estático,
mejora progresiva con HTML nativo y separación entre datos, presentación y
autorización de medios.

## Rediseño UX/UI · 25/10/2026

Auditoría: cuatro titulares-eslogan compitiendo, Primaria y Secundaria relegadas
al final (y solo en Destinos), pasos y preguntas con la misma tarjeta genérica,
sin datos de confianza para las familias y una versión móvil de ~3000 px.

- **Explorador de niveles** (`graduates-explorer.tsx`, cliente): en escritorio,
  dos paneles que se expanden (hover con retardo de intención, clic, flechas,
  Home/End); el colapsado muestra el nivel en vertical. En móvil (<960 px) es un
  acordeón táctil con un solo panel abierto y el contenido sobre papel. Cada
  nivel tiene su texto, temas para la primera charla y su consulta de WhatsApp.
  Sin JS ambos paneles quedan abiertos (`<noscript>`).
- La ilustración admite `variant` (`morning` para primaria, `sunset` para
  secundaria). Si se aprueba material de `graduates`, reemplaza solo el atardecer.
- **Confianza**: 23 años de Javier, coordinación, asistencia paramédica y legajo,
  tomados de `features/agency/data.ts`. En Destinos se suma la formación del equipo.
- **Proceso** editorial en tres columnas (lista compacta en móvil); preguntas con
  `<details>` nativo, numeradas y la primera abierta; cierre con WhatsApp y
  acceso a preguntas frecuentes.
- Se respetan `prefers-reduced-motion`, foco visible y AA. Sin dependencias nuevas.

## Inicio visual y compacto · 26/10/2026

Dirección confirmada por el usuario: dirigirse primero a madres y padres, mostrar
Primaria y Secundaria juntas y poner el recuerdo con sus compañeros en primer plano.

- `graduates-preview.tsx` y su CSS Module presentan **EGRESADOS** en grande,
  dos módulos visuales con una frase breve y una consulta de WhatsApp por nivel.
  Cada módulo completo es un enlace nativo con nombre accesible y foco visible.
- Un módulo pequeño para las familias enlaza a las preguntas frecuentes de
  `/destinos#egresados-preguntas`. Inicio ya no repite trayectoria, legajo,
  proceso de tres pasos ni el cierre largo. La información permanece en la
  versión ampliada de Destinos.
- Se reutilizan los textos breves y mensajes de consulta existentes, los tokens
  de marca y las ilustraciones originales. El encuadre horizontal acerca al grupo
  sin sustituir la ilustración; el encuadre anterior sigue siendo el predeterminado
  para Destinos. No se agregaron datos comerciales ni fotografías sin autorización.
- Todo el módulo se renderiza en servidor. CSS Grid muestra dos columnas desde
  600 px y una en pantallas menores; no se añade JavaScript ni dependencias.
  Los estados hover son suaves y se desactivan con movimiento reducido.
- La variante Inicio contiene actualmente 44 palabras visibles. La revisión
  responsive cubre 320, 390, 600, 768, 1024, 1440 y 1920 px. Las capturas de
  comparación se guardan en `output/playwright/graduates-before-*.png` y
  `output/playwright/graduates-after-*.png`.

Patrones reutilizados: [CSS Grid nativo](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Common_grid_layouts)
y [enlaces con propósito explícito](https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context).
El criterio es mostrar primero la elección y dejar los detalles a un enlace de
distancia, sin esconder las dos alternativas detrás de un selector.

Validación de esta revisión: `npm run lint`, compilación de producción con
TypeScript mediante QA y 11 pruebas Playwright/Axe aprobadas. Se comprobaron
Inicio y Destinos, las consultas específicas, teclado y navegación sin JavaScript.
En las capturas comparables, el bloque pasó de 1987 a 1035 px de alto en escritorio
(viewport de 1440 px) y de 2538 a 1049 px en móvil (viewport de 390 px).

## Guía integrada en Destinos — 26/10/2026

El apartado ampliado reúne proceso, preguntas, respaldo y contacto dentro de una sola guía. Se conserva el selector de primaria/secundaria y el módulo de los ocho destinos.

- Tres pasos visibles: contar quiénes integran el grupo, conversar sobre el viaje y revisar la propuesta.
- La antigua pregunta sobre cómo empezar se integra al primer paso, conservando colegio, nivel, cantidad aproximada, año y la posibilidad de consultar sin tener todo definido.
- Las dudas sobre destinos/fechas y contratación conservan sus respuestas. La formación pasa a una pregunta sobre preparación y acompañamiento, junto a coordinación y asistencia paramédica para consultar por cada propuesta.
- La experiencia identifica a Javier Garay y comparte una franja compacta con oficina, legajo y enlace a la historia.
- El cierre ofrece una consulta principal para el grupo. Su mensaje conserva el nivel elegido mediante los radios nativos y CSS `:has()`, incluso sin JavaScript.
- El ancla `/destinos#egresados-preguntas` y el regreso a `#egresados` siguen disponibles.

Se reutilizan componentes de servidor, CSS Grid, `<details>/<summary>`, los datos institucionales y `whatsappUrl`. No se incorporan dependencias, medios ni estado de cliente. Las transiciones respetan `prefers-reduced-motion`.

Los cambios de esta revisión se limitan a `graduates-section.tsx`, `graduates.module.css`, los pasos/preguntas de `graduates/data.ts` y las pruebas de `graduates-guide.spec.ts`. El Home conserva su vista breve. Las capturas antes/después y comprobaciones de integridad están en `output/playwright/egresados-guide/`.

La primera comparación de imágenes del catálogo completo registra cero píxeles distintos a 375, 768 y 1440 px. La altura del apartado completo de Egresados pasa de 3406 a 2799 px en 375, de 2432 a 2076 px en 768 y de 2556 a 1907 px en 1440. Los números corresponden al estado inicial de los desplegables.

Validación final de esta revisión:

- `npm run lint`: exit 0.
- `npx tsc --noEmit --incremental false`: exit 0; también pasó el chequeo de TypeScript del build de producción aislado.
- `npm test -- --grep-invert 'referencia visual'`: build correcto, 95 pruebas aprobadas y siete fallos en `tests/site.spec.ts:13`, todos en Nosotros. La suite completa no está verde.
- Las cuatro pruebas nuevas de `graduates-guide.spec.ts` pasaron: controles por teclado, contenido desplegable, consulta que conserva primaria/secundaria, Axe a 375/768/1440 y funcionamiento sin JavaScript al 200%.
- Los siete fallos de Nosotros aparecen tras la conversión concurrente de esa página a capítulos/pestañas. El test exige que todas las imágenes estén cargadas aunque el panel del equipo esté oculto. Se verificó en navegador que las seis imágenes diferidas pendientes cargan al abrir «El equipo». La evidencia queda en `nosotros-concurrent-test-diagnosis.json`; los archivos y tests de ese trabajo se preservaron.
- Las 29 comparaciones visuales históricas, ya pendientes de actualización, no se reejecutaron. Sus hashes originales siguen intactos.
- Capturas finales de la guía y comparación antes/después del catálogo completo: cero píxeles distintos a 375, 768 y 1440 px. Sin overflow. Capturas del build de producción en `output/playwright/egresados-guide/after-*-guide.png`.
- `git diff --check` de los archivos de esta intervención: correcto. `next-env.d.ts` conserva exactamente sus bytes iniciales. No se añadieron paquetes, commits ni despliegues.

El resultado general de esta ejecución se conserva en `output/playwright/egresados-guide/functional-results.json`. Los cambios concurrentes detectados en Nosotros, sus capítulos, estilos globales y tests quedan separados en el informe de integridad; no forman parte de esta intervención.

## Centro de ayuda por categorías — 26/10/2026

Por indicación del usuario se usa FAQ 7 únicamente como inspiración conceptual: navegación por categorías y respuestas desplegables. La implementación es propia de Travel Days; no se descargó código de React Bits Pro, no requiere licencia y no añade dependencias. El intento inicial de instalación se detuvo al aclararse ese alcance. `components.json`, `package.json` y el lockfile conservan sus bytes iniciales.

La guía conserva su título, datos, respaldo y consulta por nivel. Los temas son Cómo empezar, Destinos y fechas, Antes de contratar y Acompañamiento. Las respuestas y los tres pasos se reutilizan sin añadir promesas o servicios incluidos.

`graduates-help-center.tsx` aporta una frontera de cliente pequeña para leer el hash, marcar `aria-current` y cambiar de categoría sin desplazar la página. El contenido se genera en servidor y se pasa como ReactNode. Cada tema tiene una URL directa y la selección responde a Atrás/Adelante. Los enlaces reales y CSS `:target` mantienen la navegación sin JavaScript; los detalles conservan controles HTML nativos. El menú es lateral en desktop/tablet y se acomoda en dos columnas en mobile.

Se conservan `#egresados-preguntas` y `#egresados`, el selector de primaria/secundaria y sus mensajes específicos. Las ocho cards y el Home quedan fuera de esta intervención.

Capturas, comparación del catálogo y resultados: `output/playwright/egresados-help-center/`. Las primeras comparaciones del catálogo completo a 375, 768 y 1440 px registran cero píxeles distintos.

Validación final del centro de ayuda:

- Lint y `tsc --noEmit --incremental false`: exit 0. Build de producción aislado y TypeScript: correctos.
- `npm test -- tests/graduates-guide.spec.ts tests/premium.spec.ts tests/home-lower.spec.ts tests/interactions.spec.ts tests/accessibility.spec.ts`: **26 passed, exit 0**, sin flaky. Es una ejecución enfocada; no se reejecutó toda la suite ni sus comparaciones históricas pendientes.
- Cobertura de la guía: cuatro categorías, navegación por teclado, conservación del scroll, enlaces directos, Atrás/Adelante, desplegables nativos, consulta según nivel, 200% de zoom y funcionamiento sin JavaScript.
- Axe: cero infracciones en los cuatro temas a 375, 768 y 1440 px. Sin overflow en los anchos comprobados.
- Capturas del build de producción: guía inicial a 375/768/1440 y estados de Destinos y Acompañamiento en desktop y mobile. El servidor de inspección usó el puerto 3212 y se cerró al terminar.
- Comparación del catálogo completo: cero píxeles distintos en los tres anchos. Los 29 hashes de referencias históricas siguen intactos.
- Hashes: ningún cambio inesperado en archivos preexistentes. Configuración de registries, paquetes, lockfile, estilos globales y `next-env.d.ts` permanecen iguales al estado inicial.
- No se creó una clave ni un archivo de entorno, ni se hizo commit, push o deploy.

Los resultados de esta ejecución se conservan en `output/playwright/egresados-help-center/test-results.json`. El siguiente paso es revisar el recorrido con el contenido real en el navegador local antes de consolidar la versión.
