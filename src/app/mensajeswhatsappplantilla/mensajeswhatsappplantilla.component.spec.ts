import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajeswhatsappplantillaComponent } from './mensajeswhatsappplantilla.component';

describe('MensajeswhatsappplantillaComponent', () => {
  let component: MensajeswhatsappplantillaComponent;
  let fixture: ComponentFixture<MensajeswhatsappplantillaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MensajeswhatsappplantillaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MensajeswhatsappplantillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
