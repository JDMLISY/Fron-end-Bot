import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlujoConversacionalComponent } from './flujo-conversacional.component';

describe('FlujoConversacionalComponent', () => {
  let component: FlujoConversacionalComponent;
  let fixture: ComponentFixture<FlujoConversacionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlujoConversacionalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlujoConversacionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
