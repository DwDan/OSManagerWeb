import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { loginLiterals } from '@i18n/auth/login.literals';
import { I18nStore } from '@i18n/shared/i18n.store';
import { AppLanguage } from '@i18n/shared/i18n.types';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { LoginRequest } from '@models/login/requests/login.request';
import {
  PoButtonModule,
  PoButtonType,
  PoCheckboxModule,
  PoFieldModule,
  PoSelectOption,
} from '@po-ui/ng-components';
import { AuthenticationService } from '@services/authentication/authentication.service';
import { ModalService } from '@services/modal/modal.service';
import { finalize } from 'rxjs';
import { formInvalidSignal } from 'src/app/shared/extensions/form-extensions';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PoFieldModule, PoButtonModule, PoCheckboxModule],
})
export class LoginComponent {
  private readonly authenticationService = inject(AuthenticationService);
  private readonly i18nStore = inject(I18nStore);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);
  private readonly modalService = inject(ModalService);

  readonly literals = injectI18n(loginLiterals);
  readonly submitType = PoButtonType.Submit;
  readonly loading = signal(false);
  readonly loadingStr = computed(() => String(this.loading()));

  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    rememberUser: [false],
    language: [this.i18nStore.currentLanguage() as AppLanguage],
  });

  readonly formInvalid = formInvalidSignal(this.form);

  readonly languageOptions = computed<PoSelectOption[]>(() => [
    { label: 'Português (BR)', value: 'pt-BR' },
    { label: 'English', value: 'en-US' },
  ]);

  readonly submitDisabled = computed(() => {
    return this.loading() || this.formInvalid();
  });

  constructor() {
    const rememberedEmail = localStorage.getItem('rememberedUserEmail');

    if (rememberedEmail) {
      this.form.patchValue({
        email: rememberedEmail,
        rememberUser: true,
      });
    }

    this.form.controls.language.valueChanges.subscribe((value) => {
      if (!value) {
        return;
      }

      this.i18nStore.setLanguage(value as AppLanguage);
    });
  }

  get emailControl() {
    return this.form.controls.email;
  }

  get passwordControl() {
    return this.form.controls.password;
  }

  openForgotPasswordModal(): void {
    this.modalService.open(ForgotPasswordComponent, {});
  }

  login(): void {
    this.form.markAllAsTouched();

    if (this.formInvalid()) {
      return;
    }

    const request: LoginRequest = {
      Email: this.form.controls.email.getRawValue().trim(),
      Password: this.form.controls.password.getRawValue().trim(),
    };

    this.loading.set(true);

    this.authenticationService
      .login(request)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          if (this.form.controls.rememberUser.getRawValue()) {
            localStorage.setItem(
              'rememberedUserEmail',
              this.form.controls.email.getRawValue().trim(),
            );
          } else {
            localStorage.removeItem('rememberedUserEmail');
          }

          this.router.navigate(['']);
        },
      });
  }
}
