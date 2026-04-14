import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FilterMyOrderComponent } from './filter-my-order.component';

describe('FilterMyOrderComponent', () => {
  let component: FilterMyOrderComponent;
  let fixture: ComponentFixture<FilterMyOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterMyOrderComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterMyOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
