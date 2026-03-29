import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  PoButtonModule,
  PoFieldModule,
  PoNotificationService,
  PoPageModule,
} from '@po-ui/ng-components';
import { AuthenticationService } from '@services/authentication/authentication.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [PoPageModule, PoFieldModule, PoButtonModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authenticationService = inject(AuthenticationService);
  private readonly notification = inject(PoNotificationService);

  loading = signal(false);

  email = this.route.snapshot.queryParamMap.get('email') ?? '';
  token = this.route.snapshot.queryParamMap.get('token') ?? '';

  form = {
    newPassword: '',
    confirmPassword: '',
  };

  save(): void {
    if (!this.email || !this.token) {
      this.notification.error('Link de redefinição inválido.');
      return;
    }

    if (!this.form.newPassword.trim() || !this.form.confirmPassword.trim()) {
      this.notification.warning('Preencha todos os campos.');
      return;
    }

    if (this.form.newPassword !== this.form.confirmPassword) {
      this.notification.warning('A confirmação da senha não confere.');
      return;
    }

    this.loading.set(true);

    this.authenticationService
      .resetPassword({
        email: this.email,
        token: this.token,
        newPassword: this.form.newPassword,
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.notification.success('Senha redefinida com sucesso.');
          this.router.navigate(['/login']);
        },
        error: () => {
          this.notification.error('Não foi possível redefinir a senha.');
        },
      });
  }
}
