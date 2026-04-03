import { defineI18n } from '../shared/define-i18n';

export const dashboardLiterals = defineI18n({
  ptBR: {
    title: 'Dashboard',
    widgets: {
      users: 'Usuários',
      orders: 'Ordens',
      open: 'Abertas',
      closed: 'Finalizadas',
      ordersWeek: 'Ordens na semana',
      latestOrders: 'Últimas ordens',
    },
    chartCategories: {
      monday: 'Seg',
      tuesday: 'Ter',
      wednesday: 'Qua',
      thursday: 'Qui',
      friday: 'Sex',
    },
    chartSeries: {
      orders: 'Ordens',
    },
    table: {
      code: 'Código',
      customer: 'Cliente',
      status: 'Status',
    },
    statuses: {
      open: 'Aberta',
      closed: 'Finalizada',
      inProgress: 'Em andamento',
    },
  },
  enUS: {
    title: 'Dashboard',
    widgets: {
      users: 'Users',
      orders: 'Orders',
      open: 'Open',
      closed: 'Closed',
      ordersWeek: 'Orders this week',
      latestOrders: 'Latest orders',
    },
    chartCategories: {
      monday: 'Mon',
      tuesday: 'Tue',
      wednesday: 'Wed',
      thursday: 'Thu',
      friday: 'Fri',
    },
    chartSeries: {
      orders: 'Orders',
    },
    table: {
      code: 'Code',
      customer: 'Customer',
      status: 'Status',
    },
    statuses: {
      open: 'Open',
      closed: 'Closed',
      inProgress: 'In progress',
    },
  },
});
