import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BaseModalComponent } from '@directives/base-modal.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { ordersLiterals } from '@i18n/orders/orders.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { CloseOrderRequest } from '@models/orders/requests/close-order.request';
import {
  PoButtonModule,
  PoFieldModule,
  PoModalModule,
  PoNotificationService,
  PoPageModule,
  PoSelectOption,
  PoTableModule,
} from '@po-ui/ng-components';
import { OrdersService } from '@services/orders/orders.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-close-order',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PoTableModule,
    PoPageModule,
    PoModalModule,
    PoFieldModule,
    PoButtonModule,
  ],
  templateUrl: './close-order.component.html',
  styleUrl: './close-order.component.scss',
})
export class CloseOrderComponent extends BaseModalComponent<
  { orderId: string },
  { confirmed: boolean }
> {
  private readonly ordersService = inject(OrdersService);
  private readonly poNotification = inject(PoNotificationService);
  private readonly formBuilder = inject(FormBuilder);

  readonly literals = injectI18n(ordersLiterals);
  readonly common = injectI18n(commonLiterals);
  readonly loading = signal(false);

  readonly closeAction = {
    label: this.common().cancel,
    action: () => this.close(),
  };

  readonly form = this.formBuilder.nonNullable.group({
    executionResult: [1],
    executionNotes: [''],
  });

  readonly executionResultOptions = computed<PoSelectOption[]>(() => [
    { label: this.literals().executionResult.success, value: 1 },
    { label: this.literals().executionResult.failure, value: 2 },
  ]);

  ngOnInit(): void {
    this.form.reset({
      executionResult: 1,
      executionNotes: '',
    });
  }

  saveClose(): void {
    const request: CloseOrderRequest = {
      executionResult: this.form.controls.executionResult.getRawValue(),
      executionNotes: this.form.controls.executionNotes.getRawValue(),
    };

    this.loading.set(true);

    this.ordersService
      .close(this.data!.orderId, request)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.poNotification.success(this.literals().notifications.closed);
          this.submit({ confirmed: true });
        },
      });
  }
}
