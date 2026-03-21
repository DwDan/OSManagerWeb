import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PoButtonModule, PoModule, PoNotificationService } from '@po-ui/ng-components';
import { PoPageLogin, PoPageLoginModule } from '@po-ui/ng-templates';
import { finalize } from 'rxjs';
import { LoginRequest } from '../models/login/requests/login.request';
import { AuthenticationService } from '../services/authentication/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [PoModule, PoButtonModule, ReactiveFormsModule, PoPageLoginModule],
  standalone: true,
})
export class LoginComponent {
  private service = inject(AuthenticationService);
  private readonly notification = inject(PoNotificationService);
  public router = inject(Router);
  loading = signal(false);

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
