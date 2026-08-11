import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentesiaComponent } from './agentesia.component';

describe('AgentesiaComponent', () => {
  let component: AgentesiaComponent;
  let fixture: ComponentFixture<AgentesiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentesiaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentesiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
