import { defineI18n } from '../shared/define-i18n';

export const changePasswordLiterals = defineI18n({
  ptBR: {
    title: 'Alterar senha',
    currentPassword: 'Senha atual',
    newPassword: 'Nova senha',
    confirmPassword: 'Confirmar nova senha',
    validations: {
      fillAllFields: 'Preencha todos os campos.',
      confirmationDoesNotMatch: 'A confirmação da nova senha não confere.',
      newMustBeDifferent: 'A nova senha deve ser diferente da senha atual.',
    },
    notifications: {
      success: 'Senha alterada com sucesso.',
    },
  },
  enUS: {
    title: 'Change password',
    currentPassword: 'Current password',
    newPassword: 'New password',
    confirmPassword: 'Confirm new password',
    validations: {
      fillAllFields: 'Fill in all fields.',
      confirmationDoesNotMatch: 'The new password confirmation does not match.',
      newMustBeDifferent: 'The new password must be different from the current password.',
    },
    notifications: {
      success: 'Password changed successfully.',
    },
  },
});
