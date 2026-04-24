import { defineI18n } from '@i18n/shared/define-i18n';

export const plansLiterals = defineI18n({
  ptBR: {
    pageTitle: 'Planos',

    pageActions: {
      newPlan: 'Novo plano',
    },

    tableActions: {
      details: 'Detalhes',
      edit: 'Editar',
      activate: 'Ativar',
      deactivate: 'Desativar',
    },

    columns: {
      name: 'Nome',
      code: 'Código',
      price: 'Preço',
      maxUsers: 'Máx. usuários',
      maxOrdersPerMonth: 'Máx. ordens/mês',
      isActive: 'Ativo',
      isPublic: 'Público',
    },

    fields: {
      name: 'Nome',
      code: 'Código',
      price: 'Preço',
      maxUsers: 'Máx. usuários',
      maxOrdersPerMonth: 'Máx. ordens por mês',
      isPublic: 'Plano público',
    },

    details: {
      name: 'Nome',
      code: 'Código',
      price: 'Preço',
      maxUsers: 'Máx. usuários',
      maxOrdersPerMonth: 'Máx. ordens por mês',
      isActive: 'Status',
      isPublic: 'Visibilidade',
    },

    modals: {
      create: {
        title: 'Novo plano',
      },
      update: {
        title: 'Editar plano',
      },
      details: {
        title: 'Detalhes do plano',
      },
    },

    status: {
      active: 'Ativo',
      inactive: 'Inativo',
    },

    visibility: {
      public: 'Público',
      private: 'Privado',
    },

    common: {
      unlimited: 'Ilimitado',
    },

    notifications: {
      created: 'Plano criado com sucesso.',
      updated: 'Plano atualizado com sucesso.',
      activated: 'Plano ativado com sucesso.',
      deactivated: 'Plano desativado com sucesso.',
    },
  },

  enUS: {
    pageTitle: 'Plans',

    pageActions: {
      newPlan: 'New plan',
    },

    tableActions: {
      details: 'Details',
      edit: 'Edit',
      activate: 'Activate',
      deactivate: 'Deactivate',
    },

    columns: {
      name: 'Name',
      code: 'Code',
      price: 'Price',
      maxUsers: 'Max users',
      maxOrdersPerMonth: 'Max orders/month',
      isActive: 'Active',
      isPublic: 'Public',
    },

    fields: {
      name: 'Name',
      code: 'Code',
      price: 'Price',
      maxUsers: 'Max users',
      maxOrdersPerMonth: 'Max orders per month',
      isPublic: 'Public plan',
    },

    details: {
      name: 'Name',
      code: 'Code',
      price: 'Price',
      maxUsers: 'Max users',
      maxOrdersPerMonth: 'Max orders per month',
      isActive: 'Status',
      isPublic: 'Visibility',
    },

    modals: {
      create: {
        title: 'New plan',
      },
      update: {
        title: 'Edit plan',
      },
      details: {
        title: 'Plan details',
      },
    },

    status: {
      active: 'Active',
      inactive: 'Inactive',
    },

    visibility: {
      public: 'Public',
      private: 'Private',
    },

    common: {
      unlimited: 'Unlimited',
    },

    notifications: {
      created: 'Plan created successfully.',
      updated: 'Plan updated successfully.',
      activated: 'Plan activated successfully.',
      deactivated: 'Plan deactivated successfully.',
    },
  },
});
