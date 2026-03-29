import { Routes } from '@angular/router';
import { authGuard } from '@core/authentication-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./components/auth/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./components/auth/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent,
      ),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./components/home/home.component').then((m) => m.HomeComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./components/users/users.component').then((m) => m.UsersComponent),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./components/orders/orders.component').then((m) => m.OrdersComponent),
      },
      {
        path: 'change-password',
        loadComponent: () =>
          import('./components/auth/change-password/change-password.component').then(
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
