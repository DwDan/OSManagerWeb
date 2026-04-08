import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterMyOrderComponent } from './filter-my-order.component';

describe('FilterMyOrderComponent', () => {
  let component: FilterMyOrderComponent;
  let fixture: ComponentFixture<FilterMyOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterMyOrderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterMyOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
