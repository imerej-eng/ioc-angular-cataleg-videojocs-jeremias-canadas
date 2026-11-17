import { adaptApiVideoGame } from './video-game.adapter';
import { ApiVideoGame } from './types/api-video-game.type';

const apiVideoGameWithUppercaseCategory: ApiVideoGame = {
  id: '3',
  title: 'Super Mario Bros.',
  description:
    'Clàssic de plataformes on Mario ha de superar diferents nivells per rescatar la princesa Peach.',
  category: 'PLATAFORMES',
  platform: 'Nintendo NES ',
  release_date: '1985-09-13',
  rating: '4,8',
  is_featured: 1,
};

const featuredApiVideoGame: ApiVideoGame = {
  id: '4',
  title: '  Tetris',
  description:
    'Joc de puzles on has de col·locar peces de diferents formes per completar línies i sumar punts.',
  category: 'Puzles',
  platform: 'Multiplataforma',
  release_date: '1984-06-06',
  rating: '4,7',
  is_featured: 1,
};

const apiVideoGameWithoutFeaturedFlag: ApiVideoGame = {
  id: '5',
  title: 'Pac-Man',
  description:
    'Joc arcade on controles un personatge que ha de menjar tots els punts del laberint mentre evita els fantasmes.',
  category: 'Arcade',
  platform: 'Arcade',
  release_date: '1980-05-22',
  rating: '4,6',
};

const apiVideoGameWithUnaccentedCategory: ApiVideoGame = {
  id: '10',
  title: 'League of Legends',
  description:
    'Joc competitiu per equips on cada jugador controla un campió i intenta destruir la base rival.',
  category: 'estrategia',
  platform: 'PC',
  release_date: '2009-10-27',
  rating: '4,5',
  is_featured: 1,
};

const apiVideoGameWithUnknownCategory: ApiVideoGame = {
  id: '16',
  title: 'The Legend of Zelda: Ocarina of Time',
  description:
    'Remake per a Nintendo Switch 2 del clàssic de 1998, on Link viatja pel temps per salvar el regne de Hyrule.',
  category: 'Acció-aventura',
  platform: 'Nintendo Switch 2',
  release_date: '2026-11-05',
  rating: '4,8',
  is_featured: 1,
};

const unratedApiVideoGame: ApiVideoGame = {
  id: '17',
  title: 'Grand Theft Auto VI',
  description:
    "Joc de món obert ambientat a l'estat de Leonida, on segueixes la història de Lucia i Jason a Vice City i els seus voltants.",
  category: 'Acció',
  platform: 'Multiplataforma',
  release_date: '2026-11-19',
  rating: '',
  is_featured: 0,
};

describe('adaptApiVideoGame', () => {
  it('retalla els espais dels extrems dels textos', () => {
    expect(adaptApiVideoGame(apiVideoGameWithUppercaseCategory).platform).toBe('Nintendo NES');
    expect(adaptApiVideoGame(featuredApiVideoGame).title).toBe('Tetris');
  });

  it('converteix la valoració amb coma decimal a número', () => {
    expect(adaptApiVideoGame(featuredApiVideoGame).rating).toBe(4.7);
  });

  it('aplica false a isFeatured si falta is_featured', () => {
    expect(adaptApiVideoGame(featuredApiVideoGame).isFeatured).toBe(true);
    expect(adaptApiVideoGame(apiVideoGameWithoutFeaturedFlag).isFeatured).toBe(false);
  });

  it('normalitza la categoria a un valor de la llista o null', () => {
    expect(adaptApiVideoGame(apiVideoGameWithUppercaseCategory).category).toBe('Plataformes');
    expect(adaptApiVideoGame(apiVideoGameWithUnaccentedCategory).category).toBe('Estratègia');
    expect(adaptApiVideoGame(apiVideoGameWithUnknownCategory).category).toBeNull();
  });

  it('passa a null la valoració buida', () => {
    expect(adaptApiVideoGame(unratedApiVideoGame).rating).toBeNull();
  });
});
