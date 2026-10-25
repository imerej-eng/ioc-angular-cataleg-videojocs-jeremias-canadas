import { VideoGameCategory } from './video-game.model';

export type VideoGameCategoryFilter = VideoGameCategory | 'Totes';

export interface VideoGameFilters {
  searchText: string;
  category: VideoGameCategoryFilter | null;
}

export interface AppliedVideoGameFilters {
  searchText: string;
  category: VideoGameCategoryFilter;
}
