import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { commonLiterals } from '@i18n/common/common.literals';
import { plansLiterals } from '@i18n/plans/plans.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { PlanListItemResponse } from '@models/plans/responses/plan-list-item.response';
import {
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
import { PlansService } from '@services/plans/plans.service';
import { finalize } from 'rxjs';
import { CreatePlanComponent } from './create-plan/create-plan.component';
import { DetailPlanComponent } from './detail-plan/detail-plan.component';
import { PlanListViewComponent } from './plan-list-view/plan-list-view.component';
import { UpdatePlanComponent } from './update-plan/update-plan.component';

@Component({
  selector: 'app-plans',
  imports: [CommonModule, PoTableModule, PoPageModule, PlanListViewComponent],
  templateUrl: './plans.component.html',
  styleUrl: './plans.component.scss',
})
export class PlansComponent implements OnInit {
  private readonly plansService = inject(PlansService);
  private readonly modalService = inject(ModalService);
  private readonly poNotification = inject(PoNotificationService);
  readonly devicesService = inject(DevicesService);

  readonly literals = injectI18n(plansLiterals);
  readonly common = injectI18n(commonLiterals);

  readonly spacing = PoTableColumnSpacing;
  readonly loading = signal(false);
  readonly items = signal<PlanListItemResponse[]>([]);

  readonly pageActions = computed<PoPageAction[]>(() => [
    {
      label: this.literals().pageActions.newPlan,
      icon: 'an an-plus',
      type: 'primary',
      action: () => this.openCreateModal(),
      disabled: this.loading(),
    },
  ]);

  readonly tableActions = computed<PoTableAction[]>(() => [
    {
      label: this.literals().tableActions.details,
      action: (row: PlanListItemResponse) => this.openDetails(row.id),
    },
    {
      label: this.literals().tableActions.edit,
      action: (row: PlanListItemResponse) => this.openEditModal(row.id),
    },
    {
      label: this.literals().tableActions.activate,
      action: (row: PlanListItemResponse) => this.activate(row.id),
      visible: (row: PlanListItemResponse) => !row.isActive,
    },
    {
      label: this.literals().tableActions.deactivate,
      action: (row: PlanListItemResponse) => this.deactivate(row.id),
      visible: (row: PlanListItemResponse) => row.isActive,
    },
  ]);

  readonly columns = computed<PoTableColumn[]>(() => [
    {
      property: 'name',
      label: this.literals().columns.name,
    },
    {
      property: 'code',
      label: this.literals().columns.code,
    },
    {
      property: 'price',
      label: this.literals().columns.price,
      type: 'columnTemplate',
    },
    {
      property: 'maxAdminUsers',
      label: this.literals().columns.maxAdminUsers,
    },
    {
      property: 'maxOrdersPerMonth',
      label: this.literals().columns.maxOrdersPerMonth,
    },
    {
      property: 'isPublic',
      label: this.literals().columns.isPublic,
      type: 'boolean',
      boolean: {
        trueLabel: this.common().yes,
        falseLabel: this.common().no,
      },
    },
    {
      property: 'isActive',
      label: this.literals().columns.isActive,
      type: 'boolean',
      boolean: {
        trueLabel: this.common().yes,
        falseLabel: this.common().no,
      },
    },
  ]);

  ngOnInit(): void {
    this.loadData();
  }

  openCreateModal(): void {
    this.modalService.open(CreatePlanComponent).subscribe((result) => {
      if (result?.confirmed) {
        this.loadData();
      }
    });
  }

  openEditModal(id: string): void {
    this.modalService.open(UpdatePlanComponent, { planId: id }).subscribe((result) => {
      if (result?.confirmed) {
        this.loadData();
      }
    });
  }

  openDetails(id: string): void {
    this.modalService.open(DetailPlanComponent, { planId: id }).subscribe();
  }

  activate(id: string): void {
    this.loading.set(true);

    this.plansService
      .activate(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.poNotification.success(this.literals().notifications.activated);
          this.loadData();
        },
      });
  }

  deactivate(id: string): void {
    this.loading.set(true);

    this.plansService
      .deactivate(id)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.poNotification.success(this.literals().notifications.deactivated);
          this.loadData();
        },
      });
  }

  private loadData(): void {
    this.loading.set(true);

    this.plansService
      .getAllPlans()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (plans) => {
          this.items.set(plans);
        },
      });
  }
}
