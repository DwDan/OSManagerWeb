import { defineI18n } from '../shared/define-i18n';

export const dashboardLiterals = defineI18n({
  ptBR: {
    title: 'Dashboard',
    widgets: {
      customers: 'Clientes',
      services: 'Serviços',
      activeOrders: 'Ordens ativas',
      closedOrders: 'Ordens finalizadas',
      todayOrders: 'Ordens de hoje',
      pendingOrders: 'Pendentes',
      inProgressOrders: 'Em andamento',
      ordersWeek: 'Ordens nos últimos 7 dias',
      myOrdersWeek: 'Minhas ordens nos últimos 7 dias',
      latestOrders: 'Últimas ordens',
      myLatestOrders: 'Minhas últimas ordens',
    },
    chartSeries: {
      orders: 'Ordens',
      myOrders: 'Minhas ordens',
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
      todayOrders: 'Today orders',
      pendingOrders: 'Pending',
      inProgressOrders: 'In progress',
      ordersWeek: 'Orders in the last 7 days',
      myOrdersWeek: 'My orders in the last 7 days',
      latestOrders: 'Latest orders',
      myLatestOrders: 'My latest orders',
    },
    chartSeries: {
      orders: 'Orders',
      myOrders: 'My orders',
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
