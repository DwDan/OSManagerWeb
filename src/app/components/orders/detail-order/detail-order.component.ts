import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseModalComponent } from '@directives/base-modal.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { ordersLiterals } from '@i18n/orders/orders.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { OrderDetailsResponse } from '@models/orders/responses/order-details.response';
import { ExecutionResult } from '@models/orders/types/execution-result.enum';
import { OrderStatus } from '@models/orders/types/order-status.enum';
import { ServiceResponse } from '@models/services/responses/service.response';
import {
  PoButtonModule,
  PoFieldModule,
  PoModalAction,
  PoModalModule,
  PoPageModule,
  PoTableModule,
  PoTagModule,
} from '@po-ui/ng-components';
import { OrdersService } from '@services/orders/orders.service';
import { finalize } from 'rxjs';

type OrderTagViewModel = {
  label: string;
  color?: string;
  icon?: string;
};

@Component({
  selector: 'app-detail-order',
  imports: [
    CommonModule,
    FormsModule,
    PoTableModule,
    PoPageModule,
    PoModalModule,
    PoFieldModule,
    PoButtonModule,
    PoTagModule,
  ],
  templateUrl: './detail-order.component.html',
  styleUrl: './detail-order.component.scss',
})
export class DetailOrderComponent extends BaseModalComponent<{ orderId: string }, {}> {
  private readonly ordersService = inject(OrdersService);

  readonly literals = injectI18n(ordersLiterals);
  readonly common = injectI18n(commonLiterals);
  readonly loading = signal(false);
  readonly selectedOrder = signal<OrderDetailsResponse | null>(null);

  readonly primaryAction = computed<PoModalAction>(() => ({
    label: this.common().close,
    action: this.close.bind(this),
  }));

  ngOnInit(): void {
    this.openDetails(this.data!.orderId);
  }

  openDetails(id: string): void {
    this.loading.set(true);

    this.ordersService
      .getById(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (order) => {
          this.selectedOrder.set(order);
        },
      });
  }

  downloadEvidence(orderId: string, evidenceId: string, fileName: string): void {
    this.ordersService.downloadEvidence(orderId, evidenceId).subscribe({
      next: (file) => {
        const blobUrl = window.URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(blobUrl);
      },
    });
  }

  getServiceNames(services?: ServiceResponse[] | null): string {
    if (!services?.length) {
      return '';
    }

    return services.map((service) => service.name).join(', ');
  }

  getStatusTag(status: OrderStatus): OrderTagViewModel {
    switch (status) {
      case OrderStatus.Pending:
        return {
          label: this.literals().status.pending,
          color: 'color-08',
          icon: 'an an-clock',
        };

      case OrderStatus.Open:
        return {
          label: this.literals().status.open,
          color: 'color-07',
          icon: 'an an-folder-open',
        };

      case OrderStatus.InProgress:
        return {
          label: this.literals().status.inProgress,
          color: 'color-01',
          icon: 'an an-gear',
        };

      case OrderStatus.Closed:
        return {
          label: this.literals().status.closed,
          color: 'color-11',
          icon: 'an an-check-circle',
        };

      case OrderStatus.Canceled:
        return {
          label: this.literals().status.canceled,
          color: 'color-13',
          icon: 'an an-x-circle',
        };

      default:
        return {
          label: String(status),
        };
    }
  }

  getExecutionResultTag(result: ExecutionResult | null | undefined): OrderTagViewModel {
    if (result === null || result === undefined) {
      return {
        label: this.common().notInformed,
      };
    }

    switch (result) {
      case ExecutionResult.Successful:
        return {
          label: this.literals().executionResult.successful,
          color: 'color-11',
          icon: 'an an-check-circle',
        };

      case ExecutionResult.Unsuccessful:
        return {
          label: this.literals().executionResult.unsuccessful,
          color: 'color-13',
          icon: 'an an-x-circle',
        };

      default:
        return {
          label: String(result),
        };
    }
  }
}
