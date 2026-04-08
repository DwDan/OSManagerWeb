import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseModalComponent } from '@directives/base-modal.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { ordersLiterals } from '@i18n/orders/orders.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { AssignOrderTechnicianRequest } from '@models/orders/requests/assign-order-technician.request';
import {
  PoButtonModule,
  PoFieldModule,
  PoModalAction,
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
  readonly selectedEvidenceFiles = signal<File[]>([]);

  readonly primaryAction = computed<PoModalAction>(() => ({
    label: this.common().send,
    action: this.save.bind(this),
    loading: this.loading(),
    disabled: this.selectedEvidenceFiles().length === 0,
  }));

  readonly secondaryAction = computed<PoModalAction>(() => ({
    label: this.common().cancel,
    action: this.close.bind(this),
    loading: this.loading(),
  }));

  assignTechnicianForm: AssignOrderTechnicianRequest = {
    technicianId: '',
  };

  onEvidenceFilesChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedEvidenceFiles.set(input.files ? Array.from(input.files) : []);
  }

  save(): void {
    const files = this.selectedEvidenceFiles();

    if (files.length === 0) {
      return;
    }

    this.loading.set(true);

    this.ordersService
      .addEvidences(this.data!.orderId, { files })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.poNotification.success(this.literals().notifications.evidencesSent);
          this.submit({ confirmed: true });
        },
      });
  }
}
