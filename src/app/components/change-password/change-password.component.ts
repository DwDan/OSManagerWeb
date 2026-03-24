import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PoButtonModule,
  PoFieldModule,
  PoNotificationService,
  PoPageModule,
} from '@po-ui/ng-components';
import { finalize } from 'rxjs';
import { AuthenticationService } from '../../services/authentication/authentication.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [PoPageModule, PoFieldModule, PoButtonModule, FormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent {
  private authenticationService = inject(AuthenticationService);
  private notificationService = inject(PoNotificationService);

  loading = signal(false);

  form = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  save(): void {
    if (
      !this.form.currentPassword.trim() ||
      !this.form.newPassword.trim() ||
      !this.form.confirmPassword.trim()
    ) {
      this.notificationService.warning('Preencha todos os campos.');
      return;
    }

    if (this.form.newPassword !== this.form.confirmPassword) {
      this.notificationService.warning('A confirmação da nova senha não confere.');
      return;
    }

    if (this.form.currentPassword === this.form.newPassword) {
      this.notificationService.warning('A nova senha deve ser diferente da senha atual.');
      return;
    }

    this.loading.set(true);

    this.authenticationService
      .changePassword({
        currentPassword: this.form.currentPassword,
        newPassword: this.form.newPassword,
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.notificationService.success('Senha alterada com sucesso.');

          this.form = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          };
        },
        error: (error) => {
          const message =
            error?.error?.message || error?.error?.detail || 'Não foi possível alterar a senha.';

          this.notificationService.error(message);
        },
      });
  }
}
