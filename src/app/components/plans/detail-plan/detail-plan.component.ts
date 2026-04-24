import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { BaseModalComponent } from '@directives/base-modal.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { plansLiterals } from '@i18n/plans/plans.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { PlanListItemResponse } from '@models/plans/responses/plan-list-item.response';
import { PoModalAction, PoModalModule, PoTagModule } from '@po-ui/ng-components';
import { PlansService } from '@services/plans/plans.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-detail-plan',
  templateUrl: './detail-plan.component.html',
  styleUrls: ['./detail-plan.component.scss'],
  standalone: true,
  imports: [CommonModule, PoModalModule, PoTagModule],
  providers: [CurrencyPipe],
})
export class DetailPlanComponent extends BaseModalComponent<{ planId: string }, void> {
  private readonly plansService = inject(PlansService);
  private readonly currencyPipe = inject(CurrencyPipe);

  readonly literals = injectI18n(plansLiterals);
  readonly common = injectI18n(commonLiterals);
  readonly loading = signal(false);
  readonly plan = signal<PlanListItemResponse | null>(null);

  readonly primaryAction = computed<PoModalAction>(() => ({
    label: this.common().close,
    action: this.close.bind(this),
  }));

  ngOnInit(): void {
    this.loadPlan();
  }

  formatCurrency(value: number): string {
    return (
      this.currencyPipe.transform(value, 'BRL', 'symbol', '1.2-2') || this.common().notInformed
    );
  }

  private loadPlan(): void {
    this.loading.set(true);

    this.plansService
      .getAllPlans()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (plans) => {
          this.plan.set(plans.find((item) => item.id === this.data!.planId) || null);
        },
      });
  }
}
