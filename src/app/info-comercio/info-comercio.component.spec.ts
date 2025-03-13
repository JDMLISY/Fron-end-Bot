import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoComercioComponent } from './info-comercio.component';

describe('InfoComercioComponent', () => {
  let component: InfoComercioComponent;
  let fixture: ComponentFixture<InfoComercioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoComercioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoComercioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
