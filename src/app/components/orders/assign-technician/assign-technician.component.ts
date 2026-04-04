import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseModalComponent } from '@directives/base-modal.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { ordersLiterals } from '@i18n/orders/orders.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { AssignOrderTechnicianRequest } from '@models/orders/requests/assign-order-technician.request';
import { UserResponse } from '@models/users/responses/user.response';
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
import { UsersService } from '@services/users/users.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-assign-technician',
  imports: [
    CommonModule,
    ReactiveFormsModule,
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
  private readonly formBuilder = inject(FormBuilder);

  readonly literals = injectI18n(ordersLiterals);
  readonly common = injectI18n(commonLiterals);
  readonly loading = signal(false);
  readonly technicians = signal<PoSelectOption[]>([]);

  readonly primaryAction = computed<PoModalAction>(() => ({
    label: this.common().save,
    action: this.save.bind(this),
    disabled: this.loading() || this.form.invalid,
  }));

  readonly secondaryAction = computed<PoModalAction>(() => ({
    label: this.common().cancel,
    action: this.close.bind(this),
  }));

  readonly form = this.formBuilder.nonNullable.group({
    technicianId: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.form.reset({
      technicianId: '',
    });
    this.loadTechnicians();
  }

  save(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    const request: AssignOrderTechnicianRequest = {
      technicianId: this.form.controls.technicianId.getRawValue(),
    };

    this.loading.set(true);

    this.ordersService
      .assignTechnician(this.data!.orderId, request)
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
