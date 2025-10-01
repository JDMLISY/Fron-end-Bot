import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVerComprasComponent } from './modal-ver-compras.component';

describe('ModalVerComprasComponent', () => {
  let component: ModalVerComprasComponent;
  let fixture: ComponentFixture<ModalVerComprasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalVerComprasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalVerComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
