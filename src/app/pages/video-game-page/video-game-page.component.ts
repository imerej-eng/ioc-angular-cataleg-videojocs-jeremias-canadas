import { Component, inject, OnInit, signal } from '@angular/core';
import { VideoGameDetailComponent } from '../../components/video-game-detail/video-game-detail.component';
import { VideoGameFiltersComponent } from '../../components/video-game-filters/video-game-filters.component';
import { VideoGameListComponent } from '../../components/video-game-list/video-game-list.component';
import { VideoGame } from '../../models/video-game.model';
import { AppliedVideoGameFilters } from '../../models/video-game-filters.model';
import { VideoGameService } from '../../services/video-game.service';
import { VideoGameSearchCriteria } from '../../models/video-game-search-criteria.model';
import { VideoGameFormComponent } from '../../components/video-game-form/video-game-form.component';

@Component({
  imports: [
    VideoGameDetailComponent,
    VideoGameFiltersComponent,
    VideoGameListComponent,
    VideoGameFormComponent,
  ],
  selector: 'app-video-game-page',
  styleUrl: './video-game-page.component.scss',
  templateUrl: './video-game-page.component.html',
})
export class VideoGamePageComponent implements OnInit {
  private readonly videoGameService = inject(VideoGameService);
  readonly videoGames = this.videoGameService.videoGames;
  readonly videoGameListStatus = this.videoGameService.videoGameListStatus;
  readonly lastCreatedVideoGame = signal<VideoGame | null>(null);

  selectedVideoGame: VideoGame | undefined = undefined;

  ngOnInit(): void {
    this.videoGameService.loadVideoGames();
  }

  onApplyVideoGameFilters(videoGameFilters: AppliedVideoGameFilters): void {
    this.videoGameService.loadVideoGamesByCriteria(
      this.getVideoGameSearchCriteria(videoGameFilters),
    );
  }

  onResetVideoGameFilters(): void {
    this.videoGameService.loadVideoGames();
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

  private getVideoGameSearchCriteria(
    videoGameFilters: AppliedVideoGameFilters,
  ): VideoGameSearchCriteria {
    return {
      searchText: videoGameFilters.searchText.trim(),
      category: videoGameFilters.category === 'Totes' ? '' : videoGameFilters.category,
    };
  }
}
