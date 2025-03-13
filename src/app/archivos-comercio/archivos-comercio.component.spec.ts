import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivosComercioComponent } from './archivos-comercio.component';

describe('ArchivosComercioComponent', () => {
  let component: ArchivosComercioComponent;
  let fixture: ComponentFixture<ArchivosComercioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchivosComercioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivosComercioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
