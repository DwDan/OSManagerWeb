import { Routes } from '@angular/router';
import { authGuard } from '@core/authentication-guard';
import { menuPermissionGuard } from '@core/menu-permission-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./components/auth/login/login.component').then((m) => m.LoginComponent),
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
        canMatch: [menuPermissionGuard],
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./components/users/users.component').then((m) => m.UsersComponent),
        canMatch: [menuPermissionGuard],
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./components/orders/orders.component').then((m) => m.OrdersComponent),
        canMatch: [menuPermissionGuard],
      },
      {
        path: 'customers',
        loadComponent: () =>
          import('./components/customers/customers.component').then((m) => m.CustomersComponent),
        canMatch: [menuPermissionGuard],
      },
      {
        path: 'services',
        loadComponent: () =>
          import('./components/services/services.component').then((m) => m.ServicesComponent),
        canMatch: [menuPermissionGuard],
      },
      {
        path: 'change-password',
        loadComponent: () =>
          import('./components/auth/change-password/change-password.component').then(
            (m) => m.ChangePasswordComponent,
          ),
      },
      {
        path: 'unauthorized',
        loadComponent: () =>
          import('./components/unauthorized/unauthorized.component').then(
            (m) => m.UnauthorizedComponent,
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
