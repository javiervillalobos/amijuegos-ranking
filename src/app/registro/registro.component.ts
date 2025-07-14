import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { 
  ReactiveFormsModule, 
  FormGroup, 
  FormBuilder,
  Validators } from '@angular/forms'

@Component({
  selector: 'app-registro',
  imports: [ ReactiveFormsModule, NgIf ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  registroForm!: FormGroup; // Nivel 3.3: Declaramos el FormGroup

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Nivel 3.3: FormControl, FormGroup
    // Inicializamos nuestro FormGroup en ngOnInit.
    // Para que la prueba 'should create the component and initialize the registration form' pase,
    // es crucial que 'registroForm' sea una instancia de FormGroup al inicio.
    // Un FormGroup vacío es suficiente para esta primera prueba.
    this.registroForm = this.fb.group({
      // Aquí irán los controles del formulario a medida que avancemos con TDD
      username: [
        '', 
        [
          Validators.required, // Nivel 3.3: Campo 'username' con validador 'required'
          Validators.minLength(4) // Nivel 3.3: Campo 'username' con validador minlength 4
        ]
      ]
    });
  }


}
