import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '@components/shared/pagination/pagination.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { ordersLiterals } from '@i18n/orders/orders.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { GerOrdersRequest } from '@models/orders/requests/get-orders.request';
import { OrderListItemResponse } from '@models/orders/responses/order-list-item.response';
import { OrderStatus } from '@models/orders/types/order-status.enum';
import {
  PoButtonModule,
  PoFieldModule,
  PoModalModule,
  PoNotificationService,
  PoPageAction,
  PoPageModule,
  PoTableAction,
  PoTableColumn,
  PoTableColumnSpacing,
  PoTableModule,
} from '@po-ui/ng-components';
import { DevicesService } from '@services/devices/devices.service';
import { ModalService } from '@services/modal/modal.service';
import { OrdersService } from '@services/orders/orders.service';
import { finalize } from 'rxjs';
import { AddEvidenceComponent } from './add-evidence/add-evidence.component';
import { AssignTechnicianComponent } from './assign-technician/assign-technician.component';
import { CloseOrderComponent } from './close-order/close-order.component';
import { CreaterOrderComponent } from './creater-order/creater-order.component';
import { DetailOrderComponent } from './detail-order/detail-order.component';
import { FilterOrderComponent } from './filter-order/filter-order.component';
import { UpdateOrderComponent } from './update-order/update-order.component';

