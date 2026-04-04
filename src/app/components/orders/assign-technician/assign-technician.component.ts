import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BaseModalComponent } from '@directives/base-modal.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { ordersLiterals } from '@i18n/orders/orders.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { AssignOrderTechnicianRequest } from '@models/orders/requests/assign-order-technician.request';
import { UserResponse } from '@models/users/responses/user.response';
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
import { UsersService } from '@services/users/users.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-assign-technician',
  imports: [
    CommonModule,
    FormsModule,
    PoTableModule,
    PoPageModule,
    PoModalModule,
    PoFieldModule,
    PoButtonModule,
  ],
  templateUrl: './assign-technician.component.html',
  styleUrl: './assign-technician.component.scss',
})
export class AssignTechnicianComponent extends BaseModalComponent<
  { orderId: string },
  { confirmed: boolean }
> {
  private readonly ordersService = inject(OrdersService);
  private readonly poNotification = inject(PoNotificationService);
  private readonly usersService = inject(UsersService);

  readonly literals = injectI18n(ordersLiterals);
  readonly common = injectI18n(commonLiterals);
  readonly loading = signal(false);
  readonly technicians = signal<PoSelectOption[]>([]);

  readonly closeAction = {
    label: this.common().cancel,
    action: () => this.close(),
  };

  assignTechnicianForm: AssignOrderTechnicianRequest = {
    technicianId: '',
  };

  readonly executionResultOptions = computed<PoSelectOption[]>(() => [
    { label: this.literals().executionResult.success, value: 1 },
    { label: this.literals().executionResult.failure, value: 2 },
  ]);

  saveAssignTechnician(): void {
    if (!this.assignTechnicianForm.technicianId) {
      return;
    }

    this.loading.set(true);

    this.ordersService
      .assignTechnician(this.data!.orderId, this.assignTechnicianForm)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.poNotification.success(this.literals().notifications.assignedTechnician);
          this.submit({ confirmed: true });
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
}
