import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JuegosComponent } from './juegos.component';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

describe('JuegosComponent', () => {
  let juegos: JuegosComponent;
  let fixture: ComponentFixture<JuegosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, JuegosComponent, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(JuegosComponent);
    juegos = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse el componente', () => {
    expect(juegos).toBeTruthy();
  });

  it('debería mostrar un combo selector con la lista de juegos esperados', () => {

    const compiled = fixture.nativeElement as HTMLElement;
    const selectElements = compiled.querySelectorAll("select");
    expect(selectElements.length).toBe(1);    

    const opcionElements = selectElements[0].querySelectorAll('option');
    const expectedJuegos = [
      {"Nombre": "Seleccionar juego", "ID": "0"},
      {"Nombre": "Catan", "ID": "1"},
      {"Nombre": "Dixit", "ID": "2"},
      {"Nombre": "Carcassonne", "ID": "3"}
    ]

    expect(opcionElements.length).toBe(4);

    opcionElements.forEach((juego, index) => {
      expect(juego.textContent).toEqual(expectedJuegos[index].Nombre);
      expect(juego.getAttribute("value")).toEqual(expectedJuegos[index].ID);
    });
  });

  it('Debería existir un botón para votar', () => {

    const compiled = fixture.nativeElement as HTMLElement;
    const elementos = compiled.querySelectorAll('button');
    expect(elementos.length).toBe(1);
  });

  it('Si al votar no se ha seleccionado un juego debe emitir el mensaje "Debe seleccionar juego antes de votar"', () => {

    const expectValidationMessage = "Debe seleccionar juego antes de votar";
    const expectedSelectedValue = "0";
    const compiled = fixture.debugElement;
    const boton = compiled.query(By.css("button"));
    const juegosSelect = compiled.query(By.css("select"));
    const juegoSelectedValue = juegosSelect.properties["value"];
    expect(juegoSelectedValue).toEqual(expectedSelectedValue);

    boton.triggerEventHandler('click', null);
    fixture.detectChanges();
    const htmlComponent = fixture.nativeElement as HTMLElement;
    const messageSpan = htmlComponent.querySelector(".message");

    expect(messageSpan?.textContent).toEqual(expectValidationMessage);

  });

  it('Si al votar no se ha ingresado nombre de votante debe emitir el mensaje "Debe ingresar su nombre antes de votar"', () => {

    const expectValidationMessage = "Debe ingresar su nombre antes de votar";
    const compiled = fixture.debugElement;

    const juegosSelect = compiled.query(By.css("select"));
    juegosSelect.triggerEventHandler('change', { target: { value: "1" } });

    const boton = compiled.query(By.css("button"));
    boton.triggerEventHandler('click', null);
    fixture.detectChanges();

    const htmlComponent = compiled.nativeElement as HTMLElement;
    const messageSpan = htmlComponent.querySelector(".message");

    expect(juegos.juegoVotado).toEqual("1");
    expect(messageSpan?.textContent).toEqual(expectValidationMessage);

  });

  it('Si al votar ha ingresado nombre de votante no debe emitir mensaje', () => {

    const compiled = fixture.debugElement;

    const juegosSelect = compiled.query(By.css("select"));
    juegosSelect.triggerEventHandler('change', { target: { value: "1" } });

    const juegosVotante = fixture.debugElement.query(By.css('input')).nativeElement;
    juegosVotante.value = 'nuevo texto';
    juegosVotante.dispatchEvent(new Event('input'));

    const boton = compiled.query(By.css("button"));
    boton.triggerEventHandler('click', null);
    fixture.detectChanges();

    const messageSpan = compiled.query(By.css(".message"));

    expect(juegos.juegoVotado).toEqual("1");
    expect(messageSpan).toBeNull();

  });

  it('Al votar correctamente se actualiza ranking de juegos votados', () => {

    const compiled = fixture.debugElement;

    const juegosSelect = compiled.query(By.css("select"));
    juegosSelect.triggerEventHandler('change', { target: { value: "1" } });

    const juegosVotante = fixture.debugElement.query(By.css('input')).nativeElement;
    juegosVotante.value = 'nuevo texto';
    juegosVotante.dispatchEvent(new Event('input'));

    const boton = compiled.query(By.css("button"));
    boton.triggerEventHandler('click', null);
    fixture.detectChanges();

    const votados = compiled.queryAll(By.css("li"));
    expect(votados.length).toBe(1);

    const juegoVotado = votados[0];
    const votos = juegoVotado.query(By.css(".voto")).nativeElement as HTMLSpanElement;

    expect(votos.textContent).toEqual("1");

  });

  it('Al votar nuevamente por el mismo juego aumenta el conteo de votos del juego', () => {

    const compiled = fixture.debugElement;

    const juegosSelect = compiled.query(By.css("select"));
    juegosSelect.triggerEventHandler('change', { target: { value: "1" } });

    const juegosVotante = fixture.debugElement.query(By.css('input')).nativeElement;
    juegosVotante.value = 'nuevo texto';
    juegosVotante.dispatchEvent(new Event('input'));

    const boton = compiled.query(By.css("button"));
    boton.triggerEventHandler('click', null);
    fixture.detectChanges();

    boton.triggerEventHandler('click', null);
    fixture.detectChanges();

    const votados = compiled.queryAll(By.css("li"));
    expect(votados.length).toBe(1);

    const juegoVotado = votados[0];
    const votos = juegoVotado.query(By.css(".voto")).nativeElement as HTMLSpanElement;

    expect(votos.textContent).toEqual("2");

  });
});