@Component({
  selector: 'app-orders',
  imports: [
    CommonModule,
    FormsModule,
    PoTableModule,
    PoPageModule,
    PoModalModule,
    PoFieldModule,
    PoButtonModule,
    PaginationComponent,
    FilterOrderComponent,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent implements OnInit {
  private readonly ordersService = inject(OrdersService);
  private readonly poNotification = inject(PoNotificationService);
  private readonly modalService = inject(ModalService);
  private readonly devicesService = inject(DevicesService);

  @ViewChild(FilterOrderComponent) filterComponent!: FilterOrderComponent;

  readonly literals = injectI18n(ordersLiterals);
  readonly common = injectI18n(commonLiterals);

  readonly spacing = PoTableColumnSpacing;

  readonly loading = signal(false);

  readonly page = signal<number>(0);
  readonly pageSize = signal<number>(0);
  readonly totalItems = signal<number>(0);
  readonly items = signal<OrderListItemResponse[]>([]);

  readonly request = signal<GerOrdersRequest>({ page: 1, pageSize: 10 });

  readonly pageActions = computed<PoPageAction[]>(() => {
    const actions: PoPageAction[] = [
      {
        label: this.literals().pageActions.newOrder,
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
      action: (row: OrderListItemResponse) => this.openDetails(row.id),
    },
    {
      label: this.literals().tableActions.edit,
      action: (row: OrderListItemResponse) => this.openEditModal(row.id),
      visible: (row: OrderListItemResponse) => row.status === OrderStatus.Pending,
    },
    {
      label: this.literals().tableActions.assignTechnician,
      action: (row: OrderListItemResponse) => this.openAssignTechnicianModal(row.id),
      visible: (row: OrderListItemResponse) => row.status === OrderStatus.Pending,
    },
    {
      label: this.literals().tableActions.open,
      action: (row: OrderListItemResponse) => this.openOrder(row.id),
      visible: (row: OrderListItemResponse) => row.status === OrderStatus.Pending,
    },
    {
      label: this.literals().tableActions.startExecution,
      action: (row: OrderListItemResponse) => this.startExecution(row.id),
      visible: (row: OrderListItemResponse) => row.status === OrderStatus.Open,
    },
    {
      label: this.literals().tableActions.close,
      action: (row: OrderListItemResponse) => this.openCloseModal(row.id),
      visible: (row: OrderListItemResponse) => row.status === OrderStatus.InProgress,
    },
    {
      label: this.literals().tableActions.cancel,
      action: (row: OrderListItemResponse) => this.cancelOrder(row.id),
      visible: (row: OrderListItemResponse) => row.status !== OrderStatus.Closed,
    },
    {
      label: this.literals().tableActions.evidences,
      action: (row: OrderListItemResponse) => this.openEvidencesModal(row.id),
      visible: (row: OrderListItemResponse) => row.status === OrderStatus.InProgress,
    },
  ]);

  readonly columns = computed<PoTableColumn[]>(() => [
    { property: 'code', label: this.literals().columns.code },
    { property: 'customerName', label: this.literals().columns.customer },
    { property: 'technicianName', label: this.literals().columns.technician },
    {
      property: 'status',
      label: this.literals().columns.status,
      type: 'label',
      labels: [
        {
          value: 'Pending',
          color: 'color-07',
          label: this.literals().status.Pending,
          icon: 'an an-clock',
        },
        {
          value: 'Open',
          color: 'color-10',
          label: this.literals().status.Open,
          icon: 'an an-folder-open',
        },
        {
          value: 'InProgress',
          color: 'color-08',
          label: this.literals().status.InProgress,
          icon: 'an an-gear',
        },
        {
          value: 'Closed',
          color: 'color-12',
          label: this.literals().status.Closed,
          icon: 'an an-check',
        },
        {
          value: 'Canceled',
          color: 'color-01',
          label: this.literals().status.Canceled,
          icon: 'an an-x',
        },
      ],
    },
    {
      property: 'executionResult',
      label: this.literals().columns.result,
      type: 'label',
      labels: [
        {
          value: 'Successful',
          color: 'color-12',
          label: this.literals().executionResult.success,
          icon: 'an an-check',
        },
        {
          value: 'Unsuccessful',
          color: 'color-01',
          label: this.literals().executionResult.failure,
          icon: 'an an-x',
        },
      ],
    },
    { property: 'city', label: this.literals().columns.city },
    { property: 'state', label: this.literals().columns.state },
  ]);

  ngOnInit(): void {
    this.loadOrders();
  }

  openFilters(): void {
    this.filterComponent.openMobileFilters();
  }

  openCreateModal(): void {
    this.modalService.open(CreaterOrderComponent, {}).subscribe((result) => {
      if (!result?.confirmed) {
        return;
      }

      this.loadOrders();
    });
  }

  openEditModal(id: string): void {
    this.modalService.open(UpdateOrderComponent, { orderId: id }).subscribe((result) => {
      if (!result?.confirmed) {
        return;
      }

      this.loadOrders();
    });
  }

  openDetails(id: string): void {
    this.modalService.open(DetailOrderComponent, { orderId: id });
  }

  openAssignTechnicianModal(id: string): void {
    this.modalService.open(AssignTechnicianComponent, { orderId: id }).subscribe((result) => {
      if (!result?.confirmed) {
        return;
      }

      this.loadOrders();
    });
  }

  openOrder(id: string): void {
    this.loading.set(true);

    this.ordersService
      .open(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.poNotification.success(this.literals().notifications.opened);
          this.loadOrders();
        },
      });
  }

  startExecution(id: string): void {
    this.loading.set(true);

    this.ordersService
      .startExecution(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.poNotification.success(this.literals().notifications.startedExecution);
          this.loadOrders();
        },
      });
  }

  openCloseModal(id: string): void {
    this.modalService.open(CloseOrderComponent, { orderId: id }).subscribe((result) => {
      if (!result?.confirmed) {
        return;
      }

      this.loadOrders();
    });
  }

  cancelOrder(id: string): void {
    this.loading.set(true);

    this.ordersService
      .cancel(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.poNotification.success(this.literals().notifications.canceled);
          this.loadOrders();
        },
      });
  }

  openEvidencesModal(id: string): void {
    this.modalService.open(AddEvidenceComponent, { orderId: id });
  }

  private loadOrders(): void {
    this.loading.set(true);

    this.ordersService
      .getOrders(this.request())
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

  onFilterChange(filter: Partial<GerOrdersRequest>): void {
    this.request.set({
      ...this.request(),
      ...filter,
      page: 1,
    });

    this.loadOrders();
  }

  onPageChange(page: number) {
    this.request.set({ ...this.request(), page: page });
    this.loadOrders();
  }
}
