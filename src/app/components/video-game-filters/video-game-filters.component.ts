import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import {
  AppliedVideoGameFilters,
  VideoGameCategoryFilter,
  VideoGameFilters,
} from '../../models/video-game-filters.model';

@Component({
  imports: [FormsModule],
  selector: 'app-video-game-filters',
  styleUrl: './video-game-filters.component.scss',
  templateUrl: './video-game-filters.component.html',
})
export class VideoGameFiltersComponent {
  @Output() filtersApplied = new EventEmitter<AppliedVideoGameFilters>();
  @Output() filtersReset = new EventEmitter<void>();

  readonly searchTextMinLength = 3;

  readonly videoGameCategoryFilters: VideoGameCategoryFilter[] = [
    'Totes',
    'Acció',
    'Arcade',
    'Aventura',
    'Curses',
    'Esports',
    'Estratègia',
    'Plataformes',
    'Puzles',
    'RPG',
    'Simulació',
  ];

  videoGameFilters: VideoGameFilters = this.createDefaultVideoGameFilters();

  isInvalidAndTouchedOrDirty(control: NgModel): boolean {
    return (control.invalid && (control.touched || control.dirty)) ?? false;
  }

  onApplyVideoGameFilters(filterForm: NgForm): void {
    const category = this.videoGameFilters.category;
    if (filterForm.invalid || category === null) {
      return;
    }
    this.filtersApplied.emit({ searchText: this.videoGameFilters.searchText, category });
  }

  onResetVideoGameFilters(filterForm: NgForm): void {
    this.videoGameFilters = this.createDefaultVideoGameFilters();
    filterForm.resetForm(this.videoGameFilters);
    this.filtersReset.emit();
  }

  private createDefaultVideoGameFilters(): VideoGameFilters {
    return { searchText: '', category: null };
  }
}
