import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseModalComponent } from '@directives/base-modal.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { usersLiterals } from '@i18n/users/users.literals';
import { UpdateUserRequest } from '@models/users/requests/update-user.request';
import { UserResponse } from '@models/users/responses/user.response';
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
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PoFieldModule, PoModalModule],
})
export class UpdateUserComponent extends BaseModalComponent<
  { user: UserResponse },
  { confirmed: boolean }
> {
  private readonly service = inject(UsersService);
  private readonly notification = inject(PoNotificationService);
  private readonly formBuilder = inject(FormBuilder);

  readonly literals = injectI18n(usersLiterals);
  readonly common = injectI18n(commonLiterals);

  readonly loading = signal(false);

  readonly form = this.formBuilder.nonNullable.group({
    firstName: [this.data?.user.firstName ?? '', [Validators.required]],
    lastName: [this.data?.user.lastName ?? '', [Validators.required]],
  });

  readonly formInvalid = formInvalidSignal(this.form);

  readonly primaryAction = computed<PoModalAction>(() => ({
    label: this.common().save,
    action: () => this.updateUser(),
    loading: this.loading(),
    disabled: this.formInvalid(),
  }));

  readonly secondaryAction = computed<PoModalAction>(() => ({
    label: this.common().cancel,
    loading: this.loading(),
    action: this.close.bind(this),
  }));

  private updateUser(): void {
    this.form.markAllAsTouched();

    if (this.formInvalid()) {
      return;
    }

    const request: UpdateUserRequest = {
      firstName: this.form.controls.firstName.getRawValue(),
      lastName: this.form.controls.lastName.getRawValue(),
    };

    this.loading.set(true);

    this.service
      .update(this.data!.user.id, request)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.notification.success(this.literals().notifications.updated);
          this.submit({ confirmed: true });
        },
      });
  }
}
