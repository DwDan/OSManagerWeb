import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseModalComponent } from '@directives/base-modal.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { servicesLiterals } from '@i18n/services/services.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { CreateServiceRequest } from '@models/services/requests/create-service.request';
import { PoFieldModule, PoModalModule, PoNotificationService } from '@po-ui/ng-components';
import { ServicesService } from '@services/services/services.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-create-service',
  templateUrl: './create-service.component.html',
  styleUrls: ['./create-service.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PoFieldModule, PoModalModule],
})
export class CreateServiceComponent extends BaseModalComponent<void, { confirmed: boolean }> {
  private readonly servicesService = inject(ServicesService);
  private readonly poNotification = inject(PoNotificationService);
  private readonly formBuilder = inject(FormBuilder);

  readonly literals = injectI18n(servicesLiterals);
  readonly common = injectI18n(commonLiterals);

  readonly saving = signal(false);

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    amountToReceive: [0],
    amountToPay: [0],
  });

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const request = this.form.getRawValue() as CreateServiceRequest;

    this.saving.set(true);

    this.servicesService
      .create(request)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.poNotification.success(this.literals().notifications.created);
          this.submit({ confirmed: true });
        },
      });
  }

  cancel(): void {
    this.close();
  }
}
