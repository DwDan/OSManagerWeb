import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseModalComponent } from '@directives/base-modal.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { ordersLiterals } from '@i18n/orders/orders.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { AssignOrderTechnicianRequest } from '@models/orders/requests/assign-order-technician.request';
import {
  PoButtonModule,
  PoFieldModule,
  PoModalModule,
  PoNotificationService,
  PoPageModule,
  PoTableModule,
} from '@po-ui/ng-components';
import { OrdersService } from '@services/orders/orders.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-add-evidence',
  imports: [
    CommonModule,
    FormsModule,
    PoTableModule,
    PoPageModule,
    PoModalModule,
    PoFieldModule,
    PoButtonModule,
  ],
  templateUrl: './add-evidence.component.html',
  styleUrl: './add-evidence.component.scss',
})
export class AddEvidenceComponent extends BaseModalComponent<
  { orderId: string },
  { confirmed: boolean }
> {
  private readonly ordersService = inject(OrdersService);
  private readonly poNotification = inject(PoNotificationService);

  readonly literals = injectI18n(ordersLiterals);
  readonly common = injectI18n(commonLiterals);
  readonly loading = signal(false);

  readonly closeAction = {
    label: this.common().cancel,
    action: () => this.close(),
  };

  selectedEvidenceFiles: File[] = [];

  assignTechnicianForm: AssignOrderTechnicianRequest = {
    technicianId: '',
  };

  onEvidenceFilesChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedEvidenceFiles = input.files ? Array.from(input.files) : [];
  }

  saveEvidences(): void {
    if (this.selectedEvidenceFiles.length === 0) {
      return;
    }

    this.loading.set(true);

    this.ordersService
      .addEvidences(this.data!.orderId, { files: this.selectedEvidenceFiles })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.poNotification.success(this.literals().notifications.evidencesSent);
          this.submit({ confirmed: true });
        },
      });
  }
}
