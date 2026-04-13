import { defineI18n } from '../shared/define-i18n';

export const dashboardLiterals = defineI18n({
  ptBR: {
    title: 'Dashboard',
    widgets: {
      customers: 'Clientes',
      services: 'Serviços',
      activeOrders: 'Ordens ativas',
      closedOrders: 'Ordens finalizadas',
      ordersWeek: 'Ordens nos últimos 7 dias',
      latestOrders: 'Últimas ordens',
    },
    table: {
      code: 'Código',
      customer: 'Cliente',
      status: 'Status',
    },
    status: {
      pending: 'Pendente',
      open: 'Aberta',
      inProgress: 'Em execução',
      closed: 'Finalizada',
      canceled: 'Cancelada',
    },
  },
  enUS: {
    title: 'Dashboard',
    widgets: {
      customers: 'Customers',
      services: 'Services',
      activeOrders: 'Active orders',
      closedOrders: 'Closed orders',
      ordersWeek: 'Orders in the last 7 days',
      latestOrders: 'Latest orders',
    },
    table: {
      code: 'Code',
      customer: 'Customer',
      status: 'Status',
    },
    status: {
      pending: 'Pending',
      open: 'Open',
      inProgress: 'In progress',
      closed: 'Closed',
      canceled: 'Canceled',
    },
  },
});
