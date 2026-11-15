/** Una categoria del catàleg de videojocs. */
export type VideoGameCategory =
  | 'Acció'
  | 'Arcade'
  | 'Aventura'
  | 'Curses'
  | 'Esports'
  | 'Estratègia'
  | 'Plataformes'
  | 'Puzles'
  | 'RPG'
  | 'Simulació';

/** Les categories del catàleg de videojocs, en l'ordre en què es mostren. */
export const VIDEO_GAME_CATEGORIES: readonly VideoGameCategory[] = [
  'Acció',
  'Arcade',
  'Aventura',
  'Curses',
  'Esports',
  'Estratègia',
  'Plataformes',
  'Puzles',
  'RPG',
  'Simulació',
];
