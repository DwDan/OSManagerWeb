import { defineI18n } from '@i18n/shared/define-i18n';

export const tenantsLiterals = defineI18n({
  ptBR: {
    pageTitle: 'Tenants',

    pageActions: {
      newTenant: 'Novo tenant',
    },

    tableActions: {
      details: 'Detalhes',
      edit: 'Editar',
      startTrial: 'Iniciar trial',
      activateSubscription: 'Ativar assinatura',
      suspend: 'Suspender',
      cancel: 'Cancelar',
      expire: 'Expirar',
      markPastDue: 'Marcar em atraso',
    },

    columns: {
      name: 'Nome',
      slug: 'Slug',
      document: 'Documento',
      email: 'Email',
      phoneNumber: 'Telefone',
      status: 'Status',
      currentPlan: 'Plano atual',
      createdAtUtc: 'Criado em',
      subscriptionEndsAtUtc: 'Fim da assinatura',
    },

    fields: {
      name: 'Nome',
      slug: 'Slug',
      plan: 'Plano',
      document: 'Documento',
      email: 'Email',
      phoneNumber: 'Telefone',
      status: 'Status',
      currentPlan: 'Plano atual',
      currentPlanId: 'Plano',
      createdAtUtc: 'Criado em',
      subscriptionEndsAtUtc: 'Fim da assinatura',
      trialEndsAtUtc: 'Fim do trial',
      suspendedAtUtc: 'Suspenso em',
      externalCustomerId: 'Id cliente externo',
      externalSubscriptionId: 'Id assinatura externa',
    },

    details: {
      name: 'Nome',
      slug: 'Slug',
      document: 'Documento',
      email: 'Email',
      phoneNumber: 'Telefone',
      status: 'Status',
      currentPlan: 'Plano atual',
      createdAtUtc: 'Criado em',
      subscriptionEndsAtUtc: 'Fim da assinatura',
      trialEndsAtUtc: 'Fim do trial',
      suspendedAtUtc: 'Suspenso em',
      externalCustomerId: 'Id cliente externo',
      externalSubscriptionId: 'Id assinatura externa',
    },

    modals: {
      create: {
        title: 'Novo tenant',
      },
      update: {
        title: 'Editar tenant',
      },
      details: {
        title: 'Detalhes do tenant',
      },
      startTrial: {
        title: 'Iniciar trial',
      },
      activateSubscription: {
        title: 'Ativar assinatura',
      },
    },

    status: {
      pending: 'Pendente',
      trial: 'Trial',
      active: 'Ativo',
      suspended: 'Suspenso',
      expired: 'Expirado',
      canceled: 'Cancelado',
    },

    notifications: {
      created: 'Tenant criado com sucesso.',
      updated: 'Tenant atualizado com sucesso.',
      trialStarted: 'Trial iniciado com sucesso.',
      subscriptionActivated: 'Assinatura ativada com sucesso.',
      suspended: 'Tenant suspenso com sucesso.',
      canceled: 'Tenant cancelado com sucesso.',
      expired: 'Tenant expirado com sucesso.',
      pastDue: 'Assinatura marcada como em atraso.',
    },

    subscriptions: {
      title: 'Assinaturas',
      empty: 'Nenhuma assinatura encontrada',
      loading: 'Carregando assinaturas...',
      plan: 'Plano',
      status: 'Status',
      startedAtUtc: 'Início',
      endsAtUtc: 'Fim',
    },

    subscriptionStatus: {
      active: 'Ativa',
      pastDue: 'Em atraso',
      canceled: 'Cancelada',
      expired: 'Expirada',
      trialing: 'Trial',
    },
  },

  enUS: {
    pageTitle: 'Tenants',

    pageActions: {
      newTenant: 'New tenant',
    },

    tableActions: {
      details: 'Details',
      edit: 'Edit',
      startTrial: 'Start trial',
      activateSubscription: 'Activate subscription',
      suspend: 'Suspend',
      cancel: 'Cancel',
      expire: 'Expire',
      markPastDue: 'Mark as past due',
    },

    columns: {
      name: 'Name',
      slug: 'Slug',
      document: 'Document',
      email: 'Email',
      phoneNumber: 'Phone',
      status: 'Status',
      currentPlan: 'Current plan',
      createdAtUtc: 'Created at',
      subscriptionEndsAtUtc: 'Subscription ends at',
    },

    fields: {
      name: 'Name',
      slug: 'Slug',
      plan: 'Plan',
      document: 'Document',
      email: 'Email',
      phoneNumber: 'Phone',
      status: 'Status',
      currentPlan: 'Current plan',
      currentPlanId: 'Plan',
      createdAtUtc: 'Created at',
      subscriptionEndsAtUtc: 'Subscription ends at',
      trialEndsAtUtc: 'Trial ends at',
      suspendedAtUtc: 'Suspended at',
      externalCustomerId: 'External customer id',
      externalSubscriptionId: 'External subscription id',
    },

    details: {
      name: 'Name',
      slug: 'Slug',
      document: 'Document',
      email: 'Email',
      phoneNumber: 'Phone',
      status: 'Status',
      currentPlan: 'Current plan',
      createdAtUtc: 'Created at',
      subscriptionEndsAtUtc: 'Subscription ends at',
      trialEndsAtUtc: 'Trial ends at',
      suspendedAtUtc: 'Suspended at',
      externalCustomerId: 'External customer id',
      externalSubscriptionId: 'External subscription id',
    },

    modals: {
      create: {
        title: 'New tenant',
      },
      update: {
        title: 'Edit tenant',
      },
      details: {
        title: 'Tenant details',
      },
      startTrial: {
        title: 'Start trial',
      },
      activateSubscription: {
        title: 'Activate subscription',
      },
    },

    status: {
      pending: 'Pending',
      trial: 'Trial',
      active: 'Active',
      suspended: 'Suspended',
      expired: 'Expired',
      canceled: 'Canceled',
    },

    notifications: {
      created: 'Tenant created successfully.',
      updated: 'Tenant updated successfully.',
      trialStarted: 'Trial started successfully.',
      subscriptionActivated: 'Subscription activated successfully.',
      suspended: 'Tenant suspended successfully.',
      canceled: 'Tenant canceled successfully.',
      expired: 'Tenant expired successfully.',
      pastDue: 'Subscription marked as past due.',
    },

    subscriptions: {
      title: 'Subscriptions',
      empty: 'No subscriptions found',
      loading: 'Loading subscriptions...',
      plan: 'Plan',
      status: 'Status',
      startedAtUtc: 'Start',
      endsAtUtc: 'End',
    },

    subscriptionStatus: {
      active: 'Active',
      pastDue: 'Past due',
      canceled: 'Canceled',
      expired: 'Expired',
      trialing: 'Trial',
    },
  },
});
