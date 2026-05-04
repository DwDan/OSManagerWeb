import { defineI18n } from '../shared/define-i18n';

export const usersLiterals = defineI18n({
  ptBR: {
    title: 'Gerenciar Usuários',
    pageActions: {
      createUser: 'Novo usuário',
    },
    tableActions: {
      edit: 'Editar',
      changeRole: 'Alterar perfil',
      customRoles: 'Perfis customizados',
      activate: 'Ativar',
      deactivate: 'Desativar',
      delete: 'Excluir',
      resendEmailConfirmation: 'Reenviar e-mail de confirmação',
    },
    columns: {
      id: 'Id',
      firstName: 'Nome',
      lastName: 'Sobrenome',
      email: 'E-mail',
      role: 'Perfil',
      isActive: 'Ativo',
      emailConfirmed: 'E-mail confirmado',
    },
    fields: {
      firstName: 'Nome',
      lastName: 'Sobrenome',
      email: 'E-mail',
      password: 'Senha',
      role: 'Perfil',
      customRoles: 'Perfis customizados',
    },
    roles: {
      administrator: 'Administrador',
      technician: 'Técnico',
    },
    modals: {
      create: {
        title: 'Novo usuário',
      },
      edit: {
        title: 'Editar usuário',
      },
      changeRole: {
        title: 'Alterar perfil',
      },
      customRoles: {
        title: 'Perfis customizados',
      },
    },
    validations: {
      fillAllFieldsToCreate: 'Preencha todos os campos para criar o usuário.',
    },
    notifications: {
      created: 'Usuário criado com sucesso.',
      updated: 'Usuário atualizado com sucesso.',
      roleChanged: 'Perfil alterado com sucesso.',
      customRolesChanged: 'Perfis customizados atualizados com sucesso.',
      activated: 'Usuário ativado com sucesso.',
      deactivated: 'Usuário desativado com sucesso.',
      deleted: 'Usuário excluído com sucesso.',
      emailConfirmationResent: 'E-mail de confirmação reenviado com sucesso.',
    },
    dialogs: {
      activate: {
        title: 'Ativar usuário',
        message: 'Deseja ativar o usuário {firstName} {lastName}?',
      },
      deactivate: {
        title: 'Desativar usuário',
        message: 'Deseja desativar o usuário {firstName} {lastName}?',
      },
      delete: {
        title: 'Excluir usuário',
        message: 'Deseja excluir o usuário {firstName} {lastName}?',
      },
      resendEmailConfirmation: {
        title: 'Reenviar e-mail de confirmação',
        message: 'Deseja reenviar o e-mail de confirmação para o usuário {firstName} {lastName}?',
      },
    },
  },
  enUS: {
    title: 'Manage Users',
    pageActions: {
      createUser: 'New user',
    },
    tableActions: {
      edit: 'Edit',
      changeRole: 'Change role',
      customRoles: 'Custom roles',
      activate: 'Activate',
      deactivate: 'Deactivate',
      delete: 'Delete',
      resendEmailConfirmation: 'Resend confirmation email',
    },
    columns: {
      id: 'Id',
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email',
      role: 'Role',
      isActive: 'Active',
      emailConfirmed: 'Email confirmed',
    },
    fields: {
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email',
      password: 'Password',
      role: 'Role',
      customRoles: 'Custom roles',
    },
    roles: {
      administrator: 'Administrator',
      technician: 'Technician',
    },
    modals: {
      create: {
        title: 'New user',
      },
      edit: {
        title: 'Edit user',
      },
      changeRole: {
        title: 'Change role',
      },
      customRoles: {
        title: 'Custom roles',
      },
    },
    validations: {
      fillAllFieldsToCreate: 'Fill in all fields to create the user.',
    },
    notifications: {
      created: 'User created successfully.',
      updated: 'User updated successfully.',
      roleChanged: 'Role changed successfully.',
      customRolesChanged: 'Custom roles updated successfully.',
      activated: 'User activated successfully.',
      deactivated: 'User deactivated successfully.',
      deleted: 'User deleted successfully.',
      emailConfirmationResent: 'Confirmation email resent successfully.',
    },
    dialogs: {
      activate: {
        title: 'Activate user',
        message: 'Do you want to activate user {firstName} {lastName}?',
      },
      deactivate: {
        title: 'Deactivate user',
        message: 'Do you want to deactivate user {firstName} {lastName}?',
      },
      delete: {
        title: 'Delete user',
        message: 'Do you want to delete user {firstName} {lastName}?',
      },
      resendEmailConfirmation: {
        title: 'Resend confirmation email',
        message: 'Do you want to resend the confirmation email to user {firstName} {lastName}?',
      },
    },
  },
});
