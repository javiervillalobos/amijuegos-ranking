import { Component } from '@angular/core';
import { NgIf, JsonPipe } from '@angular/common';
import { 
  ReactiveFormsModule, 
  FormGroup, 
  FormBuilder,
  Validators, 
  AbstractControl,
  AsyncValidatorFn,
  FormControl} from '@angular/forms'
import { OnInit } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-registro',
  imports: [ ReactiveFormsModule, NgIf, JsonPipe ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit {

  registroForm!: FormGroup; // Nivel 3.3: Declaramos el FormGroup

  // Nivel 3.3: Propiedades para el envío del formulario
  submitted = false; // Bandera para saber si el formulario se ha enviado
  submittedData: any; // Para almacenar los datos enviados

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
        ],
        [this.usernameValidator()] // Nivel 3.3: Añadimos el validador asíncrono para 'username'
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

  // Nivel 3.3: Validador Asíncrono
  // Este validador simula una llamada a un servidor para verificar si un nombre de usuario ya existe.
  // Devuelve un Observable que emite un objeto de error si el nombre de usuario está "tomado".
  usernameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      const username = control.value;

      // Si el campo está vacío o es nulo, no hay error asíncrono (ya cubierto por Validators.required)
      if (!username) {
        return of(null);
      }

      // Simula una llamada HTTP a un servidor.
      // En un caso real, aquí harías un 'HttpClient.get()' a tu API.
      return of(username).pipe(
        delay(1), // Simula un retraso de red de 500ms
        map(value => {
          // Nivel 3.3: Lógica de Validación Asíncrona
          // Simula que 'testuser' y 'admin' ya están tomados.
          const takenUsernames = ['testuser', 'admin'];
          if (takenUsernames.includes(value)) {
            return { usernameTaken: true }; // Devuelve un objeto de error
          }
          return null; // Si el nombre de usuario está disponible, devuelve null
        })
      );
    };
  }
  /**
   * Nivel 3.3: Manejo del Envío del Formulario
   * Maneja el envío del formulario.
   */
  onSubmit() {
    // Verificamos si el formulario es válido antes de procesar los datos.
    if (this.registroForm.valid) {
      this.submitted = true; // Marcamos que el formulario ha sido enviado
      this.submittedData = this.registroForm.value; // Capturamos los datos del formulario
      // Aquí podrías enviar los datos a un servicio o API
    } else {
      // Nivel 3.3: Marcar Controles como Tocados
      // Si el formulario es inválido, marcamos todos los controles como 'touched'
      // para que los mensajes de error se muestren al usuario.
      this.markAllAsTouched(this.registroForm);
    }
  }


  /**
   * Nivel 3.3: Función Auxiliar para Marcar Controles como Tocados
   * Marca recursivamente todos los FormControls dentro de un FormGroup (o el propio FormControl)
   * como 'touched'. Útil para mostrar todos los errores al intentar enviar un formulario inválido.
   */
  markAllAsTouched(formGroup: FormGroup | FormControl) {
    if (formGroup instanceof FormControl) {
      formGroup.markAsTouched();
    } else {
      Object.values(formGroup.controls).forEach(control => {
        if (control instanceof FormControl) {
          control.markAsTouched();
        } else if (control instanceof FormGroup) {
          this.markAllAsTouched(control); // Recursivamente para FormGroups anidados
        }
      });
    }
  }

}
