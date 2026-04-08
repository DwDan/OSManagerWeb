import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseModalComponent } from '@directives/base-modal.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { usersLiterals } from '@i18n/users/users.literals';
import { CreateUserRequest } from '@models/users/requests/create-user.request';
import {
  PoFieldModule,
  PoModalAction,
  PoModalModule,
  PoNotificationService,
} from '@po-ui/ng-components';
import { UsersService } from '@services/users/users.service';
import { finalize } from 'rxjs';
import { formInvalidSignal } from 'src/app/shared/extensions/form-extensions';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PoFieldModule, PoModalModule],
})
export class CreateUserComponent extends BaseModalComponent<void, { confirmed: boolean }> {
  private readonly service = inject(UsersService);
  private readonly notification = inject(PoNotificationService);
  private readonly formBuilder = inject(FormBuilder);

  readonly literals = injectI18n(usersLiterals);
  readonly common = injectI18n(commonLiterals);

  readonly loading = signal(false);

  readonly form = this.formBuilder.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  readonly formInvalid = formInvalidSignal(this.form);

  readonly primaryAction = computed<PoModalAction>(() => ({
    label: this.literals().modals.create.confirm,
    action: () => this.createUser(),
    loading: this.loading(),
    disabled: this.formInvalid(),
  }));

  readonly secondaryAction = computed<PoModalAction>(() => ({
    label: this.common().cancel,
    loading: this.loading(),
    action: this.close.bind(this),
  }));

  private createUser(): void {
    this.form.markAllAsTouched();

    if (this.formInvalid()) {
      this.notification.warning(this.literals().validations.fillAllFieldsToCreate);
      return;
    }

    const request: CreateUserRequest = {
      firstName: this.form.controls.firstName.getRawValue(),
      lastName: this.form.controls.lastName.getRawValue(),
      email: this.form.controls.email.getRawValue(),
      password: this.form.controls.password.getRawValue(),
    };

    this.loading.set(true);

    this.service
      .create(request)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.notification.success(this.literals().notifications.created);
          this.submit({ confirmed: true });
        },
      });
  }
}
