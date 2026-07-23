import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametrosplantillasComponent } from './parametrosplantillas.component';

describe('ParametrosplantillasComponent', () => {
  let component: ParametrosplantillasComponent;
  let fixture: ComponentFixture<ParametrosplantillasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParametrosplantillasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametrosplantillasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
