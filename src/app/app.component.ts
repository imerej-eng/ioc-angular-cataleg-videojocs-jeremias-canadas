import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VideoGameDetailComponent } from './components/video-game-detail/video-game-detail.component';
import { VideoGameFiltersComponent } from './components/video-game-filters/video-game-filters.component';
import { VideoGameListComponent } from './components/video-game-list/video-game-list.component';
import { VIDEO_GAMES_MOCK } from './mocks/video-games.mock';
import { VideoGame } from './models/video-game.model';
import { AppliedVideoGameFilters } from './models/video-game-filters.model';

@Component({
  imports: [
    RouterOutlet,
    VideoGameDetailComponent,
    VideoGameFiltersComponent,
    VideoGameListComponent,
  ],
  selector: 'app-root',
  styleUrl: './app.component.scss',
  templateUrl: './app.component.html',
})
export class App {
  public appName = 'Catàleg de Videojocs';
  videoGames: VideoGame[] = VIDEO_GAMES_MOCK;
  appliedVideoGameFilters: AppliedVideoGameFilters | undefined = undefined;
  selectedVideoGame: VideoGame | undefined = undefined;

  get filteredVideoGames(): VideoGame[] {
    const videoGameFilters = this.appliedVideoGameFilters;
    if (videoGameFilters === undefined) {
      return this.videoGames;
    }
    const searchText = videoGameFilters.searchText.trim().toLocaleLowerCase('ca');
    return this.videoGames.filter(
      (videoGame) =>
        (videoGameFilters.category === 'Totes' ||
          videoGame.category === videoGameFilters.category) &&
        this.isSearchTextInTitleOrDescription(videoGame, searchText),
    );
  }

  get hasFilteredVideoGames(): boolean {
    return this.filteredVideoGames.length > 0;
  }

  onApplyVideoGameFilters(videoGameFilters: AppliedVideoGameFilters): void {
    this.appliedVideoGameFilters = videoGameFilters;
  }

  onResetVideoGameFilters(): void {
    this.appliedVideoGameFilters = undefined;
  }

  onSelectVideoGame(videoGame: VideoGame): void {
    this.selectedVideoGame = videoGame;
  }

  onCloseVideoGameDetail(): void {
    this.selectedVideoGame = undefined;
  }

  private isSearchTextInTitleOrDescription(videoGame: VideoGame, searchText: string): boolean {
    return (
      videoGame.title.toLocaleLowerCase('ca').includes(searchText) ||
      videoGame.description.toLocaleLowerCase('ca').includes(searchText)
    );
  }
}
