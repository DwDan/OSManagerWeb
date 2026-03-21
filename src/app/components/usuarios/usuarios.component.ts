import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PoButtonModule,
  PoDialogService,
  PoFieldModule,
  PoModalAction,
  PoModalComponent,
  PoModalModule,
  PoNotificationService,
  PoSelectOption,
  PoTableAction,
  PoTableColumn,
  PoTableColumnSpacing,
  PoTableModule,
  PoWidgetModule,
} from '@po-ui/ng-components';
import { finalize } from 'rxjs';
import { ChangeUserRoleRequest } from '../../models/usuarios/requests/change-user-role.request';
import { UpdateUserRequest } from '../../models/usuarios/requests/update-user.request';
import { UserResponse } from '../../models/usuarios/responses/user.response';
import { UsuariosService } from '../../services/usuarios/usuarios.service';

type UserRole = 'Admin' | 'Technician';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PoTableModule,
    PoWidgetModule,
    PoModalModule,
    PoButtonModule,
    PoFieldModule,
  ],
})
export class UsuariosComponent {
  @ViewChild('editUserModal', { static: true }) editUserModal!: PoModalComponent;
  @ViewChild('changeRoleModal', { static: true }) changeRoleModal!: PoModalComponent;

  private readonly service = inject(UsuariosService);
  private readonly notification = inject(PoNotificationService);
  private readonly dialog = inject(PoDialogService);

  items = signal<UserResponse[]>([]);
  loading = signal(false);
  spacing = PoTableColumnSpacing;

  selectedUser = signal<UserResponse | null>(null);

  editForm: UpdateUserRequest = {
    firstName: '',
    lastName: '',
  };

  selectedRole: UserRole = 'Technician';

  roleOptions: PoSelectOption[] = [
    { label: 'Administrador', value: 1 },
    { label: 'Técnico', value: 2 },
  ];

  columns: PoTableColumn[] = [
    { property: 'id', label: 'Id' },
    { property: 'firstName', label: 'Nome' },
    { property: 'lastName', label: 'Sobrenome' },
    { property: 'email', label: 'E-mail' },
    {
      property: 'role',
      label: 'Perfil',
      type: 'label',
      width: '8%',
      labels: [
        { value: 1, color: 'rgb(201, 53, 125)', label: 'Administrador', icon: 'an an-user' },
        { value: 2, color: 'rgb(6, 146, 211)', label: 'Técnico', icon: 'an an-user' },
      ],
    },
    { property: 'isActive', label: 'Ativo', type: 'boolean' },
    { property: 'emailConfirmed', label: 'E-mail confirmado', type: 'boolean' },
  ];

  tableActions: PoTableAction[] = [
    {
      label: 'Editar',
      action: (user: UserResponse) => this.openEditModal(user),
    },
    {
      label: 'Alterar perfil',
      action: (user: UserResponse) => this.openChangeRoleModal(user),
    },
    {
      label: 'Ativar',
      action: (user: UserResponse) => this.activate(user),
      visible: (user: UserResponse) => !user.isActive,
    },
    {
      label: 'Desativar',
      action: (user: UserResponse) => this.deactivate(user),
      visible: (user: UserResponse) => user.isActive,
    },
  ];

  saveEditAction: PoModalAction = {
    label: 'Salvar',
    action: () => this.updateUser(),
  };

  cancelEditAction: PoModalAction = {
    label: 'Cancelar',
    action: () => this.editUserModal.close(),
  };

  saveRoleAction: PoModalAction = {
    label: 'Salvar',
    action: () => this.changeRole(),
  };

  cancelRoleAction: PoModalAction = {
    label: 'Cancelar',
    action: () => this.changeRoleModal.close(),
  };

  ngOnInit(): void {
    this.loadUsers();
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
        error: () => {
          this.notification.error('Não foi possível carregar os usuários.');
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
          this.notification.success('Usuário atualizado com sucesso.');
          this.editUserModal.close();
          this.loadUsers();
        },
        error: () => {
          this.notification.error('Não foi possível atualizar o usuário.');
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
          this.notification.success('Perfil alterado com sucesso.');
          this.changeRoleModal.close();
          this.loadUsers();
        },
        error: () => {
          this.notification.error('Não foi possível alterar o perfil.');
        },
      });
  }

  activate(user: UserResponse): void {
    this.dialog.confirm({
      title: 'Ativar usuário',
      message: `Deseja ativar o usuário ${user.firstName} ${user.lastName}?`,
      confirm: () => {
        this.loading.set(true);

        this.service
          .activate(user.id)
          .pipe(finalize(() => this.loading.set(false)))
          .subscribe({
            next: () => {
              this.notification.success('Usuário ativado com sucesso.');
              this.loadUsers();
            },
            error: () => {
              this.notification.error('Não foi possível ativar o usuário.');
            },
          });
      },
    });
  }

  deactivate(user: UserResponse): void {
    this.dialog.confirm({
      title: 'Desativar usuário',
      message: `Deseja desativar o usuário ${user.firstName} ${user.lastName}?`,
      confirm: () => {
        this.loading.set(true);

        this.service
          .deactivate(user.id)
          .pipe(finalize(() => this.loading.set(false)))
          .subscribe({
            next: () => {
              this.notification.success('Usuário desativado com sucesso.');
              this.loadUsers();
            },
            error: () => {
              this.notification.error('Não foi possível desativar o usuário.');
            },
          });
      },
    });
  }
}
