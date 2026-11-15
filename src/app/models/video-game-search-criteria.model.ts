import { VideoGameCategory } from './video-game-category.model';

/** Uns criteris de cerca del catàleg de videojocs. */
export interface VideoGameSearchCriteria {
  /** Text sense espais als extrems, buit vol dir sense filtre de text. */
  searchText: string;
  /** Categoria triada o '' per a totes les categories. */
  category: VideoGameCategory | '';
}
