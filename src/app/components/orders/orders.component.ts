import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AssignOrderTechnicianRequest } from '@models/orders/requests/assign-order-technician.request';
import { CloseOrderRequest } from '@models/orders/requests/close-order.request';
import { CreateOrderRequest } from '@models/orders/requests/create-order.request';
import { UpdateOrderRequest } from '@models/orders/requests/update-order.request';
import { OrderDetailsResponse } from '@models/orders/responses/order-details.response';
import { OrderListItemResponse } from '@models/orders/responses/order-list-item.response';
import { OrderResponse } from '@models/orders/responses/order.response';
import { OrderStatus } from '@models/orders/types/order-status.enum';
import { UserResponse } from '@models/users/responses/user.response';
import {
  PoButtonModule,
  PoFieldModule,
  PoModalComponent,
  PoModalModule,
  PoNotificationService,
  PoPageAction,
  PoPageModule,
  PoSelectOption,
  PoTableAction,
  PoTableColumn,
  PoTableColumnSpacing,
  PoTableModule,
} from '@po-ui/ng-components';
import { OrdersService } from '@services/orders/orders.service';
import { UsersService } from '@services/users/users.service';
import { finalize } from 'rxjs';
import { commonLiterals } from 'src/app/i18n/common/common.literals';
import { ordersLiterals } from 'src/app/i18n/orders/orders.literals';
import { injectI18n } from 'src/app/i18n/shared/inject-i18n';

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
    ],
    templateUrl: './orders.component.html',
    styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {
  @ViewChild('createModal', { static: true }) createModal!: PoModalComponent;
  @ViewChild('editModal', { static: true }) editModal!: PoModalComponent;
  @ViewChild('detailsModal', { static: true }) detailsModal!: PoModalComponent;
  @ViewChild('assignTechnicianModal', { static: true }) assignTechnicianModal!: PoModalComponent;
  @ViewChild('closeModal', { static: true }) closeModal!: PoModalComponent;
  @ViewChild('evidencesModal', { static: true }) evidencesModal!: PoModalComponent;

  private readonly ordersService = inject(OrdersService);
  private readonly usersService = inject(UsersService);
  private readonly poNotification = inject(PoNotificationService);

  readonly literals = injectI18n(ordersLiterals);
  readonly common = injectI18n(commonLiterals);

  readonly spacing = PoTableColumnSpacing;

  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly items = signal<OrderListItemResponse[]>([]);
  readonly selectedOrder = signal<OrderDetailsResponse | null>(null);
  readonly selectedOrderId = signal<string | null>(null);

  readonly technicians = signal<PoSelectOption[]>([]);

  readonly executionResultOptions = computed<PoSelectOption[]>(() => [
    { label: this.literals().executionResult.success, value: 1 },
    { label: this.literals().executionResult.failure, value: 2 },
  ]);

  createForm: CreateOrderRequest = this.createEmptyOrderForm();

  editForm: UpdateOrderRequest = this.createEmptyOrderForm();

  assignTechnicianForm: AssignOrderTechnicianRequest = {
    technicianId: '',
  };

  closeForm: CloseOrderRequest = {
    executionResult: 1,
    executionNotes: '',
  };

  selectedEvidenceFiles: File[] = [];

  readonly pageActions = computed<PoPageAction[]>(() => [
    {
      label: this.literals().pageActions.newOrder,
      action: () => this.openCreateModal(),
    },
    {
      label: this.literals().pageActions.refresh,
      action: () => this.loadOrders(),
    },
  ]);

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
    { property: 'status', label: this.literals().columns.status },
    { property: 'executionResult', label: this.literals().columns.result },
    { property: 'city', label: this.literals().columns.city },
    { property: 'state', label: this.literals().columns.state },
  ]);

  ngOnInit(): void {
    this.loadOrders();
    this.loadTechnicians();
  }

  openCreateModal(): void {
    this.createForm = this.createEmptyOrderForm();
    this.createModal.open();
  }

  saveCreate(): void {
    this.saving.set(true);

    this.ordersService
      .create(this.createForm)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.poNotification.success(this.literals().notifications.created);
          this.createModal.close();
          this.loadOrders();
        },
      });
  }

  openEditModal(id: string): void {
    this.saving.set(true);

    this.ordersService
      .getById(id)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (order) => {
          this.selectedOrderId.set(id);
          this.editForm = {
            customerName: order.customerName,
            postalCode: order.address.postalCode,
            street: order.address.street,
            number: order.address.number,
            city: order.address.city,
            state: order.address.state,
            country: order.address.country,
            complement: order.address.complement ?? '',
            reference: order.address.reference ?? '',
          };
          this.editModal.open();
        },
      });
  }

  saveEdit(): void {
    const id = this.selectedOrderId();

    if (!id) {
      return;
    }

    this.saving.set(true);

    this.ordersService
      .update(id, this.editForm)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.poNotification.success(this.literals().notifications.updated);
          this.editModal.close();
          this.loadOrders();
        },
      });
  }

  openDetails(id: string): void {
    this.saving.set(true);

    this.ordersService
      .getById(id)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (order) => {
          this.selectedOrder.set(order);
          this.detailsModal.open();
        },
      });
  }

  openAssignTechnicianModal(id: string): void {
    this.selectedOrderId.set(id);
    this.assignTechnicianForm = {
      technicianId: '',
    };
    this.assignTechnicianModal.open();
  }

  saveAssignTechnician(): void {
    const id = this.selectedOrderId();

    if (!id || !this.assignTechnicianForm.technicianId) {
      return;
    }

    this.saving.set(true);

    this.ordersService
      .assignTechnician(id, this.assignTechnicianForm)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.poNotification.success(this.literals().notifications.assignedTechnician);
          this.assignTechnicianModal.close();
          this.loadOrders();
        },
      });
  }

  openOrder(id: string): void {
    this.saving.set(true);

    this.ordersService
      .open(id)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.poNotification.success(this.literals().notifications.opened);
          this.loadOrders();
        },
      });
  }

  startExecution(id: string): void {
    this.saving.set(true);

    this.ordersService
      .startExecution(id)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.poNotification.success(this.literals().notifications.startedExecution);
          this.loadOrders();
        },
      });
  }

  openCloseModal(id: string): void {
    this.selectedOrderId.set(id);
    this.closeForm = {
      executionResult: 1,
      executionNotes: '',
    };
    this.closeModal.open();
  }

  saveClose(): void {
    const id = this.selectedOrderId();

    if (!id) {
      return;
    }

    this.saving.set(true);

    this.ordersService
      .close(id, this.closeForm)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.poNotification.success(this.literals().notifications.closed);
          this.closeModal.close();
          this.loadOrders();
        },
      });
  }

  cancelOrder(id: string): void {
    this.saving.set(true);

    this.ordersService
      .cancel(id)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.poNotification.success(this.literals().notifications.canceled);
          this.loadOrders();
        },
      });
  }

  openEvidencesModal(id: string): void {
    this.selectedOrderId.set(id);
    this.selectedEvidenceFiles = [];
    this.evidencesModal.open();
  }

  onEvidenceFilesChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedEvidenceFiles = input.files ? Array.from(input.files) : [];
  }

  saveEvidences(): void {
    const id = this.selectedOrderId();

    if (!id || this.selectedEvidenceFiles.length === 0) {
      return;
    }

    this.saving.set(true);

    this.ordersService
      .addEvidences(id, { files: this.selectedEvidenceFiles })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.poNotification.success(this.literals().notifications.evidencesSent);
          this.evidencesModal.close();
        },
      });
  }

  downloadEvidence(orderId: string, evidenceId: string, fileName: string): void {
    this.ordersService.downloadEvidence(orderId, evidenceId).subscribe({
      next: (file) => {
        const blobUrl = window.URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(blobUrl);
      },
    });
  }

  private loadOrders(): void {
    this.loading.set(true);

    this.ordersService
      .getOrders()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (orders) => {
          this.items.set(orders.map((order) => this.mapOrderToListItem(order)));
        },
      });
  }

  private loadTechnicians(): void {
    this.usersService.getUsers().subscribe({
      next: (users: UserResponse[]) => {
        this.technicians.set(
          users.map((user) => ({
            label: `${user.firstName} ${user.lastName}`,
            value: user.id,
          })),
        );
      },
    });
  }

  private mapOrderToListItem(order: OrderResponse): OrderListItemResponse {
    return {
      id: order.id,
      code: order.code,
      customerName: order.customerName,
      technicianName: order.technician?.name ?? this.common().notInformed,
      status: order.status,
      executionResult: order.executionResult ?? this.common().notInformed,
      city: order.address.city,
      state: order.address.state,
    };
  }

  private createEmptyOrderForm(): CreateOrderRequest {
    return {
      customerName: '',
      postalCode: '',
      street: '',
      number: '',
      city: '',
      state: '',
      country: 'Brasil',
      complement: '',
      reference: '',
    };
  }
}
