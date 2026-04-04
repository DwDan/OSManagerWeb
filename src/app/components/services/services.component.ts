import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { commonLiterals } from '@i18n/common/common.literals';
import { servicesLiterals } from '@i18n/services/services.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { ServiceResponse } from '@models/services/responses/service.response';
import {
  PoPageAction,
  PoPageModule,
  PoTableAction,
  PoTableColumn,
  PoTableColumnSpacing,
  PoTableModule,
} from '@po-ui/ng-components';
import { ModalService } from '@services/modal/modal.service';
import { ServicesService } from '@services/services/services.service';
import { finalize } from 'rxjs';
import { CreateServiceComponent } from './create-service/create-service.component';
import { DetailServiceComponent } from './detail-service/detail-service.component';
import { UpdateServiceComponent } from './update-service/update-service.component';

@Component({
  selector: 'app-services',
  imports: [CommonModule, PoTableModule, PoPageModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
})
export class ServicesComponent implements OnInit {
  private readonly servicesService = inject(ServicesService);
  private readonly modalService = inject(ModalService);

  readonly literals = injectI18n(servicesLiterals);
  readonly common = injectI18n(commonLiterals);

  readonly spacing = PoTableColumnSpacing;

  readonly loading = signal(false);
  readonly items = signal<ServiceResponse[]>([]);

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
    {
      property: 'name',
      label: this.literals().columns.service,
    },
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
    this.modalService.open(CreateServiceComponent).subscribe((result) => {
      if (result?.confirmed) {
        this.loadServices();
      }
    });
  }

  openEditModal(id: string): void {
    this.modalService.open(UpdateServiceComponent, { serviceId: id }).subscribe((result) => {
      if (result?.confirmed) {
        this.loadServices();
      }
    });
  }

  openDetails(id: string): void {
    this.modalService.open(DetailServiceComponent, { serviceId: id }).subscribe();
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
}
