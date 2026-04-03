import { CommonModule } from '@angular/common';
import { Component, ViewChild, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { commonLiterals } from '@i18n/common/common.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { usersLiterals } from '@i18n/users/users.literals';
import { ChangeUserRoleRequest } from '@models/users/requests/change-user-role.request';
import { CreateUserRequest } from '@models/users/requests/create-user.request';
import { UpdateUserRequest } from '@models/users/requests/update-user.request';
import { UserResponse } from '@models/users/responses/user.response';
import { UserRole } from '@models/users/types/user-role.type';
import {
  PoButtonModule,
  PoDialogService,
  PoFieldModule,
  PoModalAction,
  PoModalComponent,
  PoModalModule,
  PoNotificationService,
  PoPageAction,
  PoPageModule,
  PoSelectOption,
  PoTableAction,
  PoTableColumn,
  PoTableColumnSpacing,
  PoTableModule,
  PoWidgetModule,
} from '@po-ui/ng-components';
import { UsersService } from '@services/users/users.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    PoTableModule,
    PoWidgetModule,
    PoModalModule,
    PoButtonModule,
    PoFieldModule,
    PoPageModule,
  ],
})
export class UsersComponent {
  @ViewChild('createUserModal', { static: true }) createUserModal!: PoModalComponent;
  @ViewChild('editUserModal', { static: true }) editUserModal!: PoModalComponent;
  @ViewChild('changeRoleModal', { static: true }) changeRoleModal!: PoModalComponent;

  private readonly service = inject(UsersService);
  private readonly notification = inject(PoNotificationService);
  private readonly dialog = inject(PoDialogService);

  readonly literals = injectI18n(usersLiterals);
  readonly common = injectI18n(commonLiterals);

  items = signal<UserResponse[]>([]);
  loading = signal(false);
  spacing = PoTableColumnSpacing;

  selectedUser = signal<UserResponse | null>(null);

  createForm: CreateUserRequest = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  editForm: UpdateUserRequest = {
    firstName: '',
    lastName: '',
  };

  selectedRole: UserRole = 'Technician';

  readonly roleOptions = computed<PoSelectOption[]>(() => [
    { label: this.literals().roles.administrator, value: 1 },
    { label: this.literals().roles.technician, value: 2 },
  ]);

  readonly columns = computed<PoTableColumn[]>(() => [
    { property: 'firstName', label: this.literals().columns.firstName },
    { property: 'lastName', label: this.literals().columns.lastName },
    { property: 'email', label: this.literals().columns.email },
    {
      property: 'role',
      label: this.literals().columns.role,
      type: 'label',
      width: '8%',
      labels: [
        {
          value: 1,
          color: 'rgb(201, 53, 125)',
          label: this.literals().roles.administrator,
          icon: 'an an-user',
        },
        {
          value: 2,
          color: 'rgb(6, 146, 211)',
          label: this.literals().roles.technician,
          icon: 'an an-user',
        },
      ],
    },
    { property: 'isActive', label: this.literals().columns.isActive, type: 'boolean' },
    { property: 'emailConfirmed', label: this.literals().columns.emailConfirmed, type: 'boolean' },
  ]);

  readonly pageActions = computed<PoPageAction[]>(() => [
    {
      label: this.literals().pageActions.createUser,
      action: () => this.openCreateModal(),
    },
  ]);

  readonly tableActions = computed<PoTableAction[]>(() => [
    {
      label: this.literals().tableActions.edit,
      action: (user: UserResponse) => this.openEditModal(user),
    },
    {
      label: this.literals().tableActions.changeRole,
      action: (user: UserResponse) => this.openChangeRoleModal(user),
    },
    {
      label: this.literals().tableActions.activate,
      action: (user: UserResponse) => this.activate(user),
      visible: (user: UserResponse) => !user.isActive,
    },
    {
      label: this.literals().tableActions.deactivate,
      action: (user: UserResponse) => this.deactivate(user),
      visible: (user: UserResponse) => user.isActive,
    },
    {
      label: this.literals().tableActions.delete,
      action: (user: UserResponse) => this.deleteUser(user),
      visible: (user: UserResponse) => !user.emailConfirmed,
    },
    {
      label: this.literals().tableActions.resendEmailConfirmation,
      action: (user: UserResponse) => this.resendEmailConfirmation(user),
      visible: (user: UserResponse) => !user.emailConfirmed,
    },
  ]);

  readonly saveCreateAction = computed<PoModalAction>(() => ({
    label: this.literals().modals.create.confirm,
    action: () => this.createUser(),
    loading: this.loading(),
  }));

  readonly cancelCreateAction = computed<PoModalAction>(() => ({
    label: this.common().cancel,
    action: () => this.createUserModal.close(),
    loading: this.loading(),
  }));

  readonly saveEditAction = computed<PoModalAction>(() => ({
    label: this.common().save,
    action: () => this.updateUser(),
    loading: this.loading(),
  }));

