import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VideoGameDetailComponent } from './components/video-game-detail/video-game-detail.component';
import { VideoGameFiltersComponent } from './components/video-game-filters/video-game-filters.component';
import { VideoGameListComponent } from './components/video-game-list/video-game-list.component';
import { VideoGame } from './models/video-game.model';
import { AppliedVideoGameFilters } from './models/video-game-filters.model';
import { VideoGameService } from './services/video-game.service';

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
export class App implements OnInit {
  private readonly videoGameService = inject(VideoGameService);
  readonly videoGames = this.videoGameService.videoGames;
  readonly videoGameListStatus = this.videoGameService.videoGameListStatus;
  public appName = 'Catàleg de Videojocs';

  appliedVideoGameFilters: AppliedVideoGameFilters | undefined = undefined;
  selectedVideoGame: VideoGame | undefined = undefined;

  ngOnInit(): void {
    this.videoGameService.loadVideoGames();
  }

  get filteredVideoGames(): VideoGame[] {
    const videoGameFilters = this.appliedVideoGameFilters;
    const loadedVideoGames = this.videoGames();
    if (videoGameFilters === undefined) {
      return loadedVideoGames;
    }
    const searchText = videoGameFilters.searchText.trim().toLocaleLowerCase('ca');
    return loadedVideoGames.filter(
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
