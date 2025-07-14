import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { 
  ReactiveFormsModule, 
  FormGroup, 
  FormBuilder,
  Validators, 
  AbstractControl} from '@angular/forms'
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-registro',
  imports: [ ReactiveFormsModule, NgIf ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit {

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
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      // Nivel 3.3: FormGroup Anidado
      passwordGroup: this.fb.group({
        password: [ // Los controles se definen directamente aquí
          '',
          [Validators.required, Validators.minLength(6)] // Nivel 3.3: Contraseña con required y minLength
        ],
        confirmPassword: [
          '',
          [Validators.required] // Nivel 3.3: Confirmar contraseña con required
        ]
      }, { // El objeto de opciones (para validadores de grupo) va como segundo argumento
        // Nivel 3.3: Validador Personalizado (Síncrono)
        // Los validadores de grupo se definen aquí.
        validators: this.passwordsMatchValidator() // Asegúrate de que esto sea la función del validador
      })
    });
  }

  passwordsMatchValidator() {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      // Nivel 3.3: Acceso a Controles en Validador de Grupo
      // Accedemos a los controles directamente desde el FormGroup que se está validando.
      const password = control.get('password');
      const confirmPassword = control.get('confirmPassword');

      // Si las contraseñas existen y no coinciden, devuelve un error.
      // Se añade una verificación adicional para asegurar que ambos campos tienen un valor
      // antes de verificar la coincidencia, para evitar que este validador se active
      // si los campos están vacíos (eso ya lo maneja Validators.required).
      /*
      if (password && confirmPassword && password.value !== confirmPassword.value &&
          (confirmPassword.dirty || confirmPassword.touched)) { // Solo aplica si se ha interactuado
        return { passwordsMismatch: true };
      }
      */

      if (password && confirmPassword && password.value !== confirmPassword.value &&
          (confirmPassword.dirty || confirmPassword.touched)) {
        return { passwordsMismatch: true};
      }
      // Si coinciden o si uno de los campos es nulo/vacío (ya cubierto por Validators.required),
      // devuelve null (sin errores).
      return null;
    };
  };
}
