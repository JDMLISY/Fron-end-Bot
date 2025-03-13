import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LectorQRComponent } from './lector-qr.component';

describe('LectorQRComponent', () => {
  let component: LectorQRComponent;
  let fixture: ComponentFixture<LectorQRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LectorQRComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LectorQRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
