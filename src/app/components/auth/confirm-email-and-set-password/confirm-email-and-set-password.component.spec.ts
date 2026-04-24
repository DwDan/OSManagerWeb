import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmEmailAndSetPasswordComponent } from './confirm-email-and-set-password.component';

describe('ConfirmEmailAndSetPasswordComponent', () => {
  let component: ConfirmEmailAndSetPasswordComponent;
  let fixture: ComponentFixture<ConfirmEmailAndSetPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmEmailAndSetPasswordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmEmailAndSetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
