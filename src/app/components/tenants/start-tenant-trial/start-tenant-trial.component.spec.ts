import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartTenantTrialComponent } from './start-tenant-trial.component';

describe('StartTenantTrialComponent', () => {
  let component: StartTenantTrialComponent;
  let fixture: ComponentFixture<StartTenantTrialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartTenantTrialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartTenantTrialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
