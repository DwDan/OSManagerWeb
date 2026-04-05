import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import {
  PoAccordionModule,
  PoButtonModule,
  PoPageModule,
  PoPageSlideComponent,
  PoPageSlideModule,
} from '@po-ui/ng-components';

@Component({
  selector: 'app-filter-container',
  templateUrl: './filter-container.component.html',
  styleUrl: './filter-container.component.scss',
  standalone: true,
  imports: [CommonModule, PoButtonModule, PoAccordionModule, PoPageModule, PoPageSlideModule],
})
export class FilterContainerComponent implements OnInit {
  private readonly breakpointObserver = inject(BreakpointObserver);

  @ViewChild('mobileFilters', { static: false }) mobileFilters!: PoPageSlideComponent;

  readonly title = input.required<string>();
  readonly clearLabel = input.required<string>();
  readonly filterLabel = input.required<string>();
  readonly contentTemplate = input.required<TemplateRef<unknown>>();

  readonly clear = output<void>();
  readonly filter = output<void>();

  readonly isMobile = signal(false);

  ngOnInit(): void {
    this.breakpointObserver.observe('(max-width: 768px)').subscribe((result) => {
      this.isMobile.set(result.matches);
    });
  }

  openMobileFilters(): void {
    if (this.isMobile()) {
      this.mobileFilters.open();
    }
  }

  onClear(): void {
    this.clear.emit();
  }

  onFilter(): void {
    this.filter.emit();

    if (this.isMobile()) {
      this.mobileFilters.close();
    }
  }
}
