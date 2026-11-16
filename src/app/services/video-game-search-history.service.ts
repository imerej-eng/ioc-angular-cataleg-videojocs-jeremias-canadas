import { Service, signal } from '@angular/core';
import { VIDEO_GAME_CATEGORIES, VideoGameCategory } from '../models/video-game-category.model';
import { VideoGameSearchCriteria } from '../models/video-game-search-criteria.model';
import { SavedVideoGameSearch } from '../models/saved-video-game-search.model';

@Service()
export class VideoGameSearchHistoryService {
  private readonly savedVideoGameSearchesStorageKey =
    'video-game-catalog.saved-video-game-searches';
  private readonly savedVideoGameSearchesMax = 5;

  private readonly _savedVideoGameSearches = signal<SavedVideoGameSearch[]>(
    this.readSavedVideoGameSearches(),
  );
  readonly savedVideoGameSearches = this._savedVideoGameSearches.asReadonly();

  addSavedVideoGameSearch(videoGameSearchCriteria: VideoGameSearchCriteria): void {
    if (videoGameSearchCriteria.searchText === '') {
      return;
    }
    const latestSavedVideoGameSearch: SavedVideoGameSearch | undefined =
      this._savedVideoGameSearches()[0];
    if (
      latestSavedVideoGameSearch !== undefined &&
      this.isSameVideoGameSearch(latestSavedVideoGameSearch, videoGameSearchCriteria)
    ) {
      return;
    }
    const savedVideoGameSearch: SavedVideoGameSearch = {
      ...videoGameSearchCriteria,
      savedAt: new Date().toISOString(),
    };
    this._savedVideoGameSearches.set(
      [savedVideoGameSearch, ...this._savedVideoGameSearches()].slice(
        0,
        this.savedVideoGameSearchesMax,
      ),
    );
    this.writeSavedVideoGameSearches();
  }

  clearSavedVideoGameSearches(): void {
    this._savedVideoGameSearches.set([]);
    this.writeSavedVideoGameSearches();
  }

  private isSameVideoGameSearch(
    savedVideoGameSearch: SavedVideoGameSearch,
    videoGameSearchCriteria: VideoGameSearchCriteria,
  ): boolean {
    return (
      savedVideoGameSearch.searchText.toLocaleLowerCase('ca') ===
        videoGameSearchCriteria.searchText.toLocaleLowerCase('ca') &&
      savedVideoGameSearch.category === videoGameSearchCriteria.category
    );
  }

  private readSavedVideoGameSearches(): SavedVideoGameSearch[] {
    try {
      const storedText = localStorage.getItem(this.savedVideoGameSearchesStorageKey);
      if (storedText === null) {
        return [];
      }
      const storedValue: unknown = JSON.parse(storedText);
      if (!Array.isArray(storedValue)) {
        return [];
      }
      return storedValue.filter(isSavedVideoGameSearch).slice(0, this.savedVideoGameSearchesMax);
    } catch (storageError: unknown) {
      console.error("Error llegint l'historial de cerques:", storageError);
      return [];
    }
  }

  private writeSavedVideoGameSearches(): void {
    try {
      localStorage.setItem(
        this.savedVideoGameSearchesStorageKey,
        JSON.stringify(this._savedVideoGameSearches()),
      );
    } catch (storageError: unknown) {
      console.error("Error desant l'historial de cerques:", storageError);
    }
  }
}

function isVideoGameCategory(value: unknown): value is VideoGameCategory {
  return VIDEO_GAME_CATEGORIES.some((videoGameCategory) => videoGameCategory === value);
}

function isSavedVideoGameSearch(value: unknown): value is SavedVideoGameSearch {
  return (
    typeof value === 'object' &&
    value !== null &&
    'searchText' in value &&
    typeof value.searchText === 'string' &&
    'category' in value &&
    (value.category === '' || isVideoGameCategory(value.category)) &&
    'savedAt' in value &&
    typeof value.savedAt === 'string'
  );
}
