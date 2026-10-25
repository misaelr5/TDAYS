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
