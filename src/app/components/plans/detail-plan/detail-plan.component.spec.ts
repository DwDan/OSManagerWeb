import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPlanComponent } from './detail-plan.component';

describe('DetailPlanComponent', () => {
  let component: DetailPlanComponent;
  let fixture: ComponentFixture<DetailPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailPlanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
