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
  PoModalAction,
  PoModalModule,
  PoNotificationService,
  PoPageModule,
  PoSelectOption,
  PoTableModule,
} from '@po-ui/ng-components';
import { OrdersService } from '@services/orders/orders.service';
import { finalize } from 'rxjs';
import { formInvalidSignal } from 'src/app/shared/extensions/form-extensions';

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

  readonly primaryAction = computed<PoModalAction>(() => ({
    label: this.common().save,
    action: this.save.bind(this),
    loading: this.loading(),
    disabled: this.formInvalid(),
  }));

  readonly secondaryAction = computed<PoModalAction>(() => ({
    label: this.common().cancel,
    action: this.close.bind(this),
    loading: this.loading(),
  }));

  readonly form = this.formBuilder.nonNullable.group({
    executionResult: [1],
    executionNotes: [''],
  });

  readonly formInvalid = formInvalidSignal(this.form);

  readonly executionResultOptions = computed<PoSelectOption[]>(() => [
    { label: this.literals().executionResult.successful, value: 1 },
    { label: this.literals().executionResult.unsuccessful, value: 2 },
  ]);

  ngOnInit(): void {
    this.form.reset({
      executionResult: 1,
      executionNotes: '',
    });
  }

  save(): void {
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
