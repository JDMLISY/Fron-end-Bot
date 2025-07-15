import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEntidadComponent } from './dialog-entidad.component';

describe('DialogEntidadComponent', () => {
  let component: DialogEntidadComponent;
  let fixture: ComponentFixture<DialogEntidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEntidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEntidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
