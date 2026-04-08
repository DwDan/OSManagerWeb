import { CommonModule } from '@angular/common';
import { Component, Input, computed, inject } from '@angular/core';
import { PoButtonModule, PoPageAction } from '@po-ui/ng-components';
import { DevicesService } from '@services/devices/devices.service';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, PoButtonModule],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
})
export class PageHeaderComponent {
  @Input({ required: true }) title!: string;
  @Input() actions: PoPageAction[] = [];

  readonly deviceService = inject(DevicesService);

  readonly resolvedActions = computed(() =>
    this.actions.map((action) => ({
      ...action,
      label: this.deviceService.isMobile() ? '' : action.label,
      disabled:
        typeof action.disabled === 'function' ? action.disabled() : (action.disabled ?? false),
    })),
  );
}
