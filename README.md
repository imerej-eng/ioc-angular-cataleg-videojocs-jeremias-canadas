# Nom de l'aplicació

Catàleg de Videojocs

## Autor/a

Jeremias Cañadas Oliva

## Descripció

Aplicació Angular que mostra un catàleg de videojocs carregat des d'una API local amb `json-server`. Permet cercar per text i per categoria amb validacions, desa les últimes cerques al navegador i permet afegir videojocs nous amb un formulari. De cada videojoc es mostra el títol, la descripció, la plataforma, la categoria, la data de llançament, la valoració i si està destacat.

## Versions utilitzades

- Node.js: v24.21.0
- npm: 11.19.0
- Angular CLI: 22.2.0
- Angular: 22.2.0
- TypeScript: 6.0 (`~6.0.2` a `package.json`)
- json-server: 1.0.0-beta.15 (dependència de desenvolupament, versió exacta)
- Vitest: 5 (`^5.0.0` a `package.json` i l'executa `ng test`)
- Git: 2.55.0.windows.5

## Com crear i executar el projecte

Per crear el projecte, executeu la comanda següent:

```bash
ng new ioc-angular-cataleg-videojocs-jeremias-canadas --routing --style=scss --ssr=false --standalone=true --file-name-style-guide=2016 --skip-git=true --package-manager=npm
```

Per instal·lar les dependències:

```bash
npm install
```

Per arrencar l'API local, en una primera terminal (s'atura amb Ctrl+C):

```bash
npm run api
```

Per arrencar Angular, en una segona terminal:

```bash
ng serve
```

Un cop arrencat, l'aplicació es pot consultar a http://localhost:4200/. Si l'API no està arrencada, l'aplicació mostra un missatge d'error amb el botó "Reintentar".

Per executar els tests:

```bash
npm test
```

Per compilar la versió de producció:

```bash
npm run build
```

## Branques

- `ra1-setup`: projecte base de l'EAC1.
- `ra2-components`: interfície amb components de l'EAC2. Parteix de l'estat final de `ra1-setup` (`git switch ra2-components` i `git merge ra1-setup`).
- `ra3-serveis`: API local, serveis HTTP, models, adaptador i formularis reactius de l'EAC3. Parteix de l'estat final de `ra2-components` (`git switch ra3-serveis` i `git merge ra2-components`).

## API local

