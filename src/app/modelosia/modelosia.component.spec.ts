import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelosiaComponent } from './modelosia.component';

describe('ModelosiaComponent', () => {
  let component: ModelosiaComponent;
  let fixture: ComponentFixture<ModelosiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelosiaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelosiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
