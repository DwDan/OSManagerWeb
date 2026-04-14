import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { OrderListViewComponent } from './order-list-view.component';

describe('OrderListViewComponent', () => {
  let component: OrderListViewComponent;
  let fixture: ComponentFixture<OrderListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderListViewComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
