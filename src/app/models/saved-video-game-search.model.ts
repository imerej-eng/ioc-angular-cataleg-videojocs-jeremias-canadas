import { VideoGameSearchCriteria } from './video-game-search-criteria.model';

/** Una cerca de videojocs desada a l'historial del navegador. */
export interface SavedVideoGameSearch extends VideoGameSearchCriteria {
  /** Instant en què es va desar, en format ISO (AAAA-MM-DDTHH:MM:SS.sssZ). */
  savedAt: string;
}
