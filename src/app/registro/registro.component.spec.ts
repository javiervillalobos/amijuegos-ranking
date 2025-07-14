import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroComponent } from './registro.component';
import { ReactiveFormsModule } from '@angular/forms'; // ¡Importante!

describe('RegistroComponent (TDD - Paso 1)', () => {
  let component: RegistroComponent;
  let fixture: ComponentFixture<RegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Nivel 3.4: Configuración de TestBed
      // Para probar formularios reactivos, es esencial importar ReactiveFormsModule
      // en el TestBed. También importamos el componente standalone directamente.
      imports: [RegistroComponent, ReactiveFormsModule]
    })
    .compileComponents(); // Compila los componentes del módulo de prueba

    fixture = TestBed.createComponent(RegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Detecta cambios iniciales para renderizar el componente
  });

  // Nivel 3.4: Primera Prueba - Creación del Componente y Formulario
  // Objetivo: Verificar que el componente se crea correctamente y que el
  // FormGroup 'registroForm' se inicializa.
  it('should create the component and initialize the registration form', () => {
    // Verificamos que la instancia del componente exista.
    expect(component).toBeTruthy();
    // Verificamos que el FormGroup 'registroForm' esté definido.
    expect(component.registroForm).toBeDefined();
    // Verificamos que 'registroForm' sea una instancia de FormGroup.
    expect(component.registroForm.constructor.name).toBe('FormGroup');
  });

  // Nivel 3.4: Prueba 2 - Campo de Nombre de Usuario Requerido
  // Objetivo: Verificar que el campo 'username' es obligatorio y que el formulario
  // es inválido si el nombre de usuario está vacío.
  it('should make the username field required and the form invalid if username is empty', () => {
    // Obtenemos una referencia al FormControl 'username'
    const usernameControl = component.registroForm.get('username');

    // Nivel 3.4: Simulación de Interacción
    // Establecemos el valor del control a una cadena vacía.
    usernameControl?.setValue('');

    // Nivel 3.4: Detección de Cambios
    // No es estrictamente necesario fixture.detectChanges() aquí para el control,
    // ya que estamos interactuando directamente con el modelo reactivo.
    // Sin embargo, para que el formulario general se actualice y refleje el estado
    // del control, es buena práctica llamarlo.
    fixture.detectChanges();

    // Nivel 3.4: Verificación del Estado de Validación
    // Esperamos que el control sea inválido.
    expect(usernameControl?.invalid).toBeTrue();
    // Esperamos que el error 'required' esté presente.
    expect(usernameControl?.errors?.['required']).toBeTrue();
    // Esperamos que el formulario completo sea inválido.
    expect(component.registroForm.invalid).toBeTrue();
  });

  it('should require a minimum length for the username field', () => {
    const usernameControl = component.registroForm.get('username');

    // Nivel 3.4: Simulación de Interacción
    // Establecemos un valor que es más corto que la longitud mínima esperada (ej. 4 caracteres)
    usernameControl?.setValue('abc'); // Solo 3 caracteres

    // Nivel 3.4: Detección de Cambios
    fixture.detectChanges();

    // Nivel 3.4: Verificación del Estado de Validación
    // Esperamos que el control sea inválido.
    expect(usernameControl?.invalid).toBeTrue();
    // CORRECCIÓN: Verificamos que el control tenga el error 'minlength' (que exista el objeto de error),
    // o que el método hasError devuelva true para 'minlength'.
    // expect(usernameControl?.errors?.['minlength']).toBeTrue(); // <-- Esto era incorrecto
    expect(usernameControl?.errors?.['minlength']).toBeTruthy(); // Verifica que el objeto de error exista y sea truthy
    // Opcional, una forma más idiomática de Angular:
    expect(usernameControl?.hasError('minlength')).toBeTrue();

    expect(usernameControl?.errors?.['minlength'].requiredLength).toBe(4);
    expect(usernameControl?.errors?.['minlength'].actualLength).toBe(3);

    // Esperamos que el formulario completo sea inválido.
    expect(component.registroForm.invalid).toBeTrue();
  });

});
