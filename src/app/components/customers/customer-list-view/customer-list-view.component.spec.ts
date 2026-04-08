import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerListViewComponent } from './customer-list-view.component';

describe('CustomerListViewComponent', () => {
  let component: CustomerListViewComponent;
  let fixture: ComponentFixture<CustomerListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerListViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
