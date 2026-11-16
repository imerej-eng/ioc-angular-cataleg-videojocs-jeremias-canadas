import { Component, inject, OnInit, signal } from '@angular/core';
import { VideoGameDetailComponent } from '../../components/video-game-detail/video-game-detail.component';
import { VideoGameSearchFormComponent } from '../../components/video-game-search-form/video-game-search-form.component';
import { VideoGameListComponent } from '../../components/video-game-list/video-game-list.component';
import { VideoGame } from '../../models/video-game.model';
import { VideoGameService } from '../../services/video-game.service';
import { VideoGameSearchCriteria } from '../../models/video-game-search-criteria.model';
import { VideoGameFormComponent } from '../../components/video-game-form/video-game-form.component';
import { VideoGameSearchHistoryService } from '../../services/video-game-search-history.service';

@Component({
  imports: [
    VideoGameDetailComponent,
    VideoGameListComponent,
    VideoGameFormComponent,
    VideoGameSearchFormComponent,
  ],
  selector: 'app-video-game-page',
  styleUrl: './video-game-page.component.scss',
  templateUrl: './video-game-page.component.html',
})
export class VideoGamePageComponent implements OnInit {
  private readonly videoGameService = inject(VideoGameService);
  private readonly videoGameSearchHistoryService = inject(VideoGameSearchHistoryService);
  readonly videoGames = this.videoGameService.videoGames;
  readonly videoGameListStatus = this.videoGameService.videoGameListStatus;
  readonly savedVideoGameSearches = this.videoGameSearchHistoryService.savedVideoGameSearches;
  readonly lastCreatedVideoGame = signal<VideoGame | null>(null);

  selectedVideoGame: VideoGame | undefined = undefined;

  ngOnInit(): void {
    this.videoGameService.loadVideoGames();
  }

  onSearchVideoGames(videoGameSearchCriteria: VideoGameSearchCriteria): void {
    this.videoGameSearchHistoryService.addSavedVideoGameSearch(videoGameSearchCriteria);
    this.videoGameService.loadVideoGamesByCriteria(videoGameSearchCriteria);
  }

  onClearSavedVideoGameSearches(): void {
    this.videoGameSearchHistoryService.clearSavedVideoGameSearches();
  }

  onRetryVideoGameList(): void {
    this.videoGameService.reloadVideoGames();
  }

  onSelectVideoGame(videoGame: VideoGame): void {
    this.selectedVideoGame = videoGame;
  }

  onCloseVideoGameDetail(): void {
    this.selectedVideoGame = undefined;
  }

  onRegisterCreatedVideoGame(createdVideoGame: VideoGame): void {
    this.lastCreatedVideoGame.set(createdVideoGame);
  }
}
