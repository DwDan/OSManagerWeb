import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FilterCustomerComponent } from './filter-customer.component';

describe('FilterCustomerComponent', () => {
  let component: FilterCustomerComponent;
  let fixture: ComponentFixture<FilterCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterCustomerComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
