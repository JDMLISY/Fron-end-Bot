import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalActualizarAsociadoComponent } from './modal-actualizar-asociado.component';

describe('ModalActualizarAsociadoComponent', () => {
  let component: ModalActualizarAsociadoComponent;
  let fixture: ComponentFixture<ModalActualizarAsociadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalActualizarAsociadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalActualizarAsociadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
