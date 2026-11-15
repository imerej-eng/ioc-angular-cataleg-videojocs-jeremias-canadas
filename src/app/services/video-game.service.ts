import { Service, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { VideoGame, NewVideoGame } from '../models/video-game.model';
import { RequestStatus } from '../models/request-status.model';
import { catchError, EMPTY, map, Observable, Subject, switchMap, tap } from 'rxjs';
import { ApiVideoGame } from '../adapters/types/api-video-game.type';
import { adaptApiVideoGame, adaptNewVideoGameToApi } from '../adapters/video-game.adapter';
import { VideoGameSearchCriteria } from '../models/video-game-search-criteria.model';

@Service()
export class VideoGameService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;
  private readonly videoGamesUrl = `${this.apiBaseUrl}/videoGames`;

  private readonly emptyVideoGameSearchCriteria: VideoGameSearchCriteria = {
    searchText: '',
    category: '',
  };
  private readonly videoGameSearchCriteria$ = new Subject<VideoGameSearchCriteria>();
  private lastVideoGameSearchCriteria: VideoGameSearchCriteria = this.emptyVideoGameSearchCriteria;

  private readonly _videoGames = signal<VideoGame[]>([]);
  readonly videoGames = this._videoGames.asReadonly();

  private readonly _videoGameListStatus = signal<RequestStatus>('initial');
  readonly videoGameListStatus = this._videoGameListStatus.asReadonly();

  constructor() {
    this.videoGameSearchCriteria$
      .pipe(
        tap((videoGameSearchCriteria) => {
          this.lastVideoGameSearchCriteria = videoGameSearchCriteria;
          this._videoGames.set([]);
          this._videoGameListStatus.set('loading');
        }),
        switchMap((videoGameSearchCriteria) =>
          this.getVideoGamesByCriteria(videoGameSearchCriteria).pipe(
            catchError((httpError: HttpErrorResponse) => {
              console.error('Error carregant els videojocs:', httpError);
              this._videoGameListStatus.set('error');
              return EMPTY;
            }),
          ),
        ),
      )
      .subscribe((foundVideoGames) => {
        this._videoGames.set(foundVideoGames);
        this._videoGameListStatus.set('success');
      });
  }

  loadVideoGames(): void {
    this.videoGameSearchCriteria$.next(this.emptyVideoGameSearchCriteria);
  }

  loadVideoGamesByCriteria(videoGameSearchCriteria: VideoGameSearchCriteria): void {
    this.videoGameSearchCriteria$.next(videoGameSearchCriteria);
  }

  reloadVideoGames(): void {
    this.videoGameSearchCriteria$.next(this.lastVideoGameSearchCriteria);
  }

  addVideoGame(newVideoGame: NewVideoGame): Observable<VideoGame> {
    return this.http
      .post<ApiVideoGame>(this.videoGamesUrl, adaptNewVideoGameToApi(newVideoGame))
      .pipe(
        map(adaptApiVideoGame),
        tap(() => this.reloadVideoGames()),
      );
  }

  private getVideoGamesByCriteria(
    videoGameSearchCriteria: VideoGameSearchCriteria,
  ): Observable<VideoGame[]> {
    return this.http.get<ApiVideoGame[]>(this.videoGamesUrl).pipe(
      map((apiVideoGames) => apiVideoGames.map(adaptApiVideoGame)),
      map((adaptedVideoGames) =>
        this.filterVideoGamesByCriteria(adaptedVideoGames, videoGameSearchCriteria),
      ),
    );
  }

  private filterVideoGamesByCriteria(
    videoGames: VideoGame[],
    videoGameSearchCriteria: VideoGameSearchCriteria,
  ): VideoGame[] {
    const searchText = videoGameSearchCriteria.searchText.toLocaleLowerCase('ca');
    return videoGames.filter(
      (videoGame) =>
        (videoGameSearchCriteria.category === '' ||
          videoGame.category === videoGameSearchCriteria.category) &&
        (videoGame.title.toLocaleLowerCase('ca').includes(searchText) ||
          videoGame.description.toLocaleLowerCase('ca').includes(searchText)),
    );
  }
}
