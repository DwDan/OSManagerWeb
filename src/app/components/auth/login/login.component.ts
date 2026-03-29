import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { LoginRequest } from '@models/login/requests/login.request';
import { PoNotificationService } from '@po-ui/ng-components';
import { PoModalPasswordRecoveryType, PoPageLogin, PoPageLoginRecovery } from '@po-ui/ng-templates';
import { AuthenticationService } from '@services/authentication/authentication.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private service = inject(AuthenticationService);
  private readonly notification = inject(PoNotificationService);
  public router = inject(Router);
  loading = signal(false);

  recovery: PoPageLoginRecovery = {
    url: `${environment.apiUrl}/auth/forgot-password`,
    type: PoModalPasswordRecoveryType.Email,
    contactMail: 'suporte@osmanager.com.br',
  };

  login(event: PoPageLogin) {
    const request = <LoginRequest>{
      Email: event.login,
      Password: event.password,
    };

    this.loading.set(true);

    this.service
      .login(request)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.router.navigate(['']);
        },
        error: () => {
          this.notification.error('Não foi possível realizar o login.');
        },
      });
  }
}
