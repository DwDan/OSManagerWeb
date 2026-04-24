import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateTenantSubscriptionComponent } from './activate-tenant-subscription.component';

describe('ActivateTenantSubscriptionComponent', () => {
  let component: ActivateTenantSubscriptionComponent;
  let fixture: ComponentFixture<ActivateTenantSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivateTenantSubscriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivateTenantSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
