import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseModalComponent } from '@directives/base-modal.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { ordersLiterals } from '@i18n/orders/orders.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { OrderDetailsResponse } from '@models/orders/responses/order-details.response';
import { ServiceResponse } from '@models/services/responses/service.response';
import {
  PoButtonModule,
  PoFieldModule,
  PoModalModule,
  PoPageModule,
  PoTableModule,
} from '@po-ui/ng-components';
import { OrdersService } from '@services/orders/orders.service';
import { finalize } from 'rxjs';

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

  readonly closeAction = {
    label: this.common().close,
    action: () => this.close(),
  };

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
}
