import { defineI18n } from '../shared/define-i18n';

export const resetPasswordLiterals = defineI18n({
  ptBR: {
    title: 'Redefinir senha',
    email: 'E-mail',
    newPassword: 'Nova senha',
    confirmPassword: 'Confirmar nova senha',
    button: 'Redefinir senha',
    validations: {
      invalidLink: 'Link de redefinição inválido.',
      fillAllFields: 'Preencha todos os campos.',
      confirmationDoesNotMatch: 'A confirmação da senha não confere.',
    },
    notifications: {
      success: 'Senha redefinida com sucesso.',
    },
  },
  enUS: {
    title: 'Reset password',
    email: 'Email',
    newPassword: 'New password',
    confirmPassword: 'Confirm new password',
    button: 'Reset password',
    validations: {
      invalidLink: 'Invalid reset link.',
      fillAllFields: 'Fill in all fields.',
      confirmationDoesNotMatch: 'Password confirmation does not match.',
    },
    notifications: {
      success: 'Password reset successfully.',
    },
  },
});
