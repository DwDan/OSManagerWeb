import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PoButtonModule,
  PoFieldModule,
  PoNotificationService,
  PoPageModule,
} from '@po-ui/ng-components';
import { AuthenticationService } from '@services/authentication/authentication.service';
import { finalize } from 'rxjs';
import { changePasswordLiterals } from 'src/app/i18n/auth/change-password.literals';
import { commonLiterals } from 'src/app/i18n/common/common.literals';
import { injectI18n } from 'src/app/i18n/shared/inject-i18n';

@Component({
    selector: 'app-change-password',
    imports: [PoPageModule, PoFieldModule, PoButtonModule, FormsModule],
    templateUrl: './change-password.component.html',
    styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
  private authenticationService = inject(AuthenticationService);
  private notificationService = inject(PoNotificationService);

  readonly literals = injectI18n(changePasswordLiterals);
  readonly common = injectI18n(commonLiterals);

  loading = signal(false);

  form = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  save(): void {
    if (
      !this.form.currentPassword.trim() ||
      !this.form.newPassword.trim() ||
      !this.form.confirmPassword.trim()
    ) {
      this.notificationService.warning(this.literals().validations.fillAllFields);
      return;
    }

    if (this.form.newPassword !== this.form.confirmPassword) {
      this.notificationService.warning(this.literals().validations.confirmationDoesNotMatch);
      return;
    }

    if (this.form.currentPassword === this.form.newPassword) {
      this.notificationService.warning(this.literals().validations.newMustBeDifferent);
      return;
    }

    this.loading.set(true);

    this.authenticationService
      .changePassword({
        currentPassword: this.form.currentPassword,
        newPassword: this.form.newPassword,
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.notificationService.success(this.literals().notifications.success);

          this.form = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          };
        },
      });
  }
}
