# Nom de l'aplicació

Catàleg de Videojocs

## Autor/a

Jeremias Cañadas Oliva

## Descripció

Aplicació per consultar i gestionar un catàleg de videojocs, amb informació com el títol, la plataforma, el gènere i l'any de llançament.

## Versions utilitzades

- Node.js: v24.21.0
- npm: 11.19.0
- Angular CLI: 22.2.0
- Angular: 22.2.0
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

Per executar el projecte:

```bash
ng serve
```

Un cop arrencat, l'aplicació es pot consultar a http://localhost:4200/.

## Branques

- `ra1-setup`: projecte base de l'EAC1.
- `ra2-components`: interfície amb components de l'EAC2. Parteix de l'estat final de `ra1-setup` (`git switch ra2-components` i `git merge ra1-setup`).

## Components creats i com crear-los (EAC2)

Tots són components standalone i són a `src/app/components/`:

- `VideoGameTagComponent` (`video-game-tag`):

```bash
   ng generate component models/video-game-tag --add-type-to-class-name --skip-tests
```

- `VideoGameCardComponent` (`video-game-card`):

```bash
   ng generate component models/video-game-card --add-type-to-class-name --skip-tests
```

- `VideoGameListComponent` (`video-game-list`):

```bash
   ng generate component models/video-game-list --add-type-to-class-name --skip-tests
```

- `VideoGameFiltersComponent` (`video-game-filters`):

```bash
   ng generate component models/video-game-filters --add-type-to-class-name --skip-tests
```

- `VideoGameDetailComponent` (`video-game-detail`):

```bash
   ng generate component models/video-game-detail --add-type-to-class-name --skip-tests
```

Model i dades:

- Model: `src/app/models/video-game.model.ts` (interfície `VideoGame` i tipus `VideoGameCategory`).

```bash
   ng generate interface models/video-game --type=model
```

- Tipus dels filtres: `src/app/models/video-game-filters.model.ts`.

```bash
   ng generate interface models/video-game-filters --type=model
```

- Dades mock: `src/app/mocks/video-games.mock.ts` (15 videojocs).

## Estat de l'EAC1

EAC1 completat. Projecte base llest a la branca ra1-setup.

## Estat de l'EAC2

EAC2 completat a la branca ra2-components: llistat de videojocs amb components, filtres per text i categoria, comptador de resultats, missatge sense resultats, panell de detall, accessibilitat i disseny responsive.

## Enllaç del repositori

- Repositori: https://github.com/imerej-eng/ioc-angular-cataleg-videojocs-jeremias-canadas
- Branca ra1-setup: https://github.com/imerej-eng/ioc-angular-cataleg-videojocs-jeremias-canadas/tree/ra1-setup
- Branca ra2-components: https://github.com/imerej-eng/ioc-angular-cataleg-videojocs-jeremias-canadas/tree/ra2-components
