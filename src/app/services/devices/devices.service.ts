import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DevicesService {
  private readonly isMobileSignal = signal(false);

  readonly isMobile = this.isMobileSignal.asReadonly();

  constructor(private readonly breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe('(max-width: 768px)').subscribe((result) => {
      this.isMobileSignal.set(result.matches);
    });
  }
}
