import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, KeyValuePipe } from '@angular/common';
import { Juego } from '../models/juego';
import { BotonVotarComponent } from '../boton-votar/boton-votar.component';

@Component({
  selector: 'app-juegos',
  imports: [ NgFor, NgIf, BotonVotarComponent, FormsModule, KeyValuePipe ],
  templateUrl: './juegos.component.html',
  styleUrl: './juegos.component.css'
})
export class JuegosComponent {

  juegoVotado : string = "0";
  votante : string = "";
  validationMessage : string = "";
  votos: Map<string, number> = new Map();

  juegos: Map<string, string> = new Map([
    ['1', 'Catan'],
    ['2', 'Dixit'],
    ['3', 'Carcassonne']
  ]);

  ingresarVoto() {
    if (this.juegoVotado == "0") {
      this.validationMessage = "Debe seleccionar juego antes de votar";
    } else if (this.votante?.trim().length == 0) {
      this.validationMessage = "Debe ingresar su nombre antes de votar";
    } else {
      let nombreJuego = this.juegos.get(this.juegoVotado);

      if (nombreJuego != null) {
        let juego = this.votos.get(nombreJuego);
        let numVotos = 1;
        if (juego != null) {
          numVotos = juego + 1;
        }
        this.votos.set(nombreJuego, numVotos);
      }
    }
  }
}
