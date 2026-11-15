import { VideoGameCategory } from './video-game-category.model';

/** Un videojoc nou tal com s'envia des del formulari d'alta. */
export interface NewVideoGame {
  /** Títol sense espais als extrems. */
  title: string;
  /** Descripció sense espais als extrems. */
  description: string;
  category: VideoGameCategory;
  /** Plataforma sense espais als extrems. */
  platform: string;
  /** Data de llançament en format AAAA-MM-DD. */
  releaseOn: string;
  /** Valoració sobre 5 o null si no se n'escriu cap. */
  rating: number | null;
}

/** Un videojoc del catàleg, ja adaptat per a l'aplicació. */
export interface VideoGame {
  id: string;
  /** Títol sense espais als extrems. */
  title: string;
  /** Descripció sense espais als extrems. */
  description: string;
  /** Categoria normalitzada o null si l'API n'envia una que no és a la llista. */
  category: VideoGameCategory | null;
  /** Plataforma sense espais als extrems. */
  platform: string;
  /** Data de llançament en format AAAA-MM-DD. */
  releaseOn: string;
  /** Valoració sobre 5 o null si encara no en té. */
  rating: number | null;
  /** Si és destacat i si l'API no ho indica, és false. */
  isFeatured: boolean;
}
