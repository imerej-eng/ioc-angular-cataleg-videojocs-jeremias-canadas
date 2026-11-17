# Formularis

L'aplicació té dos formularis reactius (`ReactiveFormsModule`). Cadascun és en un component propi que avisa la pàgina amb un `@Output`. Tots dos es creen amb `NonNullableFormBuilder`, de manera que en netejar-los cada camp torna al seu valor inicial.

## Formularis creats

| Formulari | Fitxer | Què fa |
| --- | --- | --- |
| `VideoGameSearchFormComponent` | `src/app/components/video-game-search-form/video-game-search-form.component.ts` | Cerca per text i categoria, amb validació síncrona i asíncrona, botó "Netejar" i historial de cerques. |
| `VideoGameFormComponent` | `src/app/components/video-game-form/video-game-form.component.ts` | Alta d'un videojoc nou, que s'envia amb POST. |

La plantilla i els estils de cada formulari són a la mateixa carpeta. Tots dos els fa servir la pàgina `src/app/pages/video-game-page/`.

## Formulari de cerca

### Fitxer i sortides

`VideoGameSearchFormComponent` emet els criteris amb l'`@Output` `videoGameSearchCriteriaSubmitted`, i la pàgina els passa a `VideoGameService`. També rep l'historial amb l'`@Input` `savedVideoGameSearches` i avisa amb `savedVideoGameSearchesCleared` quan es vol esborrar.

### Camps i validadors síncrons

| Camp | Control | Validadors | Missatge d'error |
| --- | --- | --- | --- |
| Text de cerca (`searchText`) | `input type="search"`, opcional | `trimmedMinLengthValidator(3)` (`src/app/validators/common.validators.ts`): mínim 3 caràcters sense comptar els espais dels extrems. Si es deixa buit, no es filtra per text. | "El text de cerca ha de tenir com a mínim 3 caràcters." |
| Categoria (`category`) | `select` | Cap. Les opcions surten de `VIDEO_GAME_CATEGORIES`; "Totes les categories" val `''`. | (cap) |

### Validador asíncron

- Fitxer: `src/app/validators/video-game-search.validators.ts`.
- Funció: `matchingVideoGameExistsValidator(videoGameService, debounceMs)`.
- Comprova si el text de cerca, retallat, té resultats a tot el catàleg de videojocs. Crida `VideoGameService.getVideoGamesByCriteria` amb aquest text i totes les categories, el mateix filtre que fa servir la cerca.
- Si la llista arriba buida, dona l'error `matchingVideoGameExists` i es mostra "Cap videojoc coincideix amb aquest text.".
- Només s'executa si el validador síncron passa i el text no és buit.
- Mentre comprova, es mostra "Comprovant si hi ha resultats..." en un paràgraf amb `role="status"`.
- Si la consulta falla, escriu a la consola `Error comprovant si el text de cerca té resultats:` seguit de l'error, i deixa el camp vàlid. La cerca mostrarà després el banner d'error.
- Comprova el text a tot el catàleg de videojocs, no la combinació amb la categoria: un text vàlid amb una categoria pot donar 0 resultats.

### Debounce

400 ms (constant `videoGameSearchTextDebounceMs`). El validador espera amb `timer(400)` i després fa la consulta amb `switchMap`. Cada canvi del text cancel·la la comprovació anterior, també l'espera, de manera que la petició només surt quan passen 400 ms sense escriure. No es fa servir `debounceTime`: dins d'un validador asíncron no espera, perquè cada comprovació rep un sol valor.

### Missatges d'error

- Només es mostren quan el camp s'ha tocat i és invàlid (mètode `isTouchedAndInvalid`).
- Van dins d'un contenidor amb `role="alert"`.
- El camp té `aria-invalid` amb la mateixa condició, i `aria-describedby` amb l'ajuda, l'estat i els errors.

### Cercar, Netejar i recuperar

- **Cercar**: si el formulari no és vàlid (també mentre es comprova), marca els camps com a tocats i no emet res. Si és vàlid, emet els criteris amb el text retallat. No buida el formulari.
- **Netejar**: buida el formulari i emet els criteris buits; la llista torna a tots els videojocs.
- **Recuperar** una cerca de l'historial: la posa al formulari i l'emet directament.

