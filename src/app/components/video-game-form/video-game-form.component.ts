import { Component, EventEmitter, inject, OnDestroy, Output, signal } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { VideoGameService } from '../../services/video-game.service';
import { VideoGameCategory, VIDEO_GAME_CATEGORIES } from '../../models/video-game-category.model';
import { notBlankValidator, trimmedMinLengthValidator } from '../../validators/common.validators';
import { RequestStatus } from '../../models/request-status.model';
import { Subscription } from 'rxjs';
import { VideoGame, NewVideoGame } from '../../models/video-game.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-video-game-form',
  styleUrl: './video-game-form.component.scss',
  templateUrl: './video-game-form.component.html',
})
export class VideoGameFormComponent implements OnDestroy {
  private readonly nonNullableFormBuilder = inject(NonNullableFormBuilder);
  private readonly videoGameService = inject(VideoGameService);

  readonly videoGameTitleMinLength = 2;
  readonly videoGameDescriptionMaxLength = 300;
  readonly videoGamePlatformMinLength = 2;
  readonly videoGameCategories = VIDEO_GAME_CATEGORIES;
  readonly videoGameRatingMin = 0;
  readonly videoGameRatingMax = 5;

  readonly videoGameForm = this.nonNullableFormBuilder.group({
    title: [
      '',
      [
        Validators.required,
        notBlankValidator,
        trimmedMinLengthValidator(this.videoGameTitleMinLength),
      ],
    ],
    description: [
      '',
      [
        Validators.required,
        notBlankValidator,
        Validators.maxLength(this.videoGameDescriptionMaxLength),
      ],
    ],
    category: this.nonNullableFormBuilder.control<VideoGameCategory | ''>('', [
      Validators.required,
    ]),
    platform: [
      '',
      [
        Validators.required,
        notBlankValidator,
        trimmedMinLengthValidator(this.videoGamePlatformMinLength),
      ],
    ],
    releaseOn: ['', [Validators.required]],
    rating: this.nonNullableFormBuilder.control<number | null>(null, [
      Validators.min(this.videoGameRatingMin),
      Validators.max(this.videoGameRatingMax),
    ]),
  });

  readonly videoGameSaveStatus = signal<RequestStatus>('initial');
  private videoGameSaveSubscription?: Subscription;

  @Output() videoGameCreated = new EventEmitter<VideoGame>();

  ngOnDestroy(): void {
    this.videoGameSaveSubscription?.unsubscribe();
  }

  isTouchedAndInvalid(control: AbstractControl): boolean {
    return control.touched && control.invalid;
  }

  onSubmitVideoGame(titleInput: HTMLInputElement): void {
    if (!this.videoGameForm.valid) {
      this.videoGameForm.markAllAsTouched();
      return;
    }
    const videoGameFormValue = this.videoGameForm.getRawValue();
    if (videoGameFormValue.category === '') {
      return;
    }
    const newVideoGame: NewVideoGame = {
      title: videoGameFormValue.title.trim(),
      description: videoGameFormValue.description.trim(),
      category: videoGameFormValue.category,
      platform: videoGameFormValue.platform.trim(),
      releaseOn: videoGameFormValue.releaseOn,
      rating: videoGameFormValue.rating,
    };

    this.videoGameSaveStatus.set('loading');
    this.videoGameForm.disable();
    this.videoGameSaveSubscription = this.videoGameService.addVideoGame(newVideoGame).subscribe({
      next: (createdVideoGame) => {
        this.videoGameForm.enable();
        this.videoGameCreated.emit(createdVideoGame);
        titleInput.focus();
        this.videoGameForm.reset();
        this.videoGameSaveStatus.set('success');
      },
      error: (httpError: HttpErrorResponse) => {
        this.videoGameForm.enable();
        console.error('Error desant el videojoc:', httpError);
        this.videoGameSaveStatus.set('error');
      },
    });
  }
}
