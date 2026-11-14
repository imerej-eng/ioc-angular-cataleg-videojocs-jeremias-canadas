import { ApiBinaryFlag } from './api-binary-flag.type';

/** Un videojoc tal com l'envia l'API. */
export interface ApiVideoGame {
  id: string;
  /** Pot portar espais als extrems. */
  title: string;
  /** Pot portar espais als extrems. */
  description: string;
  /** Text lliure: pot portar majúscules diferents, espais als extrems, sense accents o no ser a la llista de categories. */
  category: string;
  /** Pot portar espais als extrems. */
  platform: string;
  /** Data de llançament en format AAAA-MM-DD. */
  release_date: string;
  /** Valoració sobre 5 amb coma decimal ("4,8"), o "" si encara no en té. */
  rating: string;
  /** 1 = destacat, 0 = no destacat. Si falta, el videojoc no és destacat. */
  is_featured?: ApiBinaryFlag;
}
