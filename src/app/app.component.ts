import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VideoGamePageComponent } from './pages/video-game-page/video-game-page.component';

@Component({
  imports: [RouterOutlet, VideoGamePageComponent],
  selector: 'app-root',
  styleUrl: './app.component.scss',
  templateUrl: './app.component.html',
})
export class App {
  public appName = 'Catàleg de Videojocs';
}
