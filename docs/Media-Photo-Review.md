# Travel Days — revisión fotográfica y distribución audiovisual

Auditoría local del 25/10/2026. Fuente: la carpeta original de contenido audiovisual dentro de src. Los originales se conservaron intactos. Este documento registra decisiones editoriales; no acredita derechos, edades ni autenticidad de documentos mediante análisis visual.

## Cobertura y método

[Media-Inventory.csv](Media-Inventory.csv) contiene **336 archivos**, una fila por original con ruta relativa exacta, ID, bytes y SHA-256: **167 imágenes, 167 videos y 2 PDF**. El conjunto original ocupa **1.718.139.557 bytes** (aprox. 1,72 GB decimales).

Se contrastó el inventario contra una nueva enumeración recursiva y se recalcularon los SHA-256 de los **336 originales**: coinciden todas las rutas, tamaños y hashes registrados.

Se inspeccionaron visualmente las 167 imágenes en siete hojas de contacto, con ampliaciones de las fotografías institucionales y casos sensibles. La clasificación usa contenido visible. Los nombres ayudan a localizar archivos, pero no prueban lugares ni edades.

Las imágenes se distribuyen en 108 horizontales, 57 verticales y 2 cuadradas. De las 130 fotos del evento, 92 son JPEG de 6000 × 4000 (24 MP); las otras 38 son tomas de teléfono o recortes. La resolución no garantiza una buena fotografía de hero: importan luz, composición y contenido. Las hojas de contacto permiten selección editorial; no equivalen a inspección de cada píxel a tamaño original.

Los videos se revisaron mediante cuatro fotogramas distribuidos por archivo: **668 muestras**, sin reproducción completa ni escucha. Son 154 verticales y 13 horizontales, con duración agregada de 1.855,19 s (30 min 55 s). La ausencia de personas en las muestras no certifica su ausencia en todo el clip. Ver [revisión de videos](Media-Video-Review.md) y [detalle por video](Media-Video-Inventory.csv).

Los dos PDF se renderizaron con PDFium al 150% y se revisaron visualmente. Se conservaron como respaldo privado. No se contrastó independientemente su emisor, autenticidad ni situación legal actual.

## Clasificación de las fotografías

| IDs | Cantidad | Contenido visible | Decisión |
|---|---:|---|---|
| P008–P137 | 130 | Fiesta Maestrazo/Día del Maestro: grupos, pista, animación, micrófonos y local decorado | Reserva privada. No son prueba de viajes de Egresados. Faltan permisos de asistentes. |
| P001, P006, P007, P141, P142, P146, P147 | 7 | Retratos individuales y un retrato con terceros | Cuatro retratos individuales públicos; tres casos pendientes o bloqueados. |
| P138–P140 | 3 | Fachada e interiores de oficina | P140 seleccionado; P139 reserva; P138 pendiente por cartelería comercial. |
| P002–P005, P143–P145, P162–P163, P165–P167 | 12 | Flyers comerciales con fotografías insertadas y datos de venta | Archivo privado hasta validar contenido y derechos. No extraer imágenes de fondo. |
| P148–P159 | 12 | Variantes del logotipo | Conservar identidad existente; no sustituir por variantes arbitrarias. |
| P160–P161 | 2 | Franjas de contacto con teléfono y redes | No usar: teléfono diferente del configurado en la web. |
| P164 | 1 | Promoción institucional sobre recepción de turismo chino | Verificar afirmación, contexto y autorización. No añadir esa afirmación al sitio. |
| **Total** | **167** | | |

Cada imagen figura individualmente en el CSV con contenido visible, calidad, módulo, estado y motivo. Los PDF llevan IDs D001/D002; sus nombres exactos se conservan en la columna path.

## Selección principal

La selección pública se limita a **cinco originales** que aportan confianza y contexto institucional. El usuario confirmó expresamente permiso web para los retratos individuales del equipo en esta sesión. Esa autorización no se extendió a pasajeros ni a terceros visibles.

| ID | Valor visual y narrativo | Ubicación | Tratamiento |
|---|---|---|---|
| P140 | Oficina vacía, escritorios, sillas, pared azul y logo; permite reconocer un lugar real de atención | /nosotros, hero institucional, slot page:nosotros | WebP con encuadres desktop/mobile centrados en marca y atención. Prioridad alta por estar al inicio. |
| P142 | Javier con indumentaria Travel Days; rostro y logo aportan identidad personal | /nosotros, propietario, slot team:javier-garay | Retrato 4:5 de mayor tamaño, hasta 240 px en layout. Carga diferida. |
| P006 | Daiana, figura separada del fondo | /nosotros, administración, slot team:daiana-dascon | Retrato optimizado presentado como avatar circular. Carga diferida. |
| P001 | Azul con indumentaria paramédica visible, vinculada a su función | /nosotros, asistencia, slot team:azul-barrera | Fuente de 708 × 740; evitar ampliación. Avatar con foco facial. Carga diferida. |
| P147 | Karoll en exterior, rostro legible y fondo verde | /nosotros, coordinación, slot team:karoll-tello | Fuente de 740 × 777; uso pequeño con foco facial. Carga diferida. |

