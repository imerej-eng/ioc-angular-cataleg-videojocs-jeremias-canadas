import { VideoGame, NewVideoGame } from '../models/video-game.model';
import { VideoGameCategory } from '../models/video-game-category.model';
import { ApiVideoGame } from './types/api-video-game.type';

/** Converteix un videojoc de l'API al model intern. */
export function adaptApiVideoGame(apiVideoGame: ApiVideoGame): VideoGame {
  const convertedRating = parseFloat(apiVideoGame.rating.replace(',', '.'));
  return {
    id: apiVideoGame.id,
    title: apiVideoGame.title.trim(),
    description: apiVideoGame.description.trim(),
    category: normalizeApiVideoGameCategory(apiVideoGame.category),
    platform: apiVideoGame.platform.trim(),
    releaseOn: apiVideoGame.release_date,
    rating: Number.isFinite(convertedRating) ? convertedRating : null,
    isFeatured: apiVideoGame.is_featured === 1,
  };
}

/** Converteix un videojoc nou al format de l'API i s'afegeix com a no destacat. */
export function adaptNewVideoGameToApi(newVideoGame: NewVideoGame): Omit<ApiVideoGame, 'id'> {
  return {
    title: newVideoGame.title,
    description: newVideoGame.description,
    category: newVideoGame.category,
    platform: newVideoGame.platform,
    release_date: newVideoGame.releaseOn,
    rating: String(newVideoGame.rating ?? '').replace('.', ','),
    is_featured: 0,
  };
}

function normalizeApiVideoGameCategory(apiCategory: string): VideoGameCategory | null {
  switch (apiCategory.trim().toLocaleLowerCase('ca')) {
    case 'acció':
      return 'Acció';
    case 'arcade':
      return 'Arcade';
    case 'aventura':
      return 'Aventura';
    case 'curses':
      return 'Curses';
    case 'esports':
      return 'Esports';
    case 'estratègia':
    case 'estrategia':
      return 'Estratègia';
    case 'plataformes':
      return 'Plataformes';
    case 'puzles':
      return 'Puzles';
    case 'rpg':
      return 'RPG';
    case 'simulació':
    case 'simulacio':
      return 'Simulació';
    default:
      return null;
  }
}
