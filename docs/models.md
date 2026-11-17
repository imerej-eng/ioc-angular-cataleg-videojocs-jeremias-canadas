# Models i adaptador

Aquest document explica com es transformen els videojocs que envia l'API local (`json-server`) al model intern que fa servir l'aplicació, i com es preparen els videojocs nous per enviar-los amb POST.

## Fitxers

- Model de la resposta de l'API: `src/app/adapters/types/api-video-game.type.ts` (`ApiVideoGame`).
- Tipus del sí/no de l'API: `src/app/adapters/types/api-binary-flag.type.ts` (`ApiBinaryFlag`: 1 = sí, 0 = no).
- Model intern: `src/app/models/video-game.model.ts` (`VideoGame` i `NewVideoGame`).
- Categoria videojocs del catàleg: `src/app/models/video-game-category.model.ts` (`VideoGameCategory` i la llista `VIDEO_GAME_CATEGORIES`).
- Criteris de cerca: `src/app/models/video-game-search-criteria.model.ts` (`VideoGameSearchCriteria`).
- Cerca desada a l'historial: `src/app/models/saved-video-game-search.model.ts` (`SavedVideoGameSearch`: els criteris més l'instant `savedAt`; vegeu [formularis.md](formularis.md)).
- Estat d'una petició: `src/app/models/request-status.model.ts` (`RequestStatus`; detall a [serveis.md](serveis.md)).
- Adaptador: `src/app/adapters/video-game.adapter.ts` (funcions `adaptApiVideoGame` i `adaptNewVideoGameToApi`).
- Test de l'adaptador: `src/app/adapters/video-game.adapter.spec.ts` (una comprovació per cada acció de normalització).

## Model de l'API i model intern

El model de l'API descriu exactament el JSON que arriba de `GET http://localhost:4302/videoGames`: noms en snake_case i valors sense convertir (la valoració arriba com a text i amb coma decimal, la categoria és text lliure i `is_featured` pot faltar).

El model intern és el que fan servir el servei i els components. Té noms en camelCase i tipus ja convertits:

- `id`: text.
- `title`: text sense espais als extrems.
- `description`: text sense espais als extrems.
- `category`: una de les categories del catàleg o `null` si l'API n'envia un que no és a la llista.
- `platform`: text sense espais als extrems.
- `releaseOn`: data de llançament en format AAAA-MM-DD.
- `rating`: valoració sobre 5 o `null` si encara no en té.
- `isFeatured`: si és destacat (sí/no). És el camp booleà opcional: a l'API si falta, l'adaptador hi aplica `false`.

Cap component ni plantilla importa res de `src/app/adapters/`, només coneixen el model intern.

## Taula de mapatge API -> model intern

| Camp API | Camp intern | Transformació |
|---|---|---|
| `id` | `id` | Es copia tal qual. |
| `title` | `title` | `trim()`. |
| `description` | `description` | `trim()`|
| `category` | `category` | `trim()` i minúscules (català), cada valor de la llista i les variants sense accent que arriben (`"estrategia"`, `"simulacio"`) es tradueixen a la seva categoria, qualsevol altre text és null. |
| `platform` | `platform` | `trim()`. |
| `release_date` | `releaseOn` | Es reanomena; es manté el format AAAA-MM-DD. |
| `rating` | `rating` | Coma decimal a punt, text a número i si el resultat és NaN, `null`. |
| `is_featured` (opcional) | `isFeatured` | `1` passa a ser `true`, `0` passa a ser `false` i si falta, `false`. |

## Accions de normalització

L'adaptador aplica cinc de les accions demanades:

- Netejar espais amb `trim()`: títol, descripció i plataforma.
- Convertir valors numèrics amb seguretat: valoració (coma decimal, comprovació que el resultat és un nombre vàlid).
- Aplicar valors per defecte si falta un camp opcional: `isFeatured` és `false` quan falta `is_featured`.
- Normalitzar categories: la categoria passa a un valor de la llista o `null`.
- Substituir textos buits: una valoració buida passa a `null`.

L'adaptador no inventa dades: un valor que no es pot convertir queda com a `null`, i la plantilla mostra un text com "Sense categoria" o "Encara no en té.". Les dates no es transformen perquè l'API ja les envia en format AAAA-MM-DD.

## Videojoc nou (POST): model intern -> API

El formulari d'alta construeix un `NewVideoGame` (sense `id`). Abans d'enviar-lo, `adaptNewVideoGameToApi` el passa al format de l'API i l'`id` el posa `json-server`.

| Camp intern (`NewVideoGame`) | Camp API | Transformació |
|---|---|---|
| `title` | `title` | Es copia (el formulari ja l'ha retallat). |
| `description` | `description` | Es copia (el formulari ja l'ha retallat). |
| `category` | `category` | Es copia (sempre és una categoria de la llista). |
| `platform` | `platform` | Es copia (el formulari ja l'ha retallat). |
| `releaseOn` | `release_date` | Es reanomena. |
| `rating` | `rating` | Número a text amb coma decimal (`4.5` passa a `"4,5"`) i si és `null`, es passa `""`. |
| (no hi és) | `is_featured` | Sempre `0`: no és destacat. |

La resposta del POST torna a passar per `adaptApiVideoGame`: el que s'ha enviat torna normalitzat al mateix valor (per exemple, la valoració `""` torna com a `null`).

## On s'aplica l'adaptador

`VideoGameService` (`src/app/services/video-game.service.ts`):

- `adaptApiVideoGame` s'aplica a cada element dins del `pipe` del GET, abans de filtrar per criteris i de desar la llista.
- `adaptNewVideoGameToApi` prepara el cos del POST a `addVideoGame`, i `adaptApiVideoGame` adapta el videojoc creat que retorna l'API.

La interfície rep sempre videojocs ja adaptats.

## Exemples

| Videojoc | A l'API | Al model intern |
| --- | --- | --- |
| 4 | títol `"  Tetris"`, valoració `"4,7"`, `is_featured` 1 | títol `"Tetris"`, valoració 4.7, destacat |
| 5 | sense `is_featured` | no destacat |
| 12 | descripció `"  Simulador de vida on crees personatges, construeixes cases i controles les seves activitats del dia a dia."`, categoria `"simulacio"` | descripció `"Simulador de vida on crees personatges, construeixes cases i controles les seves activitats del dia a dia."`, categoria `"Simulació"` |
| 17 | valoració `""` | valoració `null` |
| Mario Kart World (POST) | s'envia `"rating": "4,5"`, `"category": "Curses"`, `"platform": "Nintendo Switch 2"` | torna valoració 4.5, categoria `"Curses"`, plataforma `"Nintendo Switch 2"` |
