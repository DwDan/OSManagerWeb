import { CommonModule } from '@angular/common';
import { Component, ViewChild, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginRequest } from '@models/login/requests/login.request';
import {
  PoButtonModule,
  PoButtonType,
  PoCheckboxModule,
  PoFieldModule,
  PoNotificationService,
  PoSelectOption,
} from '@po-ui/ng-components';
import { AuthenticationService } from '@services/authentication/authentication.service';
import { finalize } from 'rxjs';
import { loginLiterals } from 'src/app/i18n/auth/login.literals';
import { I18nStore } from 'src/app/i18n/shared/i18n.store';
import { AppLanguage } from 'src/app/i18n/shared/i18n.types';
import { injectI18n } from 'src/app/i18n/shared/inject-i18n';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PoFieldModule,
    PoButtonModule,
    PoCheckboxModule,
    ForgotPasswordComponent,
  ],
})
export class LoginComponent {
  @ViewChild('forgotPassword')
  forgotPassword!: ForgotPasswordComponent;

  constructor() {
    const rememberedEmail = localStorage.getItem('rememberedUserEmail');

    if (rememberedEmail) {
      this.email.set(rememberedEmail);
      this.rememberUser.set(true);
    }
  }

  private readonly authenticationService = inject(AuthenticationService);
  private readonly i18nStore = inject(I18nStore);
  private readonly router = inject(Router);
  private readonly notificationService = inject(PoNotificationService);

  readonly literals = injectI18n(loginLiterals);
  readonly submitType = PoButtonType.Submit;
  readonly loading = signal(false);
  readonly email = signal('');
  readonly password = signal('');
  readonly rememberUser = signal(false);
  readonly emailTouched = signal(false);
  readonly passwordTouched = signal(false);
  readonly loadingStr = computed(() => String(this.loading()));

  readonly languageOptions = computed<PoSelectOption[]>(() => [
    { label: 'Português (BR)', value: 'pt-BR' },
    { label: 'English', value: 'en-US' },
  ]);

  readonly selectedLanguage = computed(() => this.i18nStore.currentLanguage());

  readonly emailInvalid = computed(() => {
    const value = this.email().trim();

    if (!value) {
      return true;
    }

    return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  });

  readonly passwordInvalid = computed(() => {
    if (!this.passwordTouched()) {
      return false;
    }

    return !this.password().trim();
  });

  readonly submitDisabled = computed(() => {
    return (
      this.loading() ||
      this.emailInvalid() ||
      this.passwordInvalid() ||
      !this.email().trim() ||
      !this.password().trim()
    );
  });

  setEmail(value: string): void {
    this.email.set(value);
  }

  setPassword(value: string): void {
    this.password.set(value);
  }

  setRememberUser(value: boolean): void {
    this.rememberUser.set(value);
  }

  markEmailTouched(): void {
    this.emailTouched.set(true);
  }

  markPasswordTouched(): void {
    this.passwordTouched.set(true);
  }

  changeLanguage(value: string | number): void {
    this.i18nStore.setLanguage(value as AppLanguage);
  }

  openForgotPasswordModal(): void {
    this.forgotPassword.open();
  }

  login(): void {
    this.emailTouched.set(true);
    this.passwordTouched.set(true);

    if (this.submitDisabled()) {
      return;
    }

    const request: LoginRequest = {
      Email: this.email().trim(),
      Password: this.password().trim(),
    };

    this.loading.set(true);

    this.authenticationService
      .login(request)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          if (this.rememberUser()) {
            localStorage.setItem('rememberedUserEmail', this.email().trim());
          } else {
            localStorage.removeItem('rememberedUserEmail');
          }

          this.router.navigate(['']);
        },
      });
  }
}
