import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import {
  PoMenuItem,
  PoMenuModule,
  PoPageModule,
  PoToolbarAction,
  PoToolbarModule,
  PoToolbarProfile,
} from '@po-ui/ng-components';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { MenuService } from '../services/menu/menu.service';
import { UsersService } from '../services/users/users.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PoToolbarModule, PoPageModule, PoMenuModule, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly usersService = inject(UsersService);
  private readonly authenticationService = inject(AuthenticationService);

  public readonly menuFilterService = inject(MenuService);

  nomeSistema = 'DWS: OSManager';
  nomeUsuario = 'Carregando...';

  profile: PoToolbarProfile = {
    title: 'Carregando...',
  };

  profileActions: PoToolbarAction[] = [
    {
      label: 'Alterar Senha',
      icon: 'po-icon-lock',
      action: () => this.changePassword(),
    },
    {
      label: 'Sair',
      icon: 'po-icon-exit',
      action: () => this.logout(),
    },
  ];

  menus: PoMenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'an an-house',
      shortLabel: 'Dashboard',
      link: '/dashboard',
    },
    {
      label: 'Gerenciar Usuários',
      icon: 'an an-user',
      shortLabel: 'Usuários',
      link: '/users',
    },
    {
      label: 'Ordens de Serviço',
      icon: 'an an-clock',
      shortLabel: 'Ordens',
      link: '/orders',
    },
  ];

  ngOnInit(): void {
    this.menuFilterService.setMenus(this.menus);
    this.carregarUsuarioLogado();
  }

  private carregarUsuarioLogado(): void {
    const userId = sessionStorage.getItem('userId');

    if (!userId) {
      this.nomeUsuario = 'Usuário';

      this.profile = {
        title: 'Usuário',
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
        this.nomeUsuario = 'Usuário';

        this.profile = {
          title: 'Usuário',
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

  private normalizarUrl(url: string): string {
    if (!url) {
      return '/dashboard';
    }

    const urlSemQuery = url.split('?')[0].split('#')[0];

    if (urlSemQuery === '/' || urlSemQuery === '') {
      return '/dashboard';
    }

    return urlSemQuery.endsWith('/') && urlSemQuery !== '/'
      ? urlSemQuery.slice(0, -1)
      : urlSemQuery;
  }
}
