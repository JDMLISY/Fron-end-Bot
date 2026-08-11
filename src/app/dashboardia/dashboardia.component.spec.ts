import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardiaComponent } from './dashboardia.component';

describe('DashboardiaComponent', () => {
  let component: DashboardiaComponent;
  let fixture: ComponentFixture<DashboardiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardiaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
