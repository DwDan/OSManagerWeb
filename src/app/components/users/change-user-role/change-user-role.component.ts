import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BaseModalComponent } from '@directives/base-modal.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { usersLiterals } from '@i18n/users/users.literals';
import { ChangeUserRoleRequest } from '@models/users/requests/change-user-role.request';
import { UserResponse } from '@models/users/responses/user.response';
import {
  PoFieldModule,
  PoModalAction,
  PoModalModule,
  PoNotificationService,
  PoSelectOption,
} from '@po-ui/ng-components';
import { UsersService } from '@services/users/users.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-change-user-role',
  templateUrl: './change-user-role.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PoFieldModule, PoModalModule],
})
export class ChangeUserRoleComponent extends BaseModalComponent<
  { user: UserResponse },
  { confirmed: boolean }
> {
  private readonly service = inject(UsersService);
  private readonly notification = inject(PoNotificationService);
  private readonly formBuilder = inject(FormBuilder);

  readonly literals = injectI18n(usersLiterals);
  readonly common = injectI18n(commonLiterals);

  readonly loading = signal(false);

  readonly roleOptions = computed<PoSelectOption[]>(() => [
    { label: this.literals().roles.administrator, value: 1 },
    { label: this.literals().roles.technician, value: 2 },
  ]);

  readonly form = this.formBuilder.nonNullable.group({
    role: [Number(this.data?.user.role) || 2],
  });

  readonly saveRoleAction = computed<PoModalAction>(() => ({
    label: this.common().save,
    action: () => this.changeRole(),
    loading: this.loading(),
  }));

  readonly cancelRoleAction = computed<PoModalAction>(() => ({
    label: this.common().cancel,
    action: () => this.close(),
    loading: this.loading(),
  }));

  private changeRole(): void {
    const roleValue = this.form.controls.role.getRawValue();

    const request: ChangeUserRoleRequest = {
      role: roleValue === 1 ? 'Admin' : 'Technician',
    };

    this.loading.set(true);

    this.service
      .changeRole(this.data!.user.id, request)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.notification.success(this.literals().notifications.roleChanged);
          this.submit({ confirmed: true });
        },
      });
  }
}
