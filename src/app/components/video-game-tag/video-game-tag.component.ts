import { Component, Input } from '@angular/core';
import { VideoGameCategory } from '../../models/video-game.model';

@Component({
  imports: [],
  selector: 'app-video-game-tag',
  styleUrl: './video-game-tag.component.scss',
  templateUrl: './video-game-tag.component.html',
})
export class VideoGameTagComponent {
  @Input({ required: true }) category!: VideoGameCategory;
  @Input() isFeatured = false;
}
