import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticascampaniasComponent } from './estadisticascampanias.component';

describe('EstadisticascampaniasComponent', () => {
  let component: EstadisticascampaniasComponent;
  let fixture: ComponentFixture<EstadisticascampaniasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstadisticascampaniasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadisticascampaniasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
