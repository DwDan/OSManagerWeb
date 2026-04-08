import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceListViewComponent } from './service-list-view.component';

describe('ServiceListViewComponent', () => {
  let component: ServiceListViewComponent;
  let fixture: ComponentFixture<ServiceListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceListViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
