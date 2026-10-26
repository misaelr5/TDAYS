# Fotografías de destinos · 26/10/2026

La sección «Tu próximo destino» y el catálogo `/destinos` reemplazan las
ilustraciones por fotografías reales de cada destino.

## Procedencia

El repositorio no contiene originales del cliente para estos destinos: los doce
archivos con nombres de destino son flyers comerciales con fotos sin procedencia
acreditada ([Media-Audit.md](Media-Audit.md)). Se usaron originales de Wikimedia
Commons con licencias que permiten uso comercial con atribución. Cada imagen se
verificó visualmente y por su página de descripción (autor, licencia y lugar).

| Destino | Archivo en Commons | Autor | Licencia | Lugar real |
| --- | --- | --- | --- | --- |
| Brasil | [Fernando De Noronha Insel Baia Do Sancho (125362991).jpeg](https://commons.wikimedia.org/wiki/File:Fernando_De_Noronha_Insel_Baia_Do_Sancho_(125362991).jpeg) | Dronepicr | [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) | Baía do Sancho, Fernando de Noronha |
| Caribe | [Grote Knip Curacao (34800917861).jpg](https://commons.wikimedia.org/wiki/File:Grote_Knip_Curacao_(34800917861).jpg) | dronepicr | [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/) | Grote Knip, Curaçao (mar Caribe) |
| Carnavales de Jujuy | [Carnaval de Humahuaca 2026 Humahuaca Jujuy, Argentina.jpg](https://commons.wikimedia.org/wiki/File:Carnaval_de_Humahuaca_2026_Humahuaca_Jujuy,_Argentina.jpg) | SanRoqueRemache | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | Monumento a los Héroes de la Independencia, Humahuaca |
| Cataratas del Iguazú | [Iguazú Falls 07.jpg](https://commons.wikimedia.org/wiki/File:Iguaz%C3%BA_Falls_07.jpg) | Bernard Gagnon | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | Cataratas del Iguazú (tomada desde el lado brasileño) |
| Los Túneles | [Tunel 5, Los Tuneles de Taninga, Cordoba.jpg](https://commons.wikimedia.org/wiki/File:Tunel_5,_Los_Tuneles_de_Taninga,_Cordoba.jpg) | AsterixCBA | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | Túnel 5, Los Túneles de Taninga |
| Festival de Jesús María | [Festival de la Doma y el Folklore Jesus María.jpg](https://commons.wikimedia.org/wiki/File:Festival_de_la_Doma_y_el_Folklore_Jesus_Mar%C3%ADa.jpg) | Maria Jose Malnis | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/) | Anfiteatro José Hernández, Jesús María |
| Bayahíbe | [2023 - Bayahíbe - 05.jpg](https://commons.wikimedia.org/wiki/File:2023_-_Bayah%C3%ADbe_-_05.jpg) | Oleg Yunakov | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | Bayahíbe, República Dominicana |
| Valeria del Mar | [Pasarela en valeriadelmar 02.jpg](https://commons.wikimedia.org/wiki/File:Pasarela_en_valeriadelmar_02.jpg) | Fernando Martello | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | Pasarela entre médanos, Valeria del Mar |

El texto alternativo de Caribe no nombra una isla: la tarjeta representa una
propuesta genérica del Caribe y no debe sugerir un destino concreto. Caribe y
Bayahíbe usan fotos de lugares y composiciones distintas.

## Cumplimiento de licencias

- La atribución es visible en «Créditos de las fotografías», al pie de la sección
  en Inicio y en `/destinos`, con enlace al original y a la licencia.
- Las copias en `public/media/destinations/` son recortes en WebP (lado mayor
  2000 px, calidad 78, sin EXIF/XMP/ICC). Para CC BY-SA, el recorte se distribuye
  bajo la misma licencia.
- Los datos viven en `src/config/media.ts` (`commons()`): procedencia, evidencia,
  crédito público y punto focal. Para sustituirlas basta con cambiar el slot
  `destination:slug`.

## Pendiente

- **Valeria del Mar**: Commons no tiene fotos verificables de la playa. La pasarela
  entre médanos es real, pero no muestra el mar. Conviene pedir al cliente un
  original propio de la playa.
- **Festival de Jesús María**: la toma nocturna incluye carteles de patrocinadores
  del festival. Es auténtica, pero conviene reemplazarla si el cliente tiene una
  foto propia.
- En general, pedir originales del cliente con permiso explícito para reemplazar
  progresivamente los recursos de terceros.
