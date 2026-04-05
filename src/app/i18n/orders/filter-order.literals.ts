import { defineI18n } from '@i18n/shared/define-i18n';

export const filterOrderLiterals = defineI18n({
  ptBR: {
    title: 'Filtros',
    actions: {
      expand: 'Expandir',
      collapse: 'Recolher',
    },
    fields: {
      code: 'Código',
      customer: 'Cliente',
      technician: 'Técnico',
      service: 'Serviço',
      status: 'Status',
      executionResult: 'Resultado',
    },
    status: {
      pending: 'Pendente',
      open: 'Aberta',
      inProgress: 'Em andamento',
      closed: 'Fechada',
      canceled: 'Cancelada',
    },
    executionResult: {
      successful: 'Sucesso',
      unsuccessful: 'Falha',
    },
  },
  enUS: {
    title: 'Filters',
    actions: {
      expand: 'Expand',
      collapse: 'Collapse',
    },
    fields: {
      code: 'Code',
      customer: 'Customer',
      technician: 'Technician',
      service: 'Service',
      status: 'Status',
      executionResult: 'Result',
    },
    status: {
      pending: 'Pending',
      open: 'Open',
      inProgress: 'In Progress',
      closed: 'Closed',
      canceled: 'Canceled',
    },
    executionResult: {
      successful: 'Successful',
      unsuccessful: 'Unsuccessful',
    },
  },
});
