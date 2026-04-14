import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { FilterOrderComponent } from './filter-order.component';

describe('FilterOrderComponent', () => {
  let component: FilterOrderComponent;
  let fixture: ComponentFixture<FilterOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterOrderComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