  readonly cancelEditAction = computed<PoModalAction>(() => ({
    label: this.common().cancel,
    action: () => this.editUserModal.close(),
    loading: this.loading(),
  }));

  readonly saveRoleAction = computed<PoModalAction>(() => ({
    label: this.common().save,
    action: () => this.changeRole(),
    loading: this.loading(),
  }));

  readonly cancelRoleAction = computed<PoModalAction>(() => ({
    label: this.common().cancel,
    action: () => this.changeRoleModal.close(),
    loading: this.loading(),
  }));

  ngOnInit(): void {
    this.loadUsers();
  }

  openCreateModal(): void {
    this.createForm = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    };

    this.createUserModal.open();
  }

  private createUser(): void {
    if (
      !this.createForm.firstName?.trim() ||
      !this.createForm.lastName?.trim() ||
      !this.createForm.email?.trim() ||
      !this.createForm.password?.trim()
    ) {
      this.notification.warning(this.literals().validations.fillAllFieldsToCreate);
      return;
    }

    this.loading.set(true);

    this.service
      .create(this.createForm)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.notification.success(this.literals().notifications.created);
          this.createUserModal.close();
          this.loadUsers();
        },
      });
  }

  private loadUsers(): void {
    this.loading.set(true);

    this.service
      .getUsers()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (users) => {
          this.items.set(users);
        },
      });
  }

  openEditModal(user: UserResponse): void {
    this.selectedUser.set(user);
    this.editForm = {
      firstName: user.firstName,
      lastName: user.lastName,
    };

    this.editUserModal.open();
  }

  private updateUser(): void {
    const user = this.selectedUser();

    if (!user) {
      return;
    }

    this.loading.set(true);

    this.service
      .update(user.id, this.editForm)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.notification.success(this.literals().notifications.updated);
          this.editUserModal.close();
          this.loadUsers();
        },
      });
  }

  openChangeRoleModal(user: UserResponse): void {
    this.selectedUser.set(user);
    this.selectedRole = (user.role as UserRole) ?? 'Technician';

    this.changeRoleModal.open();
  }

  private changeRole(): void {
    const user = this.selectedUser();

    if (!user) {
      return;
    }

    const request: ChangeUserRoleRequest = {
      role: this.selectedRole,
    };

    this.loading.set(true);

    this.service
      .changeRole(user.id, request)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.notification.success(this.literals().notifications.roleChanged);
          this.changeRoleModal.close();
          this.loadUsers();
        },
      });
  }

  activate(user: UserResponse): void {
    this.dialog.confirm({
      title: this.literals().dialogs.activate.title,
      message: this.literals()
        .dialogs.activate.message.replace('{firstName}', user.firstName)
        .replace('{lastName}', user.lastName),
      confirm: () => {
        this.loading.set(true);

        this.service
          .activate(user.id)
          .pipe(finalize(() => this.loading.set(false)))
          .subscribe({
            next: () => {
              this.notification.success(this.literals().notifications.activated);
              this.loadUsers();
            },
          });
      },
    });
  }

  deactivate(user: UserResponse): void {
    this.dialog.confirm({
      title: this.literals().dialogs.deactivate.title,
      message: this.literals()
        .dialogs.deactivate.message.replace('{firstName}', user.firstName)
        .replace('{lastName}', user.lastName),
      confirm: () => {
        this.loading.set(true);

        this.service
          .deactivate(user.id)
          .pipe(finalize(() => this.loading.set(false)))
          .subscribe({
            next: () => {
              this.notification.success(this.literals().notifications.deactivated);
              this.loadUsers();
            },
          });
      },
    });
  }

  deleteUser(user: UserResponse): void {
    this.dialog.confirm({
      title: this.literals().dialogs.delete.title,
      message: this.literals()
        .dialogs.delete.message.replace('{firstName}', user.firstName)
        .replace('{lastName}', user.lastName),
      confirm: () => {
        this.loading.set(true);

        this.service
          .delete(user.id)
          .pipe(finalize(() => this.loading.set(false)))
          .subscribe({
            next: () => {
              this.notification.success(this.literals().notifications.deleted);
              this.loadUsers();
            },
          });
      },
    });
  }

  resendEmailConfirmation(user: UserResponse): void {
    this.dialog.confirm({
      title: this.literals().dialogs.resendEmailConfirmation.title,
      message: this.literals()
        .dialogs.resendEmailConfirmation.message.replace('{firstName}', user.firstName)
        .replace('{lastName}', user.lastName),
      confirm: () => {
        this.loading.set(true);

        this.service
          .resendEmailConfirmation(user.id)
          .pipe(finalize(() => this.loading.set(false)))
          .subscribe({
            next: () => {
              this.notification.success(this.literals().notifications.emailConfirmationResent);
              this.loadUsers();
            },
          });
      },
    });
  }
}
