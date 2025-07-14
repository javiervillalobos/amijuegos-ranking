import { Component } from '@angular/core';
import { JuegosComponent } from "./juegos/juegos.component";

@Component({
  selector: 'app-root',
  imports: [JuegosComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'amijuegos-ranking';
}
