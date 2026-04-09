import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { paginationLiterals } from '@i18n/pagination/pagination.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';

type PaginationItem = number | 'ellipsis';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  readonly page = input<number>(1);
  readonly pageSize = input<number>(10);
  readonly totalItems = input<number>(0);
  readonly siblingCount = input<number>(1);
  readonly pageSizeOptions = input<number[]>([10, 50, 100, 500, 1000]);

  readonly literals = injectI18n(paginationLiterals);

  readonly pageChange = output<number>();
  readonly pageSizeChange = output<number>();

  readonly normalizedPageSizeOptions = computed(() => {
    const options = this.pageSizeOptions()
      .filter((size) => Number.isInteger(size) && size > 0)
      .sort((first, second) => first - second);

    return [...new Set(options)];
  });

  readonly totalPages = computed(() => {
    const totalItems = this.totalItems();
    const pageSize = this.pageSize();

    if (pageSize <= 0) {
      return 0;
    }

    return Math.ceil(totalItems / pageSize);
  });

  readonly pages = computed<PaginationItem[]>(() => {
    const currentPage = this.page();
    const totalPages = this.totalPages();
    const siblingCount = this.siblingCount();

    if (totalPages <= 0) {
      return [];
    }

    if (totalPages <= 7) {
      return this.range(1, totalPages);
    }

    const firstPage = 1;
    const lastPage = totalPages;
    const leftSibling = Math.max(currentPage - siblingCount, 2);
    const rightSibling = Math.min(currentPage + siblingCount, totalPages - 1);

    const showLeftEllipsis = leftSibling > 2;
    const showRightEllipsis = rightSibling < totalPages - 1;

    const pages: PaginationItem[] = [firstPage];

    if (showLeftEllipsis) {
      pages.push('ellipsis');
    } else {
      pages.push(...this.range(2, leftSibling - 1));
    }

    pages.push(...this.range(leftSibling, rightSibling));

    if (showRightEllipsis) {
      pages.push('ellipsis');
    } else {
      pages.push(...this.range(rightSibling + 1, totalPages - 1));
    }

    pages.push(lastPage);

    return this.removeDuplicateEllipsis(pages);
  });

  readonly canGoPrevious = computed(() => this.page() > 1);
  readonly canGoNext = computed(() => this.page() < this.totalPages());

  readonly startItem = computed(() => {
    if (this.totalItems() === 0) {
      return 0;
    }

    return (this.page() - 1) * this.pageSize() + 1;
  });

  readonly endItem = computed(() => {
    return Math.min(this.page() * this.pageSize(), this.totalItems());
  });

  readonly infoText = computed(() =>
    this.literals()
      .info.replace('{{start}}', String(this.startItem()))
      .replace('{{end}}', String(this.endItem()))
      .replace('{{total}}', String(this.totalItems())),
  );

  goToPage(page: number): void {
    const totalPages = this.totalPages();

    if (page < 1 || page > totalPages || page === this.page()) {
      return;
    }

    this.pageChange.emit(page);
  }

  goToFirstPage(): void {
    this.goToPage(1);
  }

  goToPreviousPage(): void {
    this.goToPage(this.page() - 1);
  }

  goToNextPage(): void {
    this.goToPage(this.page() + 1);
  }

  goToLastPage(): void {
    this.goToPage(this.totalPages());
  }

  onPageSizeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const pageSize = Number(target.value);
    const availableOptions = this.normalizedPageSizeOptions();

    if (!availableOptions.includes(pageSize) || pageSize === this.pageSize()) {
      return;
    }

    this.pageSizeChange.emit(pageSize);
  }

  trackByItem(index: number, item: PaginationItem): string {
    return `${index}-${item}`;
  }

  private range(start: number, end: number): number[] {
    if (start > end) {
      return [];
    }

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }

  private removeDuplicateEllipsis(items: PaginationItem[]): PaginationItem[] {
    const result: PaginationItem[] = [];

    for (const item of items) {
      const lastItem = result[result.length - 1];

      if (item === 'ellipsis' && lastItem === 'ellipsis') {
        continue;
      }

      result.push(item);
    }

    return result;
  }
}