Son retratos personales reales, con estilos de toma y luz diferentes. Se unifican mediante encuadre y tamaño de presentación, sin inventar una sesión fotográfica homogénea ni sustituir caras o fondos mediante generación.

P140 reemplaza la ilustración de oficina únicamente cuando el manifiesto resuelve un recurso aprobado. Los perfiles sin retrato publicable conservan sus iniciales y su información aprobada.

## Reservas y casos que requieren revisión

| IDs | Hallazgo | Acción pendiente |
|---|---|---|
| P139 | Sala de espera vacía, piso de madera, mapa y marca; buena alternativa institucional | Copias privadas optimizadas. Usar solo si aporta una escena distinta a P140. |
| P138 | Fachada reconocible, pero vidriera con fechas y precios impresos | Validar cartelería o pedir una toma limpia. Copias privadas; no publicar ofertas visibles sin revisar. |
| P141 | Retrato de Ezequiel con apariencia juvenil | Confirmar mayoría de edad al momento de la toma. No inferirla por cargo o apariencia. Copias privadas. |
| P146 | Jorge junto a una niña; más menores/personas al fondo | Bloqueado por terceros y menores. El permiso de retrato individual no cubre esta escena. Solicitar un retrato individual nuevo. |
| P007 | Retrato de DJ Mosca | No figura entre los perfiles institucionales aprobados. Confirmar identidad, función y autorización antes de incorporarlo. Copias privadas. |
| P036–P037 | Niño claramente visible con una persona adulta en el local | No publicar. Requiere autorización específica y verificación humana de alcance. |
| P008–P137 restantes | Personas identificables; no se certifica mayoría de edad de todos por apariencia | Mantener las 130 fotos del evento privadas hasta permisos y contexto. No convertirlas automáticamente en material de Egresados. |
| Doce flyers de la tabla anterior | Fechas, precios y condiciones incrustados; fotografías insertadas | Validar cada campaña. No transcribir ofertas ni reciclar fondos como fotos independientes de destino. |
| P160–P161 | Contacto impreso distinto al actual | No reutilizar. La configuración vigente sigue siendo la fuente de contacto. |
| P164 | Afirmación institucional promocional | Verificar antes de integrar; no se añade al relato actual. |

P021 (grupo posando), P046 (vista general) y P059 (grupo frente al escenario) son una **preselección editorial privada** para experiencias. Aportan variedad de escala y encuadre, pero tienen flash, fondos oscuros y permisos pendientes. No se publicaron ni se abrió una galería para ellas.

D001 muestra un certificado de Nivel Bronce otorgado a Travel Days, con vigencia impresa Ago-2026 a Jul-2028 y logos FAEVYT/SECTUR. D002 muestra Travel Days, OLIZHAY SAS y Legajo 18904 en un documento RNAV. Son apoyo documental aportado por la agencia, sin verificación independiente ni autorización automática para difundir el PDF.

## Duplicados y calidad

- **Duplicados binarios: 0**, según SHA-256 de los 336 originales.
- **Candidatos de similitud: 16 pares**, según dHash en imágenes. Se conservan las parejas y distancias en el CSV y en output/media-audit/duplicates.json. Un dHash igual o próximo no prueba que dos archivos sean idénticos.
- La revisión visual encuentra secuencias cercanas en P008–P010, P015–P016, P019–P020, P030–P031, P034–P035, P036–P037, P038–P041, P044–P045, P046–P049 y P057–P058. P059/P070 son tomas cercanas del grupo; P061–P068 documentan instantes similares de la pista.
- P100–P137 incluyen series móviles y pares de original/edición. Los candidatos concretos son P101/P116, P102/P117, P103/P118, P104/P119, P105/P120, P106/P121, P107/P122, P108/P123, P109/P124, P110/P125, P111/P126, P112/P127, P113/P128 y P114/P129. P115/P130 presentan recortes distintos. Esto no convierte a toda la serie en un único duplicado.
- El flash ilumina rostros pero deja fondos oscuros y produce cambios de exposición/color. La cantidad de píxeles permite derivados pequeños; no resuelve composición, iluminación ni autorización.
- No hay una fotografía paisajística independiente, suficientemente contextualizada, que justifique reemplazar ahora el hero de Inicio o llenar las tarjetas de destinos. Los flyers y fiestas no resuelven esa carencia.

