import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { commonLiterals } from '@i18n/common/common.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { usersLiterals } from '@i18n/users/users.literals';
import { UserResponse } from '@models/users/responses/user.response';
import {
  PoDialogService,
  PoPageAction,
  PoPageModule,
  PoSelectOption,
  PoTableAction,
  PoTableColumn,
  PoTableColumnSpacing,
  PoTableModule,
  PoWidgetModule,
} from '@po-ui/ng-components';
import { ModalService } from '@services/modal/modal.service';
import { UsersService } from '@services/users/users.service';
import { finalize } from 'rxjs';
import { ChangeUserRoleComponent } from './change-user-role/change-user-role.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { UpdateUserComponent } from './update-user/update-user.component';

@Component({
  selector: 'app-usuarios',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  imports: [CommonModule, PoTableModule, PoWidgetModule, PoPageModule],
})
export class UsersComponent {
  private readonly service = inject(UsersService);
  private readonly dialog = inject(PoDialogService);
  private readonly modalService = inject(ModalService);

  readonly literals = injectI18n(usersLiterals);
  readonly common = injectI18n(commonLiterals);

  readonly items = signal<UserResponse[]>([]);
  readonly loading = signal(false);
  readonly spacing = PoTableColumnSpacing;

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
      action: (user: UserResponse) => this.openUpdateModal(user),
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

  ngOnInit(): void {
    this.loadUsers();
  }

  openCreateModal(): void {
    this.modalService.open(CreateUserComponent).subscribe((result) => {
      if (result?.confirmed) {
        this.loadUsers();
      }
    });
  }

  openUpdateModal(user: UserResponse): void {
    this.modalService.open(UpdateUserComponent, { user }).subscribe((result) => {
      if (result?.confirmed) {
        this.loadUsers();
      }
    });
  }

  openChangeRoleModal(user: UserResponse): void {
    this.modalService.open(ChangeUserRoleComponent, { user }).subscribe((result) => {
      if (result?.confirmed) {
        this.loadUsers();
      }
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
              this.loadUsers();
            },
          });
      },
    });
  }
}
