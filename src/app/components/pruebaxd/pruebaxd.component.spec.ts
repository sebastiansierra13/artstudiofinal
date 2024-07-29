import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PruebaxdComponent } from './pruebaxd.component';

describe('PruebaxdComponent', () => {
  let component: PruebaxdComponent;
  let fixture: ComponentFixture<PruebaxdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PruebaxdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PruebaxdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
