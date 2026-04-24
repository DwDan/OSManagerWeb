import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantListViewComponent } from './tenant-list-view.component';

describe('TenantListViewComponent', () => {
  let component: TenantListViewComponent;
  let fixture: ComponentFixture<TenantListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantListViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
