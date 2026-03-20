import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { LoginModel } from './model/login.model';
import { PoModule, PoButtonModule } from '@po-ui/ng-components';
import { PoPageLogin, PoPageLoginModule } from '@po-ui/ng-templates';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [PoModule, PoButtonModule, ReactiveFormsModule, PoPageLoginModule],
  standalone: true,
})
export class LoginComponent {
  private service = inject(AuthenticationService);
  public router = inject(Router);

  login(event: PoPageLogin) {
    const request = <LoginModel>{
      Email: event.login,
      Password: event.password,
    };

    this.service.login(request).subscribe(() => {
      this.router.navigate(['home']);
    });
  }
}
