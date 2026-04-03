import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { LoginRequest } from '@models/login/requests/login.request';
import { PoLanguage } from '@po-ui/ng-components';
import {
  PoModalPasswordRecoveryType,
  PoPageLogin,
  PoPageLoginLiterals,
  PoPageLoginRecovery,
} from '@po-ui/ng-templates';
import { AuthenticationService } from '@services/authentication/authentication.service';
import { finalize } from 'rxjs';
import { loginLiterals } from 'src/app/i18n/auth/login.literals';
import { I18nStore } from 'src/app/i18n/shared/i18n.store';
import { injectI18n } from 'src/app/i18n/shared/inject-i18n';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    standalone: false
})
export class LoginComponent {
  private service = inject(AuthenticationService);
  private readonly i18nStore = inject(I18nStore);
  public router = inject(Router);

  readonly literals = injectI18n(loginLiterals);
  loading = signal(false);

  readonly recovery = computed<PoPageLoginRecovery>(() => ({
    url: `${environment.apiUrl}/auth/forgot-password`,
    type: PoModalPasswordRecoveryType.Email,
    contactMail: this.literals().supportEmail,
  }));

  readonly languages = computed<PoLanguage[]>(() => [
    { description: 'Português (BR)', language: 'pt-BR' },
    { description: 'English', language: 'en-US' },
  ]);

  readonly pageLiterals = computed<PoPageLoginLiterals>(() => ({
    ...this.literals(),
  }));

  login(event: PoPageLogin): void {
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
      });
  }

  languageChange(language: PoLanguage): void {
    this.i18nStore.setLanguage(language.language!);
  }
}
