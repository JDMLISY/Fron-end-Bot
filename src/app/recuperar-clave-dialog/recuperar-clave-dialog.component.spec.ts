import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecuperarClaveDialogComponent } from './recuperar-clave-dialog.component';

describe('RecuperarClaveDialogComponent', () => {
  let component: RecuperarClaveDialogComponent;
  let fixture: ComponentFixture<RecuperarClaveDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecuperarClaveDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecuperarClaveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
