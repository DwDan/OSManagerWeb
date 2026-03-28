import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { finalize } from 'rxjs';
import { AssignOrderTechnicianRequest } from '../../models/orders/requests/assign-order-technician.request';
import { CloseOrderRequest } from '../../models/orders/requests/close-order.request';
import { CreateOrderRequest } from '../../models/orders/requests/create-order.request';
import { UpdateOrderRequest } from '../../models/orders/requests/update-order.request';
import { OrderDetailsResponse } from '../../models/orders/responses/order-details.response';
import { OrderResponse } from '../../models/orders/responses/order.response';
import { UserResponse } from '../../models/users/responses/user.response';
import { OrdersService } from '../../services/orders/orders.service';
import { UsersService } from '../../services/users/users.service';

interface OrdemServicoListItem {
  id: string;
  code: string;
  client: string;
  technicianName: string;
  status: string;
  executionResult: string;
  city: string;
  state: string;
}

@Component({
  selector: 'app-orders',
  standalone: true,
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
  styleUrl: './orders.component.scss',
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

  readonly spacing = PoTableColumnSpacing;

  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly items = signal<OrdemServicoListItem[]>([]);
  readonly selectedOrder = signal<OrderDetailsResponse | null>(null);
  readonly selectedOrderId = signal<string | null>(null);

  readonly technicians = signal<PoSelectOption[]>([]);

  readonly executionResultOptions: PoSelectOption[] = [
    { label: 'Sucesso', value: 1 },
    { label: 'Falha', value: 2 },
  ];

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

  readonly pageActions: PoPageAction[] = [
    {
      label: 'Nova ordem',
      action: () => this.openCreateModal(),
    },
    {
      label: 'Atualizar',
      action: () => this.loadOrders(),
    },
  ];

  readonly tableActions: PoTableAction[] = [
    {
      label: 'Detalhes',
      action: (row: OrdemServicoListItem) => this.openDetails(row.id),
    },
    {
      label: 'Editar',
      action: (row: OrdemServicoListItem) => this.openEditModal(row.id),
    },
    {
      label: 'Atribuir técnico',
      action: (row: OrdemServicoListItem) => this.openAssignTechnicianModal(row.id),
    },
    {
      label: 'Abrir',
      action: (row: OrdemServicoListItem) => this.openOrder(row.id),
    },
    {
      label: 'Iniciar execução',
      action: (row: OrdemServicoListItem) => this.startExecution(row.id),
    },
    {
      label: 'Fechar',
      action: (row: OrdemServicoListItem) => this.openCloseModal(row.id),
    },
    {
      label: 'Cancelar',
      action: (row: OrdemServicoListItem) => this.cancelOrder(row.id),
    },
    {
      label: 'Evidências',
      action: (row: OrdemServicoListItem) => this.openEvidencesModal(row.id),
    },
  ];

  readonly columns: PoTableColumn[] = [
    { property: 'code', label: 'Código' },
    { property: 'client', label: 'Cliente' },
    { property: 'technicianName', label: 'Técnico' },
    { property: 'status', label: 'Status' },
    { property: 'executionResult', label: 'Resultado' },
    { property: 'city', label: 'Cidade' },
    { property: 'state', label: 'Estado' },
  ];

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
          this.poNotification.success('Ordem criada com sucesso.');
          this.createModal.close();
          this.loadOrders();
        },
        error: () => {
          this.poNotification.error('Não foi possível criar a ordem.');
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
            client: order.client,
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
        error: () => {
          this.poNotification.error('Não foi possível carregar a ordem.');
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
          this.poNotification.success('Ordem atualizada com sucesso.');
          this.editModal.close();
          this.loadOrders();
        },
        error: () => {
          this.poNotification.error('Não foi possível atualizar a ordem.');
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
        error: () => {
          this.poNotification.error('Não foi possível carregar os detalhes.');
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
          this.poNotification.success('Técnico atribuído com sucesso.');
          this.assignTechnicianModal.close();
          this.loadOrders();
        },
        error: () => {
          this.poNotification.error('Não foi possível atribuir o técnico.');
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
          this.poNotification.success('Ordem aberta com sucesso.');
          this.loadOrders();
        },
        error: () => {
          this.poNotification.error('Não foi possível abrir a ordem.');
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
          this.poNotification.success('Execução iniciada com sucesso.');
          this.loadOrders();
        },
        error: () => {
          this.poNotification.error('Não foi possível iniciar a execução.');
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
          this.poNotification.success('Ordem fechada com sucesso.');
          this.closeModal.close();
          this.loadOrders();
        },
        error: () => {
          this.poNotification.error('Não foi possível fechar a ordem.');
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
          this.poNotification.success('Ordem cancelada com sucesso.');
          this.loadOrders();
        },
        error: () => {
          this.poNotification.error('Não foi possível cancelar a ordem.');
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
          this.poNotification.success('Evidências enviadas com sucesso.');
          this.evidencesModal.close();
        },
        error: () => {
          this.poNotification.error('Não foi possível enviar as evidências.');
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
      error: () => {
        this.poNotification.error('Não foi possível baixar a evidência.');
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
        error: () => {
          this.poNotification.error('Não foi possível carregar as ordens.');
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
      error: () => {
        this.poNotification.warning('Não foi possível carregar os técnicos.');
      },
    });
  }

  private mapOrderToListItem(order: OrderResponse): OrdemServicoListItem {
    return {
      id: order.id,
      code: order.code,
      client: order.client,
      technicianName: order.technician?.name ?? '-',
      status: order.status,
      executionResult: order.executionResult ?? '-',
      city: order.address.city,
      state: order.address.state,
    };
  }

  private createEmptyOrderForm(): CreateOrderRequest {
    return {
      client: '',
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
