import { CommonModule } from '@angular/common';
import { Component, ViewChild, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoginRequest } from '@models/login/requests/login.request';
import { PoI18nModule, PoLanguage, PoModule } from '@po-ui/ng-components';
import { PoPageLogin, PoPageLoginLiterals, PoPageLoginModule } from '@po-ui/ng-templates';
import { AuthenticationService } from '@services/authentication/authentication.service';
import { finalize } from 'rxjs';
import { loginLiterals } from 'src/app/i18n/auth/login.literals';
import { I18nStore } from 'src/app/i18n/shared/i18n.store';
import { injectI18n } from 'src/app/i18n/shared/inject-i18n';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  imports: [CommonModule, PoModule, PoI18nModule, PoPageLoginModule, ForgotPasswordComponent],
})
export class LoginComponent {
  @ViewChild('forgotPassword')
  forgotPassword!: ForgotPasswordComponent;

  private readonly service = inject(AuthenticationService);
  private readonly i18nStore = inject(I18nStore);
  private readonly router = inject(Router);

  readonly literals = injectI18n(loginLiterals);
  readonly loading = signal(false);

  readonly languages: PoLanguage[] = [
    { description: 'Português (BR)', language: 'pt-BR' },
    { description: 'English', language: 'en-US' },
  ];

  readonly pageLiterals = computed<PoPageLoginLiterals>(() => ({
    ...this.literals(),
  }));

  login(event: PoPageLogin): void {
    const request: LoginRequest = {
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
      });
  }

  openForgotPasswordModal(): void {
    this.forgotPassword.open();
  }

  languageChange(language: PoLanguage): void {
    this.i18nStore.setLanguage(language.language!);
  }
}
