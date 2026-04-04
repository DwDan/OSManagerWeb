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
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forgotPasswordLiterals } from '@i18n/auth/forgot-password.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import {
  PoFieldModule,
  PoModalAction,
  PoModalComponent,
  PoModalModule,
  PoNotificationService,
} from '@po-ui/ng-components';
import { AuthenticationService } from '@services/authentication/authentication.service';
import { finalize, map, startWith } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PoModalModule, PoFieldModule],
})
export class ForgotPasswordComponent {
  @ViewChild('modal', { static: true })
  modal!: PoModalComponent;

  @Output() closed = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<string>();

  private readonly authenticationService = inject(AuthenticationService);
  private readonly notificationService = inject(PoNotificationService);
  private readonly formBuilder = inject(FormBuilder);

  readonly literals = injectI18n(forgotPasswordLiterals);
  readonly supportEmail = input.required<string>();

  readonly loading = signal(false);

  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  readonly emailDisabled = computed(() => {
    return String(this.loading());
  });

  get emailInvalid(): boolean {
    const control = this.form.controls.email;
    return control.touched && control.invalid;
  }

  readonly formInvalid = toSignal(
    this.form.statusChanges.pipe(
      startWith(this.form.status),
      map(() => this.form.invalid),
    ),
    { initialValue: this.form.invalid },
  );

  readonly submitDisabled = computed(() => {
    return this.loading() || this.formInvalid();
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
    this.form.markAllAsTouched();

    if (this.form.invalid || this.loading()) {
      return;
    }

    const email = this.form.controls.email.getRawValue().trim();

    this.loading.set(true);

    this.authenticationService
      .forgotPassword({ email: email })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.modal.close();
          this.notificationService.success(this.literals().successMessage);
          this.submitted.emit(email);
          this.closed.emit();
        },
      });
  }

  private resetState(): void {
    this.form.reset({
      email: '',
    });
    this.loading.set(false);
  }
}
