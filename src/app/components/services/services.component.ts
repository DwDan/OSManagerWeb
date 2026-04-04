import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { commonLiterals } from '@i18n/common/common.literals';
import { servicesLiterals } from '@i18n/services/services.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { CreateServiceRequest } from '@models/services/requests/create-service.request';
import { UpdateServiceRequest } from '@models/services/requests/update-service.request';
import { ServiceDetailsResponse } from '@models/services/responses/service-details.response';
import { ServiceResponse } from '@models/services/responses/service.response';
import {
  PoButtonModule,
  PoFieldModule,
  PoModalComponent,
  PoModalModule,
  PoNotificationService,
  PoPageAction,
  PoPageModule,
  PoTableAction,
  PoTableColumn,
  PoTableColumnSpacing,
  PoTableModule,
} from '@po-ui/ng-components';
import { ServicesService } from '@services/services/services.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-services',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PoTableModule,
    PoPageModule,
    PoModalModule,
    PoFieldModule,
    PoButtonModule,
  ],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
})
export class ServicesComponent implements OnInit {
  @ViewChild('createModal', { static: true }) createModal!: PoModalComponent;
  @ViewChild('editModal', { static: true }) editModal!: PoModalComponent;
  @ViewChild('detailsModal', { static: true }) detailsModal!: PoModalComponent;

  private readonly servicesService = inject(ServicesService);
  private readonly poNotification = inject(PoNotificationService);
  private readonly formBuilder = inject(FormBuilder);

  readonly literals = injectI18n(servicesLiterals);
  readonly common = injectI18n(commonLiterals);

  readonly spacing = PoTableColumnSpacing;

  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly items = signal<ServiceResponse[]>([]);
  readonly selectedService = signal<ServiceDetailsResponse | null>(null);
  readonly selectedServiceId = signal<string | null>(null);

  readonly createForm = this.buildServiceForm();
  readonly editForm = this.buildServiceForm();

  readonly pageActions = computed<PoPageAction[]>(() => [
    {
      label: this.literals().pageActions.newService,
      action: () => this.openCreateModal(),
    },
    {
      label: this.literals().pageActions.refresh,
      action: () => this.loadServices(),
    },
  ]);

  readonly tableActions = computed<PoTableAction[]>(() => [
    {
      label: this.literals().tableActions.details,
      action: (row: ServiceResponse) => this.openDetails(row.id),
    },
    {
      label: this.literals().tableActions.edit,
      action: (row: ServiceResponse) => this.openEditModal(row.id),
    },
  ]);

  readonly columns = computed<PoTableColumn[]>(() => [
    { property: 'name', label: this.literals().columns.service },
    {
      property: 'amountToReceive',
      label: this.literals().columns.amountToReceive,
      type: 'columnTemplate',
    },
    {
      property: 'amountToPay',
      label: this.literals().columns.amountToPay,
      type: 'columnTemplate',
    },
  ]);

  ngOnInit(): void {
    this.loadServices();
  }

  openCreateModal(): void {
    this.createForm.reset(this.createEmptyServiceForm());
    this.createModal.open();
  }

  saveCreate(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    const request = this.createForm.getRawValue() as CreateServiceRequest;

    this.saving.set(true);

    this.servicesService
      .create(request)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.poNotification.success(this.literals().notifications.created);
          this.createModal.close();
          this.loadServices();
        },
      });
  }

  openEditModal(id: string): void {
    this.saving.set(true);

    this.servicesService
      .getById(id)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (service) => {
          this.selectedServiceId.set(id);
          this.editForm.reset({
            name: service.name,
            amountToReceive: service.amountToReceive,
            amountToPay: service.amountToPay,
          });
          this.editModal.open();
        },
      });
  }

  saveEdit(): void {
    const id = this.selectedServiceId();

    if (!id) {
      return;
    }

    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const request = this.editForm.getRawValue() as UpdateServiceRequest;

    this.saving.set(true);

    this.servicesService
      .update(id, request)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.poNotification.success(this.literals().notifications.updated);
          this.editModal.close();
          this.loadServices();
        },
      });
  }

  openDetails(id: string): void {
    this.saving.set(true);

    this.servicesService
      .getById(id)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (service) => {
          this.selectedService.set(service);
          this.detailsModal.open();
        },
      });
  }

  private loadServices(): void {
    this.loading.set(true);

    this.servicesService
      .getServices()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (services) => {
          this.items.set(services);
        },
      });
  }

  private buildServiceForm() {
    return this.formBuilder.nonNullable.group({
      name: ['', [Validators.required]],
      amountToReceive: [0],
      amountToPay: [0],
    });
  }

  private createEmptyServiceForm(): CreateServiceRequest {
    return {
      name: '',
      amountToReceive: 0,
      amountToPay: 0,
    };
  }
}
