import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { confirmEmailAndSetPasswordLiterals } from '@i18n/auth/confirm-email-and-set-password.literals';
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
  selector: 'app-confirm-email-and-set-password',
  imports: [PoPageModule, PoFieldModule, PoButtonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './confirm-email-and-set-password.component.html',
  styleUrl: './confirm-email-and-set-password.component.scss',
})
export class ConfirmEmailAndSetPasswordComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authenticationService = inject(AuthenticationService);
  private readonly notification = inject(PoNotificationService);
  private readonly formBuilder = inject(FormBuilder);

  readonly literals = injectI18n(confirmEmailAndSetPasswordLiterals);

  readonly loading = signal(false);

  readonly email = this.route.snapshot.queryParamMap.get('email') ?? '';
  readonly token = this.route.snapshot.queryParamMap.get('token') ?? '';

  readonly form = this.formBuilder.nonNullable.group({
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]],
  });

  readonly formInvalid = formInvalidSignal(this.form);

  save(): void {
    this.form.markAllAsTouched();

    if (!this.email || !this.token) {
      this.notification.error(this.literals().validations.invalidLink);
      return;
    }

    if (this.formInvalid()) {
      this.notification.warning(this.literals().validations.fillAllFields);
      return;
    }

    const password = this.form.controls.password.getRawValue();
    const confirmPassword = this.form.controls.confirmPassword.getRawValue();

    if (password !== confirmPassword) {
      this.notification.warning(this.literals().validations.confirmationDoesNotMatch);
      return;
    }

    this.loading.set(true);

    this.authenticationService
      .confirmEmailAndSetPassword({
        email: this.email,
        token: this.token,
        password: password,
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
