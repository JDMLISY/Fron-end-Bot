import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajesRespuestaComponent } from './mensajes-respuesta.component';

describe('MensajesRespuestaComponent', () => {
  let component: MensajesRespuestaComponent;
  let fixture: ComponentFixture<MensajesRespuestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MensajesRespuestaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MensajesRespuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
