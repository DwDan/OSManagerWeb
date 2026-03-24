import { Routes } from '@angular/router';
import { authGuard } from './core/authentication-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./components/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent,
      ),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./components/usuarios/usuarios.component').then((m) => m.UsuariosComponent),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./components/ordens-servico/ordens-servico.component').then(
            (m) => m.OrdensServicoComponent,
          ),
      },
      {
        path: 'change-password',
        loadComponent: () =>
          import('./components/change-password/change-password.component').then(
            (m) => m.ChangePasswordComponent,
          ),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'dashboard',
      },
    ],
  },
];
