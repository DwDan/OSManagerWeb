import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PoButtonModule } from '@po-ui/ng-components';
import { DevicesService } from '@services/devices/devices.service';

export interface AppPageAction {
  label: string;
  icon?: string;
  action?: () => void;
  disabled?: boolean;
  visible?: boolean;
  url?: string;
  target?: '_self' | '_blank' | '_parent' | '_top' | string;
  kind?: 'primary' | 'secondary' | 'tertiary';
}

export interface AppPageBreadcrumbItem {
  label: string;
  link?: string;
}

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [CommonModule, RouterModule, PoButtonModule],
  templateUrl: './page.component.html',
  styleUrl: './page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageComponent {
  private readonly devicesService = inject(DevicesService);

  readonly title = input<string>('', { alias: 'p-title' });
  readonly subtitle = input<string>('', { alias: 'p-subtitle' });
  readonly actions = input<AppPageAction[]>([], { alias: 'p-actions' });
  readonly breadcrumb = input<AppPageBreadcrumbItem[]>([], { alias: 'p-breadcrumb' });

  readonly renderedActions = computed(() => {
    const actions = this.actions().filter((action) => action.visible !== false);

    if (!this.devicesService.isMobile()) {
      return actions;
    }

    return actions.map((action) => ({
      ...action,
      label: action.icon ? '' : action.label,
    }));
  });

  executeAction(action: AppPageAction): void {
    if (action.disabled) {
      return;
    }

    action.action?.();
  }

  trackByAction(index: number, action: AppPageAction): string {
    return `${index}-${action.label}-${action.icon ?? ''}`;
  }
}
