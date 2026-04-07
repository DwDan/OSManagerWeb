import { Component, computed } from '@angular/core';
import { PageComponent } from '@components/shared/page-default/page.component';
import { dashboardLiterals } from '@i18n/dashboard/dashboard.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import {
  PoChartModule,
  PoChartSerie,
  PoChartType,
  PoPageModule,
  PoTableColumn,
  PoTableModule,
  PoWidgetModule,
} from '@po-ui/ng-components';

@Component({
  selector: 'app-dashboard',
  imports: [PoWidgetModule, PoChartModule, PoTableModule, PoPageModule, PageComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  readonly literals = injectI18n(dashboardLiterals);

  totalUsuarios = 124;
  totalOrdens = 58;
  ordensAbertas = 12;
  ordensFinalizadas = 46;

  chartType = PoChartType.Column;

  chartCategories = computed<string[]>(() => [
    this.literals().chartCategories.monday,
    this.literals().chartCategories.tuesday,
    this.literals().chartCategories.wednesday,
    this.literals().chartCategories.thursday,
    this.literals().chartCategories.friday,
  ]);

  chartSeries = computed<PoChartSerie[]>(() => [
    {
      label: this.literals().chartSeries.orders,
      data: [5, 8, 6, 10, 7],
    },
  ]);

  columns = computed<PoTableColumn[]>(() => [
    { property: 'id', label: this.literals().table.code },
    { property: 'cliente', label: this.literals().table.customer },
    { property: 'status', label: this.literals().table.status },
  ]);

  items = computed(() => [
    { id: 1, cliente: 'João', status: this.literals().status.open },
    { id: 2, cliente: 'Maria', status: this.literals().status.closed },
    { id: 3, cliente: 'Pedro', status: this.literals().status.inProgress },
  ]);
}
