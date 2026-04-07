import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { PaginationComponent } from '@components/shared/pagination/pagination.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { servicesLiterals } from '@i18n/services/services.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { GerServicesRequest } from '@models/services/requests/get-services.request';
import { ServiceResponse } from '@models/services/responses/service.response';
import {
  PoPageAction,
  PoPageModule,
  PoTableAction,
  PoTableColumn,
  PoTableColumnSpacing,
  PoTableModule,
} from '@po-ui/ng-components';
import { DevicesService } from '@services/devices/devices.service';
import { ModalService } from '@services/modal/modal.service';
import { ServicesService } from '@services/services/services.service';
import { finalize } from 'rxjs';
import { CreateServiceComponent } from './create-service/create-service.component';
import { DetailServiceComponent } from './detail-service/detail-service.component';
import { FilterServiceComponent } from './filter-service/filter-service.component';
import { UpdateServiceComponent } from './update-service/update-service.component';

@Component({
  selector: 'app-services',
  imports: [CommonModule, PoTableModule, PoPageModule, PaginationComponent, FilterServiceComponent],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
})
export class ServicesComponent implements OnInit {
  private readonly servicesService = inject(ServicesService);
  private readonly modalService = inject(ModalService);
  private readonly devicesService = inject(DevicesService);

  @ViewChild(FilterServiceComponent) filterComponent!: FilterServiceComponent;

  readonly literals = injectI18n(servicesLiterals);
  readonly common = injectI18n(commonLiterals);

  readonly spacing = PoTableColumnSpacing;

  readonly loading = signal(false);

  readonly page = signal<number>(0);
  readonly pageSize = signal<number>(0);
  readonly totalItems = signal<number>(0);
  readonly items = signal<ServiceResponse[]>([]);

  readonly request = signal<GerServicesRequest>({ page: 1, pageSize: 10 });

  readonly pageActions = computed<PoPageAction[]>(() => {
    const actions: PoPageAction[] = [
      {
        label: this.literals().pageActions.newService,
        icon: 'an an-plus',
        action: () => this.openCreateModal(),
      },
    ];

    if (this.devicesService.isMobile()) {
      actions.push({
        label: this.common().filters,
        icon: 'an an-funnel',
        action: () => this.openFilters(),
      });
    }

    return actions;
  });

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

  openFilters(): void {
    this.filterComponent.openMobileFilters();
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
      .getServices(this.request())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          this.page.set(response.page);
          this.pageSize.set(response.pageSize);
          this.totalItems.set(response.totalItems);
          this.items.set(response.items);
        },
      });
  }

  onFilterChange(filter: Partial<GerServicesRequest>): void {
    this.request.set({
      ...this.request(),
      ...filter,
      page: 1,
    });

    this.loadServices();
  }

  onPageChange(page: number) {
    this.request.set({ ...this.request(), page: page });
    this.loadServices();
  }
}
