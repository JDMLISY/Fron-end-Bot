import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListasAsociadosComponent } from './listas-asociados.component';

describe('ListasAsociadosComponent', () => {
  let component: ListasAsociadosComponent;
  let fixture: ComponentFixture<ListasAsociadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListasAsociadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListasAsociadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
