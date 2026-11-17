# Serveis

Aquest document explica els serveis de l'aplicació: com es comuniquen amb l'API local, com gestionen els estats de càrrega i d'error, com es reintenta l'última consulta i on es fa servir `switchMap`.

## Serveis creats

| Servei | Fitxer | Responsabilitat |
| --- | --- | --- |
| `VideoGameService` | `src/app/services/video-game.service.ts` | Peticions GET i POST a l'API, adaptació de les respostes, estats de càrrega i d'error, reintent i flux de cerca. |
| `VideoGameSearchHistoryService` | `src/app/services/video-game-search-history.service.ts` | Historial de cerques a `localStorage` (detall a [formularis.md](formularis.md)). |

Els dos es creen amb `@Service()` i totes les pantalles veuen les mateixes dades.

## HttpClient i URL base

- `VideoGameService` injecta `HttpClient` amb `inject(HttpClient)`. No s'ha configurat `provideHttpClient()`: a Angular 22 `HttpClient` està disponible per defecte i el projecte no fa servir interceptors.
- La URL base (`http://localhost:4302`) és a `src/environments/environment.ts`, propietat `apiBaseUrl`. El servei la llegeix i hi afegeix el recurs: `http://localhost:4302/videoGames`.
- Cap component construeix URL ni fa peticions: només criden mètodes dels serveis.

## Peticions a l'API

| Mètode | Petició | Què retorna |
| --- | --- | --- |
| `getVideoGamesByCriteria(videoGameSearchCriteria)` | `GET http://localhost:4302/videoGames`, sense paràmetres | Els videojocs ja adaptats que compleixen els criteris. |
| `addVideoGame(newVideoGame)` | `POST http://localhost:4302/videoGames` | El videojoc creat, ja adaptat, amb l'`id` que posa `json-server`. |

**GET.** La resposta passa per `adaptApiVideoGame` i després es filtra al servei:

- categoria: `''` vol dir totes i si no, la categoria normalitzada ha de ser igual;
- text: sense distingir majúscules (`toLocaleLowerCase('ca')`), dins del títol o de la descripció i un text buit no filtra.

El filtre es fa després d'adaptar perquè l'API envia les categories escrites de maneres diferents ("PLATAFORMES", "Puzles", "Acció ", "aventura"), i només es poden comparar un cop normalitzades.

`getVideoGamesByCriteria` és públic perquè també el fa servir el validador asíncron del formulari de cerca.

**POST.** `adaptNewVideoGameToApi` passa el videojoc nou al format de l'API: la valoració passa de número a text amb coma decimal (o `""` si no n'hi ha) i s'afegeix com a no destacat. La resposta passa per `adaptApiVideoGame`. Quan acaba bé, el servei torna a carregar l'última consulta (`reloadVideoGames`), de manera que la llista es refresca sola. Es subscriu el formulari d'alta, que mostra l'estat de l'enviament.

## Flux de cerca amb switchMap

Tres mètodes públics alimenten el flux, cap fa la petició directament, posen uns criteris al `Subject` privat `videoGameSearchCriteria$`.

| Mètode | Criteris que envia | Qui el crida |
| --- | --- | --- |
| `loadVideoGames()` | Criteris buits (tots els videojocs) | La pàgina, en arrencar |
| `loadVideoGamesByCriteria(videoGameSearchCriteria)` | Els criteris rebuts | La pàgina, quan el formulari de cerca envia, neteja o recupera una cerca |
| `reloadVideoGames()` | Els últims criteris | El botó "Reintentar" i el refresc després d'un POST |

El `Subject` té una sola subscripció, al constructor de `VideoGameService`.

Cada criteri passa per:

1. `tap`: desa els criteris com a últims, buida la llista i posa l'estat a `'loading'`.
2. `switchMap`: converteix els criteris en la petició `getVideoGamesByCriteria`. Si arriben criteris nous abans que acabi, la petició anterior es cancel·la i només compta l'última cerca.
3. `catchError`, dins del `switchMap`: gestiona l'error.
4. Subscripció: desa la llista rebuda i posa l'estat a `'success'`.

## Estat de càrrega

| Senyal | Tipus | Valors |
| --- | --- | --- |
| `videoGames` | `VideoGame[]` | La llista de l'última consulta (buida mentre carrega o si falla). |
| `videoGameListStatus` | `RequestStatus` | `'initial'`, `'loading'`, `'success'` o `'error'`. |

Tots dos són de només lectura fora del servei (`asReadonly()`). La pàgina els mostra així:

- `'loading'`: "Carregant els videojocs..." en un paràgraf amb `role="status"`;
- `'success'`: "Videojocs trobats: N." (N és el nombre de videojocs de la llista) i la llista o "Cap videojoc coincideix amb la cerca." si no n'hi ha cap;
- la llista només existeix amb `'success'`.

## Estat d'error

El `catchError` és dins del `switchMap`. Quan la petició falla:

- escriu a la consola `Error carregant els videojocs:` seguit de l'error;
- posa l'estat a `'error'`;
- retorna `EMPTY`: no arriba cap llista falsa i el flux continua viu per a la cerca següent.

Si el `catchError` fos fora del `switchMap`, el primer error tancaria el flux i les cerques següents no farien res, sense cap avís.

La pàgina mostra un banner amb el text "No s'han pogut carregar els videojocs." (`role="alert"`) i el botó "Reintentar".

## Reintent de l'última consulta

El `tap` desa cada criteri que arriba a `lastVideoGameSearchCriteria` i `reloadVideoGames()` el torna a posar al flux. El botó "Reintentar" crida `reloadVideoGames()`: repeteix exactament l'última cerca, no la llista completa.

Exemple: amb l'API aturada es cerca "Red" amb la categoria Aventura i surt el banner. S'arrenca l'API i es prem "Reintentar": torna a sortir Red Dead Redemption 2 ("Videojocs trobats: 1."), no tots els videojocs.

Ni el reintent ni el refresc després d'un POST es desen a l'historial de cerques.

## Qui fa servir els serveis

| Qui | Servei | Què en fa servir |
| --- | --- | --- |
| `VideoGamePageComponent` (`src/app/pages/video-game-page/`) | `VideoGameService` | `videoGames`, `videoGameListStatus`, `loadVideoGames`, `loadVideoGamesByCriteria`, `reloadVideoGames` |
| `VideoGamePageComponent` | `VideoGameSearchHistoryService` | `savedVideoGameSearches`, `addSavedVideoGameSearch`, `clearSavedVideoGameSearches` |
| `VideoGameFormComponent` | `VideoGameService` | `addVideoGame` |
| `matchingVideoGameExistsValidator` (el rep `VideoGameSearchFormComponent`) | `VideoGameService` | `getVideoGamesByCriteria` |
