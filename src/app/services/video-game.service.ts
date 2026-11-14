import { Service, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { VideoGame } from '../models/video-game.model';
import { RequestStatus } from '../models/request-status.model';
import { map, Subscription } from 'rxjs';
import { ApiVideoGame } from '../adapters/types/api-video-game.type';
import { adaptApiVideoGame } from '../adapters/video-game.adapter';

@Service()
export class VideoGameService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;
  private readonly videoGamesUrl = `${this.apiBaseUrl}/videoGames`;

  private readonly _videoGames = signal<VideoGame[]>([]);
  readonly videoGames = this._videoGames.asReadonly();

  private readonly _videoGameListStatus = signal<RequestStatus>('initial');
  readonly videoGameListStatus = this._videoGameListStatus.asReadonly();

  private videoGameSuscription?: Subscription;

  loadVideoGames(): void {
    this.videoGameSuscription?.unsubscribe();
    this._videoGames.set([]);
    this._videoGameListStatus.set('loading');

    this.videoGameSuscription = this.http
      .get<ApiVideoGame[]>(this.videoGamesUrl)
      .pipe(map((apiVideoGames) => apiVideoGames.map(adaptApiVideoGame)))
      .subscribe({
        next: (adaptedVideoGames) => {
          this._videoGames.set(adaptedVideoGames);
          this._videoGameListStatus.set('success');
        },
        error: (httpError: HttpErrorResponse) => {
          console.error('Error carregant els videojocs:', httpError);

          this._videoGameListStatus.set('error');
        },
      });
  }
}
