import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { commonLiterals } from '@i18n/common/common.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { usersLiterals } from '@i18n/users/users.literals';
import { UserResponse } from '@models/users/responses/user.response';
import {
  PoInfoModule,
  PoListViewModule,
  PoTableAction,
  PoTableColumn,
  PoTableColumnSpacing,
  PoTableModule,
  PoTagModule,
  PoWidgetModule,
} from '@po-ui/ng-components';
import { DevicesService } from '@services/devices/devices.service';

type UserTagViewModel = {
  label: string;
  color?: string;
  icon?: string;
};

@Component({
  selector: 'app-user-list-view',
  standalone: true,
  imports: [
    CommonModule,
    PoTableModule,
    PoListViewModule,
    PoInfoModule,
    PoWidgetModule,
    PoTagModule,
  ],
  templateUrl: './user-list-view.component.html',
  styleUrl: './user-list-view.component.scss',
})
export class UserListViewComponent {
  private readonly devicesService = inject(DevicesService);

  readonly literals = injectI18n(usersLiterals);
  readonly common = injectI18n(commonLiterals);

  readonly items = input<UserResponse[]>([]);
  readonly loading = input<boolean>(false);
  readonly columns = input<PoTableColumn[]>([]);
  readonly actions = input<PoTableAction[]>([]);

  readonly spacing = PoTableColumnSpacing;

  readonly isMobile = computed(() => this.devicesService.isMobile());

  getVisibleActions(item: UserResponse): PoTableAction[] {
    return this.actions().filter((action) => {
      if (action.visible == null) {
        return true;
      }

      if (typeof action.visible === 'function') {
        return action.visible(item);
      }

      return action.visible;
    });
  }

  executeAction(action: PoTableAction, item: UserResponse): void {
    if (!action.action) {
      return;
    }

    action.action(item);
  }

  getRoleTag(role: string): UserTagViewModel {
    const column = this.columns().find((item) => item.property === 'role');

    if (!column || column.type !== 'label' || !column.labels) {
      return {
        label: String(role),
      };
    }

    const tag = column.labels.find((item) => item.value === role);

    return {
      label: String(tag?.label ?? role),
      color: tag?.color,
      icon: typeof tag?.icon === 'string' ? tag.icon : undefined,
    };
  }

  getBooleanTag(value: boolean): UserTagViewModel {
    return value
      ? {
          label: this.common().yes,
          color: 'color-12',
          icon: 'an an-check',
        }
      : {
          label: this.common().no,
          color: 'color-07',
          icon: 'an an-x',
        };
  }

  getRoleLabel(role: string): string {
    return this.getRoleTag(role).label;
  }

  getBooleanLabel(value: boolean): string {
    return this.getBooleanTag(value).label;
  }
}
