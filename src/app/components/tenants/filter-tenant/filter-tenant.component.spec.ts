import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterTenantComponent } from './filter-tenant.component';

describe('FilterTenantComponent', () => {
  let component: FilterTenantComponent;
  let fixture: ComponentFixture<FilterTenantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterTenantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterTenantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
