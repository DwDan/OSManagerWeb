import { defineI18n } from '../shared/define-i18n';

export const unauthorizedLiterals = defineI18n({
  ptBR: {
    title: 'Acesso negado',
    subtitle: 'Você não possui permissão para acessar esta página.',
    description:
      'Caso acredite que isso seja um erro, entre em contato com o administrador do sistema.',
    primaryAction: 'Voltar para o dashboard',
  },
  enUS: {
    title: 'Access denied',
    subtitle: 'You do not have permission to access this page.',
    description: 'If you believe this is a mistake, please contact the system administrator.',
    primaryAction: 'Back to dashboard',
  },
});
