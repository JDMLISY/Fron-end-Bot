import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatriculaAyudasComponent } from './matricula-ayudas.component';

describe('MatriculaAyudasComponent', () => {
  let component: MatriculaAyudasComponent;
  let fixture: ComponentFixture<MatriculaAyudasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatriculaAyudasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatriculaAyudasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
