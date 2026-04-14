import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { PoNotificationService } from '@po-ui/ng-components';
import { AuthenticationService } from '@services/authentication/authentication.service';
import { of } from 'rxjs';
import { ResetPasswordComponent } from './reset-password.component';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;

  const activatedRouteMock = {
    snapshot: {
      queryParamMap: {
        get: (key: string) => {
          if (key === 'email') return 'teste@email.com';
          if (key === 'token') return 'token-123';
          return null;
        },
      },
    },
  };

  const routerMock = {
    navigate: jasmine.createSpy('navigate'),
  };

  const authServiceMock = {
    resetPassword: jasmine.createSpy('resetPassword').and.returnValue(of({})),
  };

  const notificationMock = {
    success: jasmine.createSpy('success'),
    warning: jasmine.createSpy('warning'),
    error: jasmine.createSpy('error'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetPasswordComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: Router, useValue: routerMock },
        { provide: AuthenticationService, useValue: authServiceMock },
        { provide: PoNotificationService, useValue: notificationMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
