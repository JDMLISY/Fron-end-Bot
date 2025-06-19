import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrasladoConversacionesComponent } from './traslado-conversaciones.component';

describe('TrasladoConversacionesComponent', () => {
  let component: TrasladoConversacionesComponent;
  let fixture: ComponentFixture<TrasladoConversacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrasladoConversacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrasladoConversacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
