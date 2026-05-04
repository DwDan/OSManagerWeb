import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BaseModalComponent } from '@directives/base-modal.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { usersLiterals } from '@i18n/users/users.literals';
import { CustomRoleResponse } from '@models/customization/responses/custom-role.response';
import { UserResponse } from '@models/users/responses/user.response';
import {
  PoFieldModule,
  PoModalAction,
  PoModalModule,
  PoMultiselectOption,
  PoNotificationService,
} from '@po-ui/ng-components';
import { CustomizationService } from '@services/customization/customization.service';
import { UsersService } from '@services/users/users.service';
import { finalize, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-change-user-custom-roles',
  templateUrl: './change-user-custom-roles.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PoFieldModule, PoModalModule],
})
export class ChangeUserCustomRolesComponent extends BaseModalComponent<
  { user: UserResponse },
  { confirmed: boolean }
> {
  private readonly usersService = inject(UsersService);
  private readonly customizationService = inject(CustomizationService);
  private readonly notification = inject(PoNotificationService);
  private readonly formBuilder = inject(FormBuilder);

  readonly literals = injectI18n(usersLiterals);
  readonly common = injectI18n(commonLiterals);

  readonly loading = signal(false);
  readonly loaded = signal(false);
  readonly customRoles = signal<CustomRoleResponse[]>([]);
  readonly user = signal<UserResponse | null>(this.data?.user ?? null);

  readonly roleOptions = computed<PoMultiselectOption[]>(() =>
    this.customRoles().map((role) => ({
      label: role.name,
      value: role.id,
    })),
  );

  readonly form = this.formBuilder.nonNullable.group({
    customRoleIds: [this.data?.user.customRoles?.map((role) => role.id) ?? []],
  });

  readonly primaryAction = computed<PoModalAction>(() => ({
    label: this.common().save,
    action: () => this.save(),
    loading: this.loading(),
  }));

  readonly secondaryAction = computed<PoModalAction>(() => ({
    label: this.common().cancel,
    loading: this.loading(),
    action: this.close.bind(this),
  }));

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading.set(true);
    this.loaded.set(false);

    forkJoin({
      customRoles: this.customizationService.getCustomRoles(),
      user: this.usersService.getById(this.data!.user.id),
    })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: ({ customRoles, user }) => {
          this.customRoles.set(customRoles);
          this.user.set(user);
          this.form.reset({
            customRoleIds: user.customRoles?.map((role) => role.id) ?? [],
          });
          this.loaded.set(true);
        },
      });
  }

  private save(): void {
    const user = this.user() ?? this.data!.user;
    const currentIds = new Set(user.customRoles?.map((role) => role.id) ?? []);
    const selectedIds = new Set(this.form.controls.customRoleIds.getRawValue());

    const assignments = [...selectedIds]
      .filter((id) => !currentIds.has(id))
      .map((id) => this.usersService.assignCustomRole(user.id, id));

    const removals = [...currentIds]
      .filter((id) => !selectedIds.has(id))
      .map((id) => this.usersService.removeCustomRole(user.id, id));

    const operations = [...assignments, ...removals];

    this.loading.set(true);

    (operations.length > 0 ? forkJoin(operations) : of([]))
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.notification.success(this.literals().notifications.customRolesChanged);
          this.submit({ confirmed: true });
        },
      });
  }
}
