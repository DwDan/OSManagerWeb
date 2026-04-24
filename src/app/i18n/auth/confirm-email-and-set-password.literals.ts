import { defineI18n } from '@i18n/shared/define-i18n';

export const confirmEmailAndSetPasswordLiterals = defineI18n({
  ptBR: {
    title: 'Confirmar e-mail',
    email: 'E-mail',
    password: 'Senha',
    confirmPassword: 'Confirmar senha',
    button: 'Confirmar',
    validations: {
      invalidLink: 'Link inválido ou expirado.',
      fillAllFields: 'Preencha todos os campos obrigatórios.',
      confirmationDoesNotMatch: 'A confirmação de senha não confere.',
    },
    notifications: {
      success: 'E-mail confirmado e senha cadastrada com sucesso.',
    },
  },
  enUS: {
    title: 'Confirm email',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm password',
    button: 'Confirm',
    validations: {
      invalidLink: 'Invalid or expired link.',
      fillAllFields: 'Fill all required fields.',
      confirmationDoesNotMatch: 'Password confirmation does not match.',
    },
    notifications: {
      success: 'Email confirmed and password set successfully.',
    },
  },
});
