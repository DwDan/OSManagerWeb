import { defineI18n } from '@i18n/shared/define-i18n';

export const filterTenantLiterals = defineI18n({
  ptBR: {
    title: 'Filtros',

    fields: {
      name: 'Nome',
      slug: 'Slug',
      status: 'Status',
      currentPlanId: 'Plano',
    },

    status: {
      pending: 'Pendente',
      trial: 'Trial',
      active: 'Ativo',
      suspended: 'Suspenso',
      expired: 'Expirado',
      canceled: 'Cancelado',
    },

    actions: {
      filter: 'Filtrar',
      clear: 'Limpar',
    },
  },

  enUS: {
    title: 'Filters',

    fields: {
      name: 'Name',
      slug: 'Slug',
      status: 'Status',
      currentPlanId: 'Plan',
    },

    status: {
      pending: 'Pending',
      trial: 'Trial',
      active: 'Active',
      suspended: 'Suspended',
      expired: 'Expired',
      canceled: 'Canceled',
    },

    actions: {
      filter: 'Filter',
      clear: 'Clear',
    },
  },
});
