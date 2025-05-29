import { ComponentFixture, TestBed } from '@angular/core/testing';

import { estadoradicadosComponent } from './estado-radicados.component';

describe('GestionSolicitudesComponent', () => {
  let component: estadoradicadosComponent;
  let fixture: ComponentFixture<estadoradicadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ estadoradicadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(estadoradicadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