No se borraron originales ni variantes parecidas. La selección evita publicar una ráfaga completa y permite elegir un solo encuadre cuando se obtengan permisos.

## Mapa recomendado por página y módulo

| Página / módulo | Decisión actual | Próximo material útil |
|---|---|---|
| Inicio / hero | Mantener paisaje ilustrado: ninguna toma acredita un paisaje turístico apropiado | Foto horizontal real, limpia, con evidencia del lugar y recorte móvil revisado. |
| Inicio / destinos | Conservar fallback donde no exista imagen inequívoca y autorizada | Originales de cada lugar; no extraer imágenes de flyers. |
| /destinos / nacionales e internacionales | Igual criterio por slot destination:slug; no asociar una playa genérica a Brasil, Caribe o Bayahibe | Original, contexto del lugar, autor y permiso. |
| /destinos / receptivo Los Túneles | El flyer P166 no se usa como foto del destino | Foto original del recorrido con evidencia geográfica. |
| Egresados en Inicio y Destinos | Sin integración audiovisual; se preservan módulos de trabajo simultáneo | Material identificado como viaje estudiantil, permisos de todos los identificables y autorización específica para menores. |
| /nosotros / hero | P140, oficina real | P139 solo como alternativa, sin repetir función narrativa. |
| /nosotros / historia y respaldo | Oficina y retrato del propietario aportan confianza; documentos privados | Foto histórica contextualizada o acreditación preparada para difusión si es necesaria. |
| /nosotros / equipo | P142, P006, P001, P147 | Retratos individuales autorizados de los restantes integrantes; resolver P141. |
| /contacto / ubicación | Sin imagen añadida; mantener contacto y formularios claros | Fachada limpia, sin ofertas dudosas ni terceros, si mejora reconocimiento del local. |
| Experiencias / eventual galería | No se crea galería solo para ocupar espacio | Pocas escenas complementarias tras permisos; P021, P046 y P059 quedan en reserva. |
| Video institucional/experiencias | Ningún video público | V068/V069 son reservas fuertes de grupo y marca; V065/V084 de actividad, sujetos a permisos, identificación y revisión completa. |

No existe una página independiente de receptivo: está representado mediante Los Túneles en el catálogo y el relato de la agencia. No se crean rutas o módulos para acomodar material sin función clara.

## Recursos derivados

Se generaron **32 derivados de imagen**: **15 públicos** de cinco fuentes y **17 privados** de siete fuentes.

- Públicos: public/media/travel-days/office/ y public/media/travel-days/team/.
- Reservas: output/media-audit/review-optimized/office/, team/ y experiences/.
- Cada ruta, dimensiones, peso y estado están unidos al original en la columna optimized_resources del inventario.
- Las copias públicas son WebP, con variantes desktop/mobile/small y metadatos personales eliminados. Pesan conjuntamente **372.042 bytes**. No equivalen al peso descargado por página: Next selecciona/genera el recurso según sizes y viewport.
- P140 final: desktop 1000 × 1250, mobile 1280 × 960 y small 640 × 480. Su encuadre sigue las proporciones del módulo en cada pantalla.
- P001, P006 y P147 finales: recortes cuadrados de rostro y hombros para evitar cortar la frente en el avatar circular. Desktop: Azul 528 × 528, Daiana 600 × 600 y Karoll 480 × 480; mobile 320 × 320 y small 160 × 160. Javier conserva el retrato 4:5.
- Las reservas privadas suman **1.158.930 bytes**. Prepararlas no constituye aprobación.
- Los originales elegidos para publicación suman **2.443.469 bytes**; permanecen separados y no se importan al frontend.
- Los 167 videos originales permanecen privados. La muestra de cuatro fotogramas no aprueba reproducción completa ni audio.

El manifiesto tipado registra procedencia, evidencia, alt y focos; el resolver de servidor entrega solo datos de presentación. Los recursos secundarios mantienen lazy loading y el hero institucional prioriza su imagen. La integración no agrega dependencias de galería ni servicios externos.

## Límite de esta revisión

La auditoría no determina jurídicamente permisos ni edades, no identifica destinos sin evidencia y no valida comercialmente flyers. Los videos requieren revisión de principio a fin, audio y derechos antes de edición pública. Los resultados de navegación, accesibilidad, build y encuadres renderizados se registran en [el informe de implementación](Media-Audit.md); no se dan por aprobados en este inventario.