- Servidor: `json-server`, instal·lat com a dependència de desenvolupament del projecte.
- Fitxer de dades: `tools/api/db.json`, col·lecció `videoGames` (17 videojocs inicials, més els que s'afegeixen amb POST).
- Script de `package.json`: `"api": "json-server tools/api/db.json --port 4302"`.
- URL base: http://localhost:4302, centralitzada a `src/environments/environment.ts` (propietat `apiBaseUrl`).
- Endpoint: http://localhost:4302/videoGames (GET per llegir els videojocs i POST per afegir-ne).

Les dades tenen el format de l'API (noms en snake_case, valoració amb coma decimal, categories escrites de maneres diferents): l'aplicació les normalitza amb un adaptador abans de mostrar-les. `json-server` desa al fitxer els videojocs afegits amb POST.

## Serveis

- `VideoGameService` (`src/app/services/video-game.service.ts`): GET i POST de videojocs amb `HttpClient`, respostes adaptades, estats de càrrega i d'error, reintent de l'última consulta i flux de cerca amb `switchMap`.
- `VideoGameSearchHistoryService` (`src/app/services/video-game-search-history.service.ts`): historial de les últimes cerques a `localStorage`, sense duplicats consecutius.

S'han creat amb:

```bash
ng generate service services/video-game --add-type-to-class-name --skip-tests
ng generate service services/video-game-search-history --add-type-to-class-name --skip-tests
```

Detall a [docs/serveis.md](docs/serveis.md).

## Formularis

- `VideoGameSearchFormComponent` (`src/app/components/video-game-search-form/`): formulari reactiu de cerca per text i categoria, amb validació síncrona de longitud mínima, validació asíncrona amb debounce, botó "Netejar" i historial de cerques recuperable.
- `VideoGameFormComponent` (`src/app/components/video-game-form/`): formulari reactiu d'alta que valida les dades i envia el videojoc nou amb POST.

Detall a [docs/formularis.md](docs/formularis.md).

## Models i adaptadors

- Model de l'API: `src/app/adapters/types/` (`ApiVideoGame`, `ApiBinaryFlag`).
- Model intern: `src/app/models/` (`VideoGame`, `NewVideoGame`, `VideoGameCategory` i `VIDEO_GAME_CATEGORIES`, `VideoGameSearchCriteria`, `SavedVideoGameSearch`, `RequestStatus`).
- Adaptador: `src/app/adapters/video-game.adapter.ts` (`adaptApiVideoGame` i `adaptNewVideoGameToApi`).
- Validadors: `src/app/validators/common.validators.ts` i `src/app/validators/video-game-search.validators.ts`.

Les interfícies s'han creat amb:

```bash
ng generate interface models/saved-video-game-search --type=model
ng generate interface models/video-game-search-criteria --type=model
ng generate interface models/video-game --type=model
ng generate interface adapters/types/api-video-game --type=type
```

Els àlies de tipus (`RequestStatus`, `VideoGameCategory` i `ApiBinaryFlag`), la llista `VIDEO_GAME_CATEGORIES`, l'adaptador, els validadors i `environment.ts` s'han creat a mà.

Taula de mapatge i accions de normalització a [docs/models.md](docs/models.md).

## Components i com crear-los

Tots són components standalone.

- `VideoGamePageComponent` (`src/app/pages/video-game-page/`): pàgina que carrega les dades i coordina els components.
- `VideoGameSearchFormComponent` (`src/app/components/video-game-search-form/`): formulari de cerca i historial.
- `VideoGameFormComponent` (`src/app/components/video-game-form/`): formulari d'alta.
- `VideoGameListComponent` (`src/app/components/video-game-list/`): llistat de videojocs.
- `VideoGameCardComponent` (`src/app/components/video-game-card/`): targeta de cada videojoc.
- `VideoGameDetailComponent` (`src/app/components/video-game-detail/`): panell de detall.
- `VideoGameTagComponent` (`src/app/components/video-game-tag/`): etiqueta de categoria i de destacat.

S'han creat amb:

```bash
ng generate component pages/video-game-page --add-type-to-class-name --skip-tests
ng generate component components/video-game-search-form --add-type-to-class-name --skip-tests
ng generate component components/video-game-form --add-type-to-class-name --skip-tests
ng generate component components/video-game-list --add-type-to-class-name --skip-tests
ng generate component components/video-game-card --add-type-to-class-name --skip-tests
ng generate component components/video-game-detail --add-type-to-class-name --skip-tests
ng generate component components/video-game-tag --add-type-to-class-name --skip-tests
```

## Tests

- `src/app/adapters/video-game.adapter.spec.ts`: test unitari amb Vitest de l'adaptador `adaptApiVideoGame`, amb un cas per cada acció de normalització de [docs/models.md](docs/models.md).
- S'ha eliminat `src/app/app.component.spec.ts`, generat per `ng new`: comprovava el títol inicial de la plantilla, que ja no existeix, i muntava tota l'aplicació, amb peticions a l'API.

Els tests s'executen amb:

```bash
npm test
```

## Documentació

- [docs/models.md](docs/models.md): models, adaptador i taula de mapatge API -> model intern.
- [docs/serveis.md](docs/serveis.md): serveis, peticions, estats, errors, reintent i `switchMap`.
- [docs/formularis.md](docs/formularis.md): formularis, validacions i historial de cerques.

## Estat de l'EAC1

EAC1 completat. Projecte base llest a la branca ra1-setup.

## Estat de l'EAC2

EAC2 completat a la branca ra2-components: llistat de videojocs amb components, filtres per text i categoria, comptador de resultats, missatge sense resultats, panell de detall, accessibilitat i disseny responsive.

## Estat de l'EAC3

EAC3 completat a la branca `ra3-serveis`:

- API local amb `json-server` i URL base centralitzada.
- Model de l'API, model intern i adaptador que normalitza les dades.
- Servei HTTP amb GET i POST, estats de càrrega i d'error, reintent de l'última consulta i `switchMap`.
- Formulari reactiu de cerca amb validació síncrona i asíncrona, debounce i historial a `localStorage`.
- Formulari d'alta que envia els videojocs nous amb POST.
- Banner d'error amb el botó "Reintentar", regions d'estat accessibles i disseny responsive.
- El filtre template-driven de l'EAC2 (`VideoGameFiltersComponent`) s'ha substituït pel formulari reactiu `VideoGameSearchFormComponent`, i el mock ja no existeix: les dades arriben de l'API.

## Enllaç del repositori

- Repositori: https://github.com/imerej-eng/ioc-angular-cataleg-videojocs-jeremias-canadas
- Branca ra1-setup: https://github.com/imerej-eng/ioc-angular-cataleg-videojocs-jeremias-canadas/tree/ra1-setup
- Branca ra2-components: https://github.com/imerej-eng/ioc-angular-cataleg-videojocs-jeremias-canadas/tree/ra2-components
- Branca ra3-serveis: https://github.com/imerej-eng/ioc-angular-cataleg-videojocs-jeremias-canadas/tree/ra3-serveis
