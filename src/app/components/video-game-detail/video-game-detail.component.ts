import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { VideoGame } from '../../models/video-game.model';
import { VideoGameTagComponent } from '../video-game-tag/video-game-tag.component';

@Component({
  imports: [DatePipe, DecimalPipe, VideoGameTagComponent],
  selector: 'app-video-game-detail',
  styleUrl: './video-game-detail.component.scss',
  templateUrl: './video-game-detail.component.html',
})
export class VideoGameDetailComponent {
  @Input({ required: true }) videoGame!: VideoGame;
  @Output() closed = new EventEmitter<void>();

  onCloseVideoGameDetail(): void {
    this.closed.emit();
  }
}
