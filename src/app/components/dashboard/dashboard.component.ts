import { Component, computed, inject, signal } from '@angular/core';
import { dashboardLiterals } from '@i18n/dashboard/dashboard.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { DashboardCardResponse } from '@models/dashboard/responses/dashboard-card.response';
import { DashboardResponse } from '@models/dashboard/responses/dashboard-response';
import { OrderStatus } from '@models/orders/types/order-status.enum';
import {
  PoChartModule,
  PoChartSerie,
  PoChartType,
  PoPageModule,
  PoTableColumn,
  PoTableModule,
  PoWidgetModule,
} from '@po-ui/ng-components';
import { DashboardService } from '@services/dashboard/dashboard.service';

type DashboardCardViewModel = DashboardCardResponse & {
  title: string;
  cssClass?: string;
};

@Component({
  selector: 'app-dashboard',
  imports: [PoWidgetModule, PoChartModule, PoTableModule, PoPageModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private readonly dashboardService = inject(DashboardService);

  readonly literals = injectI18n(dashboardLiterals);
  readonly data = signal<DashboardResponse | null>(null);
  readonly chartType = PoChartType.Column;

  readonly cards = computed<DashboardCardViewModel[]>(() => {
    const cards = this.data()?.cards ?? [];

    return cards.map((card) => ({
      ...card,
      title: this.getCardTitle(card.key),
      cssClass: this.getCardCssClass(card.tone),
    }));
  });

  readonly hasChart = computed(() => {
    const chart = this.data()?.chart;

    return !!chart && chart.series.length > 0;
  });

  readonly chartTitle = computed(() => {
    const key = this.data()?.chart?.key;

    return key ? this.getChartTitle(key) : '';
  });

  readonly chartCategories = computed<string[]>(() => this.data()?.chart?.categories ?? []);

  readonly chartSeries = computed<PoChartSerie[]>(() => {
    const series = this.data()?.chart?.series ?? [];

    return series.map((item) => ({
      label: this.getChartSerieLabel(item.label),
      data: item.data,
    }));
  });

  readonly hasLatestOrders = computed(() => {
    const latestOrders = this.data()?.latestOrders;

    return !!latestOrders && latestOrders.items.length > 0;
  });

  readonly latestOrdersTitle = computed(() => {
    const key = this.data()?.latestOrders?.key;

    return key ? this.getLatestOrdersTitle(key) : '';
  });

  readonly columns = computed<PoTableColumn[]>(() => [
    { property: 'code', label: this.literals().table.code },
    { property: 'customer', label: this.literals().table.customer },
    {
      property: 'status',
      label: this.literals().table.status,
      type: 'label',
      labels: [
        {
          value: OrderStatus.Pending,
          color: 'color-07',
          label: this.literals().status.pending,
          icon: 'an an-clock',
        },
        {
          value: OrderStatus.Open,
          color: 'color-10',
          label: this.literals().status.open,
          icon: 'an an-folder-open',
        },
        {
          value: OrderStatus.InProgress,
          color: 'color-08',
          label: this.literals().status.inProgress,
          icon: 'an an-gear',
        },
        {
          value: OrderStatus.Closed,
          color: 'color-12',
          label: this.literals().status.closed,
          icon: 'an an-check',
        },
        {
          value: OrderStatus.Canceled,
          color: 'color-01',
          label: this.literals().status.canceled,
          icon: 'an an-x',
        },
      ],
    },
  ]);

  readonly items = computed(() => this.data()?.latestOrders?.items ?? []);

  constructor() {
    this.load();
  }

  private load(): void {
    this.dashboardService.get().subscribe({
      next: (response) => this.data.set(response),
    });
  }

  private getCardTitle(key: string): string {
    switch (key) {
      case 'customers':
        return this.literals().widgets.customers;
      case 'services':
        return this.literals().widgets.services;
      case 'active-orders':
        return this.literals().widgets.activeOrders;
      case 'closed-orders':
        return this.literals().widgets.closedOrders;
      case 'today-orders':
        return this.literals().widgets.todayOrders;
      case 'pending-orders':
        return this.literals().widgets.pendingOrders;
      case 'in-progress-orders':
        return this.literals().widgets.inProgressOrders;
      default:
        return key;
    }
  }

  private getCardCssClass(tone: DashboardCardResponse['tone']): string | undefined {
    switch (tone) {
      case 'warning':
        return 'text-warning';
      case 'success':
        return 'text-success';
      case 'danger':
        return 'text-danger';
      default:
        return undefined;
    }
  }

  private getChartTitle(key: string): string {
    switch (key) {
      case 'orders-last-7-days':
        return this.literals().widgets.ordersWeek;
      case 'my-orders-last-7-days':
        return this.literals().widgets.myOrdersWeek;
      default:
        return key;
    }
  }

  private getChartSerieLabel(key: string): string {
    switch (key) {
      case 'orders':
        return this.literals().chartSeries.orders;
      case 'my-orders':
        return this.literals().chartSeries.myOrders;
      default:
        return key;
    }
  }

  private getLatestOrdersTitle(key: string): string {
    switch (key) {
      case 'latest-orders':
        return this.literals().widgets.latestOrders;
      case 'my-latest-orders':
        return this.literals().widgets.myLatestOrders;
      default:
        return key;
    }
  }
}