## Historial de cerques

### On es desa

`VideoGameSearchHistoryService` (`src/app/services/video-game-search-history.service.ts`). Cada element és una `SavedVideoGameSearch` (`src/app/models/saved-video-game-search.model.ts`): els criteris més `savedAt`, l'instant en què es va desar en format ISO.

### Quines cerques es desen

- La pàgina desa cada cerca que envia el formulari, abans de carregar-la.
- Les cerques sense text no es desen, "Netejar", "Reintentar" i el refresc després d'un POST tampoc.
- Es guarden com a màxim 5 cerques, la més nova primer.

### Duplicats consecutius

La cerca nova es compara amb la primera de l'historial, que és l'última desada. Si el text és el mateix sense distingir majúscules (`toLocaleLowerCase('ca')`) i la categoria és la mateixa, no es desa.

### Clau de localStorage

`video-game-catalog.saved-video-game-searches`. El valor és la llista en format JSON.

### try/catch

Els dos mètodes privats que fan servir `localStorage` tenen `try/catch`:

- `readSavedVideoGameSearches()`: `getItem`, `JSON.parse` i comprovació de cada element amb validacions de tipus (un element mal format es descarta). Si falla, escriu `Error llegint l'historial de cerques:` a la consola i l'historial queda buit.
- `writeSavedVideoGameSearches()`: `JSON.stringify` i `setItem`. Si falla, escriu `Error desant l'historial de cerques:`, l'historial es continua veient, però no es conserva en recarregar.

### A la interfície

- Títol "Cerques recents" i un botó per cada cerca, amb el text i la categoria; per exemple, `"Red" · Aventura` o `"Zelda" · Totes les categories`. En fer-hi clic es recupera la cerca.
- Sense cerques: "Encara no hi ha cerques desades.".
- El botó "Esborrar l'historial" el buida i està deshabilitat quan no hi ha cap cerca.

## Formulari d'alta

### Fitxer i sortida

`VideoGameFormComponent` envia el videojoc amb `VideoGameService.addVideoGame` i, quan l'API respon, emet el videojoc creat amb l'`@Output` `videoGameCreated`. La pàgina el mostra: `Videojoc desat. Codi: ... Títol: "...".`

### Camps i validadors

| Camp | Control | Validadors |
| --- | --- | --- |
| Títol (`title`) | `input type="text"`, obligatori | `Validators.required`, `notBlankValidator`, `trimmedMinLengthValidator(2)` |
| Descripció (`description`) | `textarea`, obligatori | `Validators.required`, `notBlankValidator`, `Validators.maxLength(300)` |
| Categoria (`category`) | `select`, obligatori | `Validators.required`; opcions de `VIDEO_GAME_CATEGORIES` |
| Plataforma (`platform`) | `input type="text"`, obligatori | `Validators.required`, `notBlankValidator`, `trimmedMinLengthValidator(2)` |
| Data de llançament (`releaseOn`) | `input type="date"`, obligatori | `Validators.required` |
| Valoració (`rating`) | `input type="number"`, opcional | `Validators.min(0)`, `Validators.max(5)`, si es deixa buida, s'envia com a `null` |

Els validadors propis són a `src/app/validators/common.validators.ts`.

### Enviament

- Si el formulari no és vàlid, marca els camps com a tocats i no envia res.
- Si és vàlid, construeix el videojoc nou amb els textos retallats i l'envia. Mentre espera, mostra "Desant el videojoc..." (`role="status"`) i el formulari queda deshabilitat, de manera que no es pot enviar dues vegades.
- Si va bé: torna a habilitar el formulari, emet el videojoc creat, posa el focus al títol i el buida.
- Si falla: torna a habilitar el formulari, escriu `Error desant el videojoc:` a la consola, mostra "No s'ha pogut desar el videojoc. Torna-ho a provar." (`role="alert"`) i conserva el que s'ha escrit.

## Accessibilitat comuna

- Cada camp té un `label` associat amb `for` i `id`.
- Els camps obligatoris tenen l'atribut `required`.
- Ajudes i errors enllaçats amb `aria-describedby`; `aria-invalid` amb la mateixa condició que els missatges.
- Errors amb `role="alert"` i estats amb `role="status"`.
- Els botons que no envien són `type="button"`.
