import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { VideoGame } from '../../models/video-game.model';
import { VideoGameTagComponent } from '../video-game-tag/video-game-tag.component';

@Component({
  imports: [DatePipe, DecimalPipe, VideoGameTagComponent],
  selector: 'app-video-game-card',
  styleUrl: './video-game-card.component.scss',
  templateUrl: './video-game-card.component.html',
})
export class VideoGameCardComponent {
  @Input({ required: true }) videoGame!: VideoGame;
  @Input() isSelected = false;
  @Output() selected = new EventEmitter<VideoGame>();

  onSelectVideoGame(): void {
    this.selected.emit(this.videoGame);
  }
}
