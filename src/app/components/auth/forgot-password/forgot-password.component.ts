import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Output,
  ViewChild,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PoFieldModule,
  PoModalAction,
  PoModalComponent,
  PoModalModule,
  PoNotificationService,
} from '@po-ui/ng-components';
import { AuthenticationService } from '@services/authentication/authentication.service';
import { finalize } from 'rxjs';
import { forgotPasswordLiterals } from 'src/app/i18n/auth/forgot-password.literals';
import { injectI18n } from 'src/app/i18n/shared/inject-i18n';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  standalone: true,
  imports: [CommonModule, FormsModule, PoModalModule, PoFieldModule],
})
export class ForgotPasswordComponent {
  @ViewChild('modal', { static: true })
  modal!: PoModalComponent;

  @Output() closed = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<string>();

  private readonly authenticationService = inject(AuthenticationService);
  private readonly notificationService = inject(PoNotificationService);

  readonly literals = injectI18n(forgotPasswordLiterals);
  readonly supportEmail = input.required<string>();

  readonly loading = signal(false);
  readonly email = signal('');
  readonly emailTouched = signal(false);

  readonly emailDisabled = computed(() => {
    return String(this.loading());
  });

  readonly emailInvalid = computed(() => {
    const value = this.email().trim();

    if (!this.emailTouched()) {
      return false;
    }

    if (!value) {
      return true;
    }

    return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  });

  readonly submitDisabled = computed(() => {
    return this.loading() || this.emailInvalid() || !this.email().trim();
  });

  readonly primaryAction = computed<PoModalAction>(() => ({
    label: this.loading() ? this.literals().submitting : this.literals().submit,
    action: this.submit.bind(this),
    disabled: this.submitDisabled(),
  }));

  readonly secondaryAction = computed<PoModalAction>(() => ({
    label: this.literals().cancel,
    action: this.close.bind(this),
    disabled: this.loading(),
  }));

  open(): void {
    this.resetState();
    this.modal.open();
  }

  close(): void {
    this.modal.close();
    this.closed.emit();
  }

  submit(): void {
    this.emailTouched.set(true);

    if (this.emailInvalid() || !this.email().trim() || this.loading()) {
      return;
    }

    this.loading.set(true);

    this.authenticationService
      .forgotPassword({ email: this.email().trim() })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          const email = this.email().trim();

          this.modal.close();
          this.notificationService.success(this.literals().successMessage);
          this.submitted.emit(email);
          this.closed.emit();
        },
      });
  }

  setEmail(value: string): void {
    this.email.set(value);
  }

  markTouched(): void {
    this.emailTouched.set(true);
  }

  private resetState(): void {
    this.email.set('');
    this.emailTouched.set(false);
    this.loading.set(false);
  }
}
