import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVerCuposComercioComponent } from './modal-ver-cupos-comercio.component';

describe('ModalVerCuposComercioComponent', () => {
  let component: ModalVerCuposComercioComponent;
  let fixture: ComponentFixture<ModalVerCuposComercioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalVerCuposComercioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalVerCuposComercioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
