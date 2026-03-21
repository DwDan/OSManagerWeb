import { Component } from '@angular/core';
import {
  PoChartModule,
  PoChartSerie,
  PoChartType,
  PoTableColumn,
  PoTableModule,
  PoWidgetModule,
} from '@po-ui/ng-components';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [PoWidgetModule, PoChartModule, PoTableModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  totalUsuarios = 124;
  totalOrdens = 58;
  ordensAbertas = 12;
  ordensFinalizadas = 46;

  chartType = PoChartType.Column;

  chartCategories: string[] = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];

  chartSeries: PoChartSerie[] = [
    {
      label: 'Ordens',
      data: [5, 8, 6, 10, 7],
    },
  ];

  columns: PoTableColumn[] = [
    { property: 'id', label: 'Código' },
    { property: 'cliente', label: 'Cliente' },
    { property: 'status', label: 'Status' },
  ];

  items = [
    { id: 1, cliente: 'João', status: 'Aberta' },
    { id: 2, cliente: 'Maria', status: 'Finalizada' },
    { id: 3, cliente: 'Pedro', status: 'Em andamento' },
  ];
}
