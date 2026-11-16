import { HttpErrorResponse } from '@angular/common/http';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { catchError, map, Observable, of, switchMap, timer } from 'rxjs';
import { VideoGameService } from '../services/video-game.service';

/** Crea un validador asíncron que comprova si el text de cerca té resultats al catàleg de videojocs. */
export function matchingVideoGameExistsValidator(
  videoGameService: VideoGameService,
  debounceMs: number,
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (typeof control.value !== 'string') {
      return of(null);
    }
    const trimmedSearchText = control.value.trim();
    if (trimmedSearchText === '') {
      return of(null);
    }
    return timer(debounceMs).pipe(
      switchMap(() =>
        videoGameService
          .getVideoGamesByCriteria({ searchText: trimmedSearchText, category: '' })
          .pipe(
            map((foundVideoGames) =>
              foundVideoGames.length === 0 ? { matchingVideoGameExists: true } : null,
            ),
            catchError((httpError: HttpErrorResponse) => {
              console.error('Error comprovant si el text de cerca té resultats:', httpError);
              return of(null);
            }),
          ),
      ),
    );
  };
}
