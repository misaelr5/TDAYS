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
