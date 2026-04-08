import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseModalComponent } from '@directives/base-modal.component';
import { forgotPasswordLiterals } from '@i18n/auth/forgot-password.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import {
  PoFieldModule,
  PoModalAction,
  PoModalModule,
  PoNotificationService,
} from '@po-ui/ng-components';
import { AuthenticationService } from '@services/authentication/authentication.service';
import { finalize } from 'rxjs';
import { formInvalidSignal } from 'src/app/shared/extensions/form-extensions';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  imports: [CommonModule, ReactiveFormsModule, PoModalModule, PoFieldModule],
  standalone: true,
})
export class ForgotPasswordComponent extends BaseModalComponent<{}, {}> {
  private readonly authenticationService = inject(AuthenticationService);
  private readonly notificationService = inject(PoNotificationService);
  private readonly formBuilder = inject(FormBuilder);

  readonly literals = injectI18n(forgotPasswordLiterals);
  readonly loading = signal(false);

  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  readonly formInvalid = formInvalidSignal(this.form);

  readonly emailDisabled = computed(() => {
    return String(this.loading());
  });

  get emailInvalid(): boolean {
    const control = this.form.controls.email;
    return control.touched && control.invalid;
  }

  readonly submitDisabled = computed(() => {
    return this.loading() || this.formInvalid();
  });

  readonly primaryAction = computed<PoModalAction>(() => ({
    label: this.loading() ? this.literals().submitting : this.literals().submit,
    action: this.send.bind(this),
    loading: this.loading(),
    disabled: this.formInvalid(),
  }));

  readonly secondaryAction = computed<PoModalAction>(() => ({
    label: this.literals().cancel,
    action: this.close.bind(this),
    disabled: this.loading(),
  }));

  send(): void {
    this.form.markAllAsTouched();

    if (this.formInvalid() || this.loading()) {
      return;
    }

    const email = this.form.controls.email.getRawValue().trim();

    this.loading.set(true);

    this.authenticationService
      .forgotPassword({ email: email })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.notificationService.success(this.literals().successMessage);
          this.submit({});
        },
      });
  }
}
