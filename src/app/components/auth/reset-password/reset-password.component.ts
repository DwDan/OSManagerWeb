import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { resetPasswordLiterals } from '@i18n/auth/reset-password.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
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
  imports: [PoPageModule, PoFieldModule, PoButtonModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authenticationService = inject(AuthenticationService);
  private readonly notification = inject(PoNotificationService);

  readonly literals = injectI18n(resetPasswordLiterals);

  loading = signal(false);

  email = this.route.snapshot.queryParamMap.get('email') ?? '';
  token = this.route.snapshot.queryParamMap.get('token') ?? '';

  form = {
    newPassword: '',
    confirmPassword: '',
  };

  save(): void {
    if (!this.email || !this.token) {
      this.notification.error(this.literals().validations.invalidLink);
      return;
    }

    if (!this.form.newPassword.trim() || !this.form.confirmPassword.trim()) {
      this.notification.warning(this.literals().validations.fillAllFields);
      return;
    }

    if (this.form.newPassword !== this.form.confirmPassword) {
      this.notification.warning(this.literals().validations.confirmationDoesNotMatch);
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
          this.notification.success(this.literals().notifications.success);
          this.router.navigate(['/login']);
        },
      });
  }
}
