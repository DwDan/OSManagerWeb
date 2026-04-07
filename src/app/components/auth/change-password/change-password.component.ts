import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageComponent } from '@components/shared/page-default/page.component';
import { changePasswordLiterals } from '@i18n/auth/change-password.literals';
import { commonLiterals } from '@i18n/common/common.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import {
  PoButtonModule,
  PoFieldModule,
  PoNotificationService,
  PoPageModule,
} from '@po-ui/ng-components';
import { AuthenticationService } from '@services/authentication/authentication.service';
import { finalize } from 'rxjs';
import { formInvalidSignal } from 'src/app/shared/extensions/form-extensions';

@Component({
  selector: 'app-change-password',
  imports: [PoPageModule, PoFieldModule, PoButtonModule, ReactiveFormsModule, PageComponent],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent {
  private readonly authenticationService = inject(AuthenticationService);
  private readonly notificationService = inject(PoNotificationService);
  private readonly formBuilder = inject(FormBuilder);

  readonly literals = injectI18n(changePasswordLiterals);
  readonly common = injectI18n(commonLiterals);

  readonly loading = signal(false);

  readonly form = this.formBuilder.nonNullable.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]],
  });

  readonly formInvalid = formInvalidSignal(this.form);

  get currentPasswordControl() {
    return this.form.controls.currentPassword;
  }

  get newPasswordControl() {
    return this.form.controls.newPassword;
  }

  get confirmPasswordControl() {
    return this.form.controls.confirmPassword;
  }

  save(): void {
    this.form.markAllAsTouched();

    if (this.formInvalid()) {
      this.notificationService.warning(this.literals().validations.fillAllFields);
      return;
    }

    const currentPassword = this.form.controls.currentPassword.getRawValue();
    const newPassword = this.form.controls.newPassword.getRawValue();
    const confirmPassword = this.form.controls.confirmPassword.getRawValue();

    if (newPassword !== confirmPassword) {
      this.notificationService.warning(this.literals().validations.confirmationDoesNotMatch);
      return;
    }

    if (currentPassword === newPassword) {
      this.notificationService.warning(this.literals().validations.newMustBeDifferent);
      return;
    }

    this.loading.set(true);

    this.authenticationService
      .changePassword({
        currentPassword: currentPassword,
        newPassword: newPassword,
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.notificationService.success(this.literals().notifications.success);
          this.form.reset({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          });
        },
      });
  }
}
