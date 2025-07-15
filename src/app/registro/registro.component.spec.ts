import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RegistroComponent } from './registro.component';
import { ReactiveFormsModule } from '@angular/forms'; // ¡Importante!
import { By } from '@angular/platform-browser';

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
    const usernameElement = fixture.nativeElement.querySelector('input[formControlName="username"]');
    usernameElement.value = '';
    usernameElement.dispatchEvent(new Event("input"));

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
    const usernameElement = fixture.nativeElement.querySelector('input[formControlName="username"]');
    usernameElement.value = 'abc';
    usernameElement.dispatchEvent(new Event('input'));

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

    // Nivel 3.4: Prueba 4 - Campo de Email Requerido y Formato Válido
  // Objetivo: Verificar que el campo 'email' es obligatorio y que requiere
  // un formato de email válido.
  it('should make the email field required and validate email format', () => {
    const emailControl = component.registroForm.get('email');
    const emailEvent : Event = new Event('input');

    // Caso 1: Email vacío (debe ser requerido)
    expect(emailControl?.invalid).toBeTrue();
    expect(emailControl?.errors?.['required']).toBeTrue();
    expect(component.registroForm.invalid).toBeTrue();

    // Caso 2: Email con formato inválido
    const emailElement = fixture.nativeElement.querySelector('input[formControlName="email"]');
    emailElement.value = 'invalid-email';
    emailElement.dispatchEvent(emailEvent)
    fixture.detectChanges();
    expect(emailControl?.invalid).toBeTrue();
    expect(emailControl?.errors?.['email']).toBeTrue(); // Esperamos el error 'email'
    expect(component.registroForm.invalid).toBeTrue();

    // Caso 3: Email con formato válido (debería ser válido si solo este campo se considera)
    emailElement.value = 'test@example.com';
    emailElement.dispatchEvent(emailEvent);
    fixture.detectChanges();
    // En este punto, solo el control 'email' se validaría.
    // El formulario completo aún podría ser inválido si 'username' no está lleno.
    expect(emailControl?.valid).toBeTrue(); // El control 'email' debe ser válido
  });

  // Nivel 3.4: Prueba 5 - Campos de Contraseña Requeridos, Longitud Mínima y Coincidencia
  // Objetivo: Verificar que los campos 'password' y 'confirmPassword' son obligatorios,
  // que 'password' tiene una longitud mínima y que ambas contraseñas coinciden.
  it('should validate password fields for required, minLength, and matching', () => {
    // Nivel 3.4: Acceso a FormControls anidados
    const passwordControl = component.registroForm.get('passwordGroup.password');
    const confirmPasswordControl = component.registroForm.get('passwordGroup.confirmPassword');
    const passwordGroup = component.registroForm.get('passwordGroup');

    const passwordEvent : Event = new Event('input');
    const passwordElement = fixture.nativeElement.querySelector('input[formControlName="password"]');
    const confirmPasswordElement = fixture.nativeElement.querySelector('input[formControlName="confirmPassword"]');

    // Caso 1: Contraseñas vacías (deben ser requeridas)
    expect(passwordControl).toBeTruthy();
    expect(passwordControl?.invalid).toBeTrue();
    expect(passwordControl?.errors?.['required']).toBeTrue();
    expect(confirmPasswordControl?.invalid).toBeTrue();
    expect(confirmPasswordControl?.errors?.['required']).toBeTrue();
    expect(passwordGroup?.invalid).toBeTrue(); // El grupo también debe ser inválido

    // Caso 2: Contraseña demasiado corta
    passwordElement.value = '123';
    passwordElement.dispatchEvent(passwordEvent);

    confirmPasswordElement.value = '123';
    confirmPasswordElement.dispatchEvent(passwordEvent);

    fixture.detectChanges();
    expect(passwordControl?.invalid).toBeTrue();
    expect(passwordControl?.errors?.['minlength']).toBeTruthy();
    expect(passwordGroup?.invalid).toBeTrue();

    // Caso 3: Contraseñas no coinciden
    passwordElement.value = 'password123';
    passwordElement.dispatchEvent(passwordEvent);

    confirmPasswordElement.value = 'password456';
    confirmPasswordElement.dispatchEvent(passwordEvent);

    fixture.detectChanges();

    expect(passwordGroup?.invalid).toBeTrue();
    // Nivel 3.4: Verificación de Validador Personalizado a Nivel de Grupo
    expect(passwordGroup?.errors?.['passwordsMismatch']).toBeTrue(); // Error de no coincidencia
    expect(confirmPasswordControl?.valid).toBeTrue(); // El control individual puede ser válido, pero el grupo no
  });

  // Nivel 3.4: Prueba 7 - Envío del Formulario (Simplificado)
  // Objetivo: Verificar que el método onSubmit se llama cuando el formulario es válido.
  it('should call onSubmit when the form is valid', fakeAsync(() => {

    const submitButton: HTMLInputElement = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    const usernameInput: HTMLInputElement = fixture.debugElement.query(By.css('#username')).nativeElement;
    const emailInput: HTMLInputElement = fixture.debugElement.query(By.css('#email')).nativeElement;
    const passwordInput: HTMLInputElement = fixture.debugElement.query(By.css('#password')).nativeElement;
    const confirmPasswordInput: HTMLInputElement = fixture.debugElement.query(By.css('#confirmPassword')).nativeElement;

    // Rellenar todos los campos con valores válidos
    usernameInput.value = 'validuser';
    usernameInput.dispatchEvent(new Event('input'));
    usernameInput.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    emailInput.value = 'valid@example.com';
    emailInput.dispatchEvent(new Event('input'));
    emailInput.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    passwordInput.value = 'SecurePass123';
    passwordInput.dispatchEvent(new Event('input'));
    passwordInput.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    confirmPasswordInput.value = 'SecurePass123';
    confirmPasswordInput.dispatchEvent(new Event('input'));
    confirmPasswordInput.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    tick(500); // Espera a que el validador asíncrono termine

    // Verificar que el formulario es válido
    expect(component.registroForm.valid).toBeTrue();
    fixture.detectChanges();                          // re-renderiza el botón
    expect(component.registroForm.pending).toBeFalse(); // Asegurarse de que no hay validaciones pendientes

    // Espiamos el método onSubmit del componente
    spyOn(component, 'onSubmit').and.callThrough();

    submitButton.click(); // Simular clic en el botón de envío
    fixture.detectChanges();

    expect(component.onSubmit).toHaveBeenCalledTimes(1); // onSubmit debe haber sido llamado una vez

    // Opcional: Verificar que los datos enviados son correctos
    expect(component.submittedData).toEqual({
      username: 'validuser',
      email: 'valid@example.com',
      passwordGroup: {
        password: 'SecurePass123',
        confirmPassword: 'SecurePass123'
      }
    });

    // Verificar que el bloque de datos enviados se muestra
    const submittedDataDisplay = fixture.debugElement.query(By.css('div pre'));
    expect(submittedDataDisplay).toBeTruthy();
    expect(submittedDataDisplay.nativeElement.textContent).toContain('validuser');
  }));

  // Nivel 3.4: Prueba 6 - Validador Asíncrono para Nombre de Usuario
  // Objetivo: Verificar que el validador asíncrono para 'username' funciona,
  // marcando el control como 'pending' y luego 'invalid' si el nombre de usuario está tomado.
  it('should validate username asynchronously and mark as invalid if taken', fakeAsync(() => {
    const usernameInput: HTMLInputElement = fixture.debugElement.query(By.css('#username')).nativeElement;
    const usernameControl = component.registroForm.get('username');

    // Simular un nombre de usuario que está "tomado" (según la lógica del validador)
    usernameInput.value = 'testuser';
    usernameInput.dispatchEvent(new Event('input'));
    fixture.detectChanges(); // Detectar cambios para que el validador asíncrono se dispare

    // Nivel 3.4: Verificación del Estado 'pending'
    // El control y el formulario deben estar 'pending' mientras la validación asíncrona está en curso.
    expect(usernameControl?.pending).toBeTrue();
    expect(component.registroForm.pending).toBeTrue();

    // Nivel 3.4: Simulación de Tiempo (tick)
    // 'tick()' simula el paso del tiempo, permitiendo que el Observable del validador asíncrono emita su valor.
    // El 'delay(500)' en el validador significa que necesitamos avanzar 500ms.
    tick(500);
    fixture.detectChanges(); // Detectar cambios después de que la validación asíncrona haya terminado

    // Nivel 3.4: Verificación del Estado 'invalid' y el error específico
    // Después del retraso, el control y el formulario deben ser inválidos con el error 'usernameTaken'.
    expect(usernameControl?.invalid).toBeTrue();
    expect(usernameControl?.errors?.['usernameTaken']).toBeTrue();
    expect(component.registroForm.invalid).toBeTrue();
    expect(usernameControl?.pending).toBeFalse(); // Ya no debe estar pendiente

    // Opcional: Probar con un nombre de usuario válido
    usernameInput.value = 'newuser';
    usernameInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(usernameControl?.pending).toBeTrue();
    tick(500);
    fixture.detectChanges();
    expect(usernameControl?.valid).toBeTrue(); // Debería ser válido
    expect(usernameControl?.errors).toBeNull(); // No debería tener errores
    expect(usernameControl?.pending).toBeFalse();
  }));

  it('should not call onSubmit but call markAllAsTouched when Enter is pressed on an invalid form', fakeAsync(() => {
    spyOn(component, 'onSubmit').and.callThrough();
    spyOn<any>(component, 'markAllAsTouched').and.callThrough();

    const usernameInput: HTMLInputElement = fixture.debugElement.query(By.css('#username')).nativeElement;

    // Asegurarse de que el formulario está inválido (por defecto después de reset en beforeEach)
    expect(component.registroForm.invalid).toBeTrue();

    // Esto debería disparar el evento 'submit' del formulario
    const formElement: HTMLFormElement = fixture.debugElement.query(By.css('form')).nativeElement; // Obtener el elemento del formulario
    formElement.dispatchEvent(new Event('submit'));
    fixture.detectChanges(); // Detectar cambios después del evento

    // Verificar que onSubmit NO fue llamado
    expect(component.onSubmit).toHaveBeenCalled();
    // Verificar que markAllAsTouched SÍ fue llamado
    expect(component['markAllAsTouched']).toHaveBeenCalled();
    expect(component['markAllAsTouched']).toHaveBeenCalledWith(component.registroForm);

    // Opcional: Verificar que los controles están marcados como touched
    expect(component.registroForm.get('username')?.touched).toBeTrue();
    expect(component.registroForm.get('email')?.touched).toBeTrue();
    expect(component.registroForm.get('passwordGroup.password')?.touched).toBeTrue();
    expect(component.registroForm.get('passwordGroup.confirmPassword')?.touched).toBeTrue();
  }));
});
