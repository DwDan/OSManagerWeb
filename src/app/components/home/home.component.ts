import { Component, OnInit, computed, inject, signal } from '@angular/core';
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
  private readonly menuService = inject(MenuService);

  readonly literals = injectI18n(homeLiterals);

  userName: string = this.literals().loading;

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

  readonly menus = signal<PoMenuItem[]>([]);

  ngOnInit(): void {
    this.menus.set(this.menuService.getMenus());
    this.carregarUsuarioLogado();
  }

  private carregarUsuarioLogado(): void {
    const userId = sessionStorage.getItem('userId');

    if (!userId) {
      this.userName = this.literals().defaultUser;

      this.profile = {
        title: this.literals().defaultUser,
      };

      return;
    }

    this.usersService.getById(userId).subscribe({
      next: (user) => {
        this.userName = `${user.firstName} ${user.lastName}`;

        this.profile = {
          title: this.userName,
          subtitle: user.email,
        };
      },
      error: () => {
        this.userName = this.literals().defaultUser;

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
    this.menuService.clear();
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
