import { Component, OnInit, computed, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { homeLiterals } from '@i18n/home/home.literals';
import { injectI18n } from '@i18n/shared/inject-i18n';
import {
  PoMenuItem,
  PoMenuModule,
  PoPageModule,
  PoToolbarAction,
  PoToolbarModule,
  PoToolbarProfile,
} from '@po-ui/ng-components';
import { AuthenticationService } from '@services/authentication/authentication.service';
import { MenuService } from '@services/menu/menu.service';
import { UsersService } from '@services/users/users.service';

@Component({
  selector: 'app-home',
  imports: [PoToolbarModule, PoPageModule, PoMenuModule, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly usersService = inject(UsersService);
  private readonly authenticationService = inject(AuthenticationService);

  public readonly menuFilterService = inject(MenuService);
  readonly literals = injectI18n(homeLiterals);

  nomeUsuario: string = this.literals().loading;

  profile: PoToolbarProfile = {
    title: this.literals().loading,
  };

  readonly profileActions = computed<PoToolbarAction[]>(() => [
    {
      label: this.literals().actions.changePassword,
      icon: 'po-icon-lock',
      action: () => this.changePassword(),
    },
    {
      label: this.literals().actions.logout,
      icon: 'po-icon-exit',
      action: () => this.logout(),
    },
  ]);

  readonly menus = computed<PoMenuItem[]>(() => [
    {
      label: this.literals().menu.dashboard,
      icon: 'an an-house',
      shortLabel: this.literals().menu.dashboardShort,
      link: '/dashboard',
    },
    {
      label: this.literals().menu.manageUsers,
      icon: 'an an-user',
      shortLabel: this.literals().menu.usersShort,
      link: '/users',
    },
    {
      label: this.literals().menu.orders,
      icon: 'an an-clock',
      shortLabel: this.literals().menu.ordersShort,
      link: '/orders',
    },
  ]);

  ngOnInit(): void {
    this.menuFilterService.setMenus(this.menus());
    this.carregarUsuarioLogado();
  }

  private carregarUsuarioLogado(): void {
    const userId = sessionStorage.getItem('userId');

    if (!userId) {
      this.nomeUsuario = this.literals().defaultUser;

      this.profile = {
        title: this.literals().defaultUser,
      };

      return;
    }

    this.usersService.getById(userId).subscribe({
      next: (user) => {
        this.nomeUsuario = `${user.firstName} ${user.lastName}`;

        this.profile = {
          title: this.nomeUsuario,
          subtitle: user.email,
        };
      },
      error: () => {
        this.nomeUsuario = this.literals().defaultUser;

        this.profile = {
          title: this.literals().defaultUser,
        };
      },
    });
  }

  private changePassword(): void {
    this.router.navigate(['/change-password']);
  }

  private logout(): void {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
