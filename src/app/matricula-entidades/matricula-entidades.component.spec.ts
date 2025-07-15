import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatriculaEntidadesComponent } from './matricula-entidades.component';

describe('MatriculaEntidadesComponent', () => {
  let component: MatriculaEntidadesComponent;
  let fixture: ComponentFixture<MatriculaEntidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatriculaEntidadesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatriculaEntidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
