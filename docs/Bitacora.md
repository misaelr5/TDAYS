# Bitácora · migración Travel Days

## 25/10/2026 · etapas 2–5

La etapa 1 fue aceptada y no se repitió. Se mantuvo RECREAR como aplicación
definitiva y TravelDays original como fuente de sólo lectura.

- Etapa 2: manifiesto tipado, resolver en servidor, controles de rutas/archivos,
  variantes/focos, verificador previo al build y fallback idéntico. Ocho pruebas de
  medios y 29 referencias visuales aprobadas antes de ampliar el contenido.
- Etapa 3: narrativa institucional autorizada, perfiles pendientes ocultos,
  descripciones del catálogo y campos comerciales opcionales; validación accesible
  de formularios y Unicode. Doce pruebas focalizadas aprobadas.
- Etapa 4: metadata/Open Graph/Twitter por ruta, semántica, menú sin JS y reflow de
  Contacto. Matriz responsive y Axe aprobados; nueve pruebas focalizadas finales
  de accesibilidad/interacción aprobadas.
- Etapa 5: referencias protegidas por SHA-256, capturas reales y diferencias de las
  páginas ampliadas, comparación de composición previa mediante DOM temporal de
  prueba, revisión visual móvil/desktop y validación integrada: 96/96 pruebas,
  lint, tipos, medios y build aprobados. Axe sin infracciones en los controles
  ejecutados; npm audit sin vulnerabilidades conocidas. Los 849 hashes del
  original, su estado Git, HEAD y remotos se conservaron.

El usuario confirmó conservar las eliminaciones de los rótulos del Hero y de
Ubicación como cambio visual intencional. No se restauraron en la aplicación.
Las capturas originales no se modificaron.

No se incorporaron medios nuevos, dependencias adicionales a las de QA de la etapa
1, backend ni datos comerciales nuevos. No hubo commit, push o deploy.

Resultados y límites: [informe de cierre](Migracion-Etapas-2-5.md).

## 25/10/2026 · nuevo hero de luz y sombras

El usuario eligió una versión propia inspirada en Hero 28, sin instalar React Bits
Pro. Se creó la escena SVG/CSS, selector accesible de cuatro destinos, consultas
con contenido existente y fallback sin JS. Se conservaron navbar y tokens de marca.
Sin dependencias nuevas, fotografías, commit, push o deploy.

Lint, tipos, medios, build y 15 pruebas enfocadas aprobadas. Capturas reales en
siete anchos y revisión visual de 390/1440 px. Las 29 referencias originales siguen
intactas; Home tiene un diseño nuevo intencional. Se preservaron cambios concurrentes
del reel, cuya validación global queda separada. [Detalle y evidencias](Hero-Luz.md).

### Hero inmersivo y navbar

Por pedido del usuario se retiraron márgenes, marco y esquinas del hero, que ahora
cubre como mínimo el viewport y empieza detrás de la navbar. La cabecera es fija y
transparente arriba; recupera su fondo al superar 60 px de scroll y vuelve a ser
transparente al regresar. Se mantienen cabeceras sólidas en rutas interiores.
Se verificaron siete anchos, pantalla completa y el ciclo de transparencia/scroll.
Build con tipos y medios, lint y diez pruebas enfocadas aprobadas. Axe sobre hero
y cabecera sin infracciones detectadas; referencias originales intactas.
