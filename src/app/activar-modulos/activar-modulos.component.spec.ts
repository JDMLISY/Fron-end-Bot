import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivarModulosComponent } from './activar-modulos.component';

describe('ActivarModulosComponent', () => {
  let component: ActivarModulosComponent;
  let fixture: ComponentFixture<ActivarModulosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivarModulosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivarModulosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
