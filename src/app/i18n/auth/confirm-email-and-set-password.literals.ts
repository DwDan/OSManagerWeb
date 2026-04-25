import { defineI18n } from '@i18n/shared/define-i18n';

export const confirmEmailAndSetPasswordLiterals = defineI18n({
  ptBR: {
    title: 'Confirme seu e-mail e crie sua senha',
    email: 'E-mail',
    password: 'Senha',
    confirmPassword: 'Confirmar senha',
    button: 'Confirmar e iniciar teste grátis',
    trial: {
      title: 'Seu teste grátis começa agora',
      description:
        'Ao confirmar seu e-mail e criar sua senha, você iniciará automaticamente seu período de teste gratuito de 14 dias.',
    },
    validations: {
      invalidLink: 'Link inválido ou expirado.',
      fillAllFields: 'Preencha todos os campos obrigatórios.',
      confirmationDoesNotMatch: 'A confirmação de senha não confere.',
    },
    notifications: {
      success: 'E-mail confirmado com sucesso. Seu teste gratuito de 14 dias foi iniciado.',
    },
  },
  enUS: {
    title: 'Confirm your email and create your password',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm password',
    button: 'Confirm and start free trial',
    trial: {
      title: 'Your free trial starts now',
      description:
        'By confirming your email and creating your password, your 14-day free trial will start automatically.',
    },
    validations: {
      invalidLink: 'Invalid or expired link.',
      fillAllFields: 'Fill all required fields.',
      confirmationDoesNotMatch: 'Password confirmation does not match.',
    },
    notifications: {
      success: 'Email confirmed successfully. Your 14-day free trial has started.',
    },
  },
});
