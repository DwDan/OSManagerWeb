import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdensServicoComponent } from './ordens-servico.component';

describe('OrdensServicoComponent', () => {
  let component: OrdensServicoComponent;
  let fixture: ComponentFixture<OrdensServicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdensServicoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrdensServicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
