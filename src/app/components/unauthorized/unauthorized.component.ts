import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { injectI18n } from '@i18n/shared/inject-i18n';
import { unauthorizedLiterals } from '@i18n/unauthorized/unauthorized.literals';
import { PoButtonModule, PoPageModule, PoWidgetModule } from '@po-ui/ng-components';

@Component({
  selector: 'app-unauthorized',
  imports: [CommonModule, PoPageModule, PoWidgetModule, PoButtonModule],
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.scss',
})
export class UnauthorizedComponent {
  private readonly router = inject(Router);

  readonly literals = injectI18n(unauthorizedLiterals);

  readonly actions = computed(() => ({
    primary: this.literals().primaryAction,
  }));

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
