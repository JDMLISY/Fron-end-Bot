import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoActivarmoduloComponent } from './dialogo-activarmodulo.component';

describe('DialogoActivarmoduloComponent', () => {
  let component: DialogoActivarmoduloComponent;
  let fixture: ComponentFixture<DialogoActivarmoduloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogoActivarmoduloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoActivarmoduloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
