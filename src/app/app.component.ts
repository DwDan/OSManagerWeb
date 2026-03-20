import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet />',
  imports: [RouterOutlet],
  standalone: true,
})
export class AppComponent implements OnInit {
  public service = inject(AuthenticationService);
  public router = inject(Router);

  ngOnInit(): void {
    if (!this.service.isLoggedIn()) {
      this.router.navigate(['login']);
    } else {
      this.router.navigate(['home']);
    }
  }
}
