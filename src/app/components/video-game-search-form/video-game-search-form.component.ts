import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { VIDEO_GAME_CATEGORIES, VideoGameCategory } from '../../models/video-game-category.model';
import { VideoGameSearchCriteria } from '../../models/video-game-search-criteria.model';
import { trimmedMinLengthValidator } from '../../validators/common.validators';
import { SavedVideoGameSearch } from '../../models/saved-video-game-search.model';
import { VideoGameService } from '../../services/video-game.service';
import { matchingVideoGameExistsValidator } from '../../validators/video-game-search.validators';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-video-game-search-form',
  styleUrl: './video-game-search-form.component.scss',
  templateUrl: './video-game-search-form.component.html',
})
export class VideoGameSearchFormComponent {
  private readonly nonNullableFormBuilder = inject(NonNullableFormBuilder);
  private readonly videoGameService = inject(VideoGameService);

  readonly videoGameSearchTextMinLength = 3;
  readonly videoGameSearchTextDebounceMs = 400;
  readonly videoGameCategories = VIDEO_GAME_CATEGORIES;

  readonly videoGameSearchForm = this.nonNullableFormBuilder.group({
    searchText: this.nonNullableFormBuilder.control(
      '',
      [trimmedMinLengthValidator(this.videoGameSearchTextMinLength)],
      [matchingVideoGameExistsValidator(this.videoGameService, this.videoGameSearchTextDebounceMs)],
    ),
    category: this.nonNullableFormBuilder.control<VideoGameCategory | ''>(''),
  });

  @Input({ required: true }) savedVideoGameSearches!: SavedVideoGameSearch[];
  @Output() videoGameSearchCriteriaSubmitted = new EventEmitter<VideoGameSearchCriteria>();
  @Output() savedVideoGameSearchesCleared = new EventEmitter<void>();

  get hasSavedVideoGameSearches(): boolean {
    return this.savedVideoGameSearches.length > 0;
  }

  isTouchedAndInvalid(control: AbstractControl): boolean {
    return control.touched && control.invalid;
  }

  onSubmitVideoGameSearch(): void {
    if (!this.videoGameSearchForm.valid) {
      this.videoGameSearchForm.markAllAsTouched();
      return;
    }
    const videoGameSearchFormValue = this.videoGameSearchForm.getRawValue();
    const videoGameSearchCriteria: VideoGameSearchCriteria = {
      ...videoGameSearchFormValue,
      searchText: videoGameSearchFormValue.searchText.trim(),
    };
    this.videoGameSearchCriteriaSubmitted.emit(videoGameSearchCriteria);
  }

  onClearVideoGameSearch(): void {
    this.videoGameSearchForm.reset();
    this.videoGameSearchCriteriaSubmitted.emit(this.videoGameSearchForm.getRawValue());
  }

  onRecoverVideoGameSearch(savedVideoGameSearch: SavedVideoGameSearch): void {
    const videoGameSearchCriteria: VideoGameSearchCriteria = {
      searchText: savedVideoGameSearch.searchText,
      category: savedVideoGameSearch.category,
    };
    this.videoGameSearchForm.setValue(videoGameSearchCriteria);
    this.videoGameSearchCriteriaSubmitted.emit(videoGameSearchCriteria);
  }

  onClearSavedVideoGameSearches(): void {
    this.savedVideoGameSearchesCleared.emit();
  }
}
