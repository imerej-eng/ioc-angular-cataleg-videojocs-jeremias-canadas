import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VideoGame } from '../../models/video-game.model';
import { VideoGameCardComponent } from '../video-game-card/video-game-card.component';

@Component({
  imports: [VideoGameCardComponent],
  selector: 'app-video-game-list',
  styleUrl: './video-game-list.component.scss',
  templateUrl: './video-game-list.component.html',
})
export class VideoGameListComponent {
  @Input({ required: true }) videoGames!: VideoGame[];
  @Input() selectedVideoGameId: number | undefined = undefined;
  @Output() selected = new EventEmitter<VideoGame>();

  onSelectVideoGame(videoGame: VideoGame): void {
    this.selected.emit(videoGame);
  }
}
