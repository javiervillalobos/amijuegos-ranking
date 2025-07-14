import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-boton-votar',
  imports: [],
  templateUrl: './boton-votar.component.html',
  styleUrl: './boton-votar.component.css'
})
export class BotonVotarComponent {

  @Output() votar = new EventEmitter<string>();
  clicked = false;

  onClick() {
    this.clicked = true;
    this.votar.emit();
  }

}
