import { Component, computed, inject, signal } from '@angular/core';
import { dashboardLiterals } from '@i18n/dashboard/dashboard.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
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

  readonly totalCustomers = computed(() => this.data()?.totalCustomers ?? 0);
  readonly totalServices = computed(() => this.data()?.totalServices ?? 0);
  readonly activeOrders = computed(() => this.data()?.activeOrders ?? 0);
  readonly closedOrders = computed(() => this.data()?.closedOrders ?? 0);

  readonly chartCategories = computed<string[]>(() => this.data()?.chartCategories ?? []);

  readonly chartSeries = computed<PoChartSerie[]>(() => {
    const series = this.data()?.chartSeries ?? [];

    return series.map((item) => ({
      label: item.label,
      data: item.data,
    }));
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

  readonly items = computed(() => this.data()?.latestOrders ?? []);

  constructor() {
    this.load();
  }

  private load(): void {
    this.dashboardService.get().subscribe({
      next: (response) => this.data.set(response),
    });
  }
}
