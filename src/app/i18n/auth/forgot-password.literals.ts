import { defineI18n } from '../shared/define-i18n';

export const forgotPasswordLiterals = defineI18n({
  ptBR: {
    title: 'Esqueci minha senha',
    description: 'Informe seu e-mail para receber as instruções de recuperação de senha.',
    emailLabel: 'E-mail',
    emailPlaceholder: 'Digite seu e-mail',
    supportMessage: 'Se não tiver acesso ao e-mail, contate o suporte em',
    submit: 'Enviar',
    submitting: 'Enviando...',
    cancel: 'Cancelar',
    successMessage:
      'Se o e-mail informado estiver cadastrado, você receberá as instruções para redefinir sua senha.',
    invalidEmail: 'Informe um e-mail válido.',
    supportEmail: 'support@osmanager.com.br',
  },
  enUS: {
    title: 'Forgot my password',
    description: 'Enter your email to receive password recovery instructions.',
    emailLabel: 'Email',
    emailPlaceholder: 'Enter your email',
    supportMessage: 'If you do not have access to this email, contact support at',
    submit: 'Send',
    submitting: 'Sending...',
    cancel: 'Cancel',
    successMessage:
      'If the provided email is registered, you will receive instructions to reset your password.',
    invalidEmail: 'Enter a valid email address.',
    supportEmail: 'support@osmanager.com.br',
  },
});
