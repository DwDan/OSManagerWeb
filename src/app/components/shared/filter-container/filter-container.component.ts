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
  PoModalComponent,
  PoModalModule,
  PoPageModule,
  PoPageSlideComponent,
  PoPageSlideModule,
} from '@po-ui/ng-components';

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
export class FilterContainerComponent implements OnInit {
  private readonly breakpointObserver = inject(BreakpointObserver);

  @ViewChild('slideFilters', { static: false }) slideFilters!: PoPageSlideComponent;
  @ViewChild('modalFilters', { static: false }) modalFilters!: PoModalComponent;

  readonly title = input.required<string>();
  readonly clearLabel = input.required<string>();
  readonly filterLabel = input.required<string>();
  readonly contentTemplate = input.required<TemplateRef<unknown>>();

  readonly clear = output<void>();
  readonly filter = output<void>();
  readonly slide = input<boolean>();

  readonly isMobile = signal(false);

  ngOnInit(): void {
    this.breakpointObserver.observe('(max-width: 768px)').subscribe((result) => {
      this.isMobile.set(result.matches);
    });
  }

  openMobileFilters(): void {
    if (this.isMobile()) {
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

    if (this.isMobile()) {
      if (this.slide()) {
        this.slideFilters.close();
      } else {
        this.modalFilters.close();
      }
    }
  }
}
