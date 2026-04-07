import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild, computed, inject, input, output } from '@angular/core';
import {
  PoAccordionModule,
  PoButtonModule,
  PoModalComponent,
  PoModalModule,
  PoPageModule,
  PoPageSlideComponent,
  PoPageSlideModule,
} from '@po-ui/ng-components';
import { DevicesService } from '@services/devices/devices.service';

@Component({
  selector: 'app-filter-container',
  templateUrl: './filter-container.component.html',
  styleUrl: './filter-container.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    PoButtonModule,
    PoAccordionModule,
    PoPageModule,
    PoPageSlideModule,
    PoModalModule,
  ],
})
export class FilterContainerComponent {
  private readonly devicesService = inject(DevicesService);

  @ViewChild('slideFilters', { static: false }) slideFilters!: PoPageSlideComponent;
  @ViewChild('modalFilters', { static: false }) modalFilters!: PoModalComponent;

  readonly title = input.required<string>();
  readonly clearLabel = input.required<string>();
  readonly filterLabel = input.required<string>();
  readonly contentTemplate = input.required<TemplateRef<unknown>>();

  readonly clear = output<void>();
  readonly filter = output<void>();
  readonly slide = input<boolean>();

  readonly isMobile = computed<boolean>(() => this.devicesService.isMobile());

  openMobileFilters(): void {
    if (this.devicesService.isMobile()) {
      if (this.slide()) {
        this.slideFilters.open();
      } else {
        this.modalFilters.open();
      }
    }
  }

  onClear(): void {
    this.clear.emit();
  }

  onFilter(): void {
    this.filter.emit();

    if (this.devicesService.isMobile()) {
      if (this.slide()) {
        this.slideFilters.close();
      } else {
        this.modalFilters.close();
      }
    }
  }
}
