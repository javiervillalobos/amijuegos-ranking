import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BotonVotarComponent } from './boton-votar.component';
import { By } from '@angular/platform-browser';

describe('BotonVotarComponent', () => {
  let component: BotonVotarComponent;
  let fixture: ComponentFixture<BotonVotarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotonVotarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BotonVotarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debería ser creado', () => {
    expect(component).toBeTruthy();
  });

  it ('Debería ser clickeable', () => {
    const compiled = fixture.debugElement;
    const boton = compiled.query(By.css("button"));
    boton.triggerEventHandler('click', null);
    fixture.detectChanges();
    
    expect(component.clicked).toEqual(true);
  });

});
