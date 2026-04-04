import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { BaseModalComponent } from '@directives/base-modal.component';
import { commonLiterals } from '@i18n/common/common.literals';
import { servicesLiterals } from '@i18n/services/services.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { ServiceDetailsResponse } from '@models/services/responses/service-details.response';
import { PoModalAction, PoModalModule } from '@po-ui/ng-components';
import { ServicesService } from '@services/services/services.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-detail-service',
  templateUrl: './detail-service.component.html',
  styleUrls: ['./detail-service.component.scss'],
  standalone: true,
  imports: [CommonModule, PoModalModule],
})
export class DetailServiceComponent
  extends BaseModalComponent<{ serviceId: string }, void>
  implements OnInit
{
  private readonly servicesService = inject(ServicesService);

  readonly literals = injectI18n(servicesLiterals);
  readonly common = injectI18n(commonLiterals);

  readonly loading = signal(false);
  readonly service = signal<ServiceDetailsResponse | null>(null);

  readonly primaryAction = computed<PoModalAction>(() => ({
    label: this.common().close,
    action: this.close.bind(this),
  }));

  ngOnInit(): void {
    this.loadService();
  }

  private loadService(): void {
    this.loading.set(true);

    this.servicesService
      .getById(this.data!.serviceId)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (service) => {
          this.service.set(service);
        },
      });
  }
}
