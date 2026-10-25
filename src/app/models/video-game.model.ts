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

export interface VideoGame {
  id: number;
  title: string;
  description: string;
  category: VideoGameCategory;
  platform: string;
  releaseDate: string; //format ISO 8601, per exemple '2017-03-03'
  rating: number; //valoració de 0 a 5
  isFeatured?: boolean;
}
