import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseModalComponent } from '@directives/base-modal.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { servicesLiterals } from '@i18n/services/services.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { UpdateServiceRequest } from '@models/services/requests/update-service.request';
import {
  PoFieldModule,
  PoModalAction,
  PoModalModule,
  PoNotificationService,
} from '@po-ui/ng-components';
import { ServicesService } from '@services/services/services.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-update-service',
  templateUrl: './update-service.component.html',
  styleUrls: ['./update-service.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PoFieldModule, PoModalModule],
})
export class UpdateServiceComponent
  extends BaseModalComponent<{ serviceId: string }, { confirmed: boolean }>
  implements OnInit
{
  private readonly servicesService = inject(ServicesService);
  private readonly poNotification = inject(PoNotificationService);
  private readonly formBuilder = inject(FormBuilder);

  readonly literals = injectI18n(servicesLiterals);
  readonly common = injectI18n(commonLiterals);

  readonly primaryAction = computed<PoModalAction>(() => ({
    label: this.common().save,
    action: this.save.bind(this),
    disabled: this.loading() || this.form.invalid,
  }));

  readonly secondaryAction = computed<PoModalAction>(() => ({
    label: this.common().cancel,
    action: this.close.bind(this),
  }));

  readonly loading = signal(false);

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    amountToReceive: [0],
    amountToPay: [0],
  });

  ngOnInit(): void {
    this.loadService();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const request = this.form.getRawValue() as UpdateServiceRequest;

    this.loading.set(true);

    this.servicesService
      .update(this.data!.serviceId, request)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.poNotification.success(this.literals().notifications.updated);
          this.submit({ confirmed: true });
        },
      });
  }

  cancel(): void {
    this.close();
  }

  private loadService(): void {
    this.loading.set(true);

    this.servicesService
      .getById(this.data!.serviceId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (service) => {
          this.form.reset({
            name: service.name,
            amountToReceive: service.amountToReceive,
            amountToPay: service.amountToPay,
          });
        },
      });
  }
}
