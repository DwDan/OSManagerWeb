import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanListViewComponent } from './plan-list-view.component';

describe('PlanListViewComponent', () => {
  let component: PlanListViewComponent;
  let fixture: ComponentFixture<PlanListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanListViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
