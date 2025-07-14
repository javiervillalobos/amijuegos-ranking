import { Component } from '@angular/core';
import { JuegosComponent } from "./juegos/juegos.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'amijuegos-ranking';
}
