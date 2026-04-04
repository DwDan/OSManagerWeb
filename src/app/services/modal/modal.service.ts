import {
  ApplicationRef,
  ComponentRef,
  EnvironmentInjector,
  Injectable,
  Type,
  createComponent,
} from '@angular/core';
import { BaseModalComponent } from '@directives/base-modal.component';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(
    private readonly appRef: ApplicationRef,
    private readonly environmentInjector: EnvironmentInjector,
  ) {}

  open<TData, TResult>(
    componentType: Type<BaseModalComponent<TData, TResult>>,
    data?: TData,
  ): Observable<TResult | null> {
    const componentRef: ComponentRef<BaseModalComponent<TData, TResult>> = createComponent(
      componentType,
      {
        environmentInjector: this.environmentInjector,
      },
    );

    const resultSubject = new ReplaySubject<TResult | null>(1);
    const hostElement = componentRef.location.nativeElement as HTMLElement;

    componentRef.instance.data = data;

    componentRef.instance.done.subscribe((result: TResult) => {
      resultSubject.next(result);
      resultSubject.complete();
      this.destroy(componentRef, hostElement);
    });

    componentRef.instance.closed.subscribe(() => {
      resultSubject.next(null);
      resultSubject.complete();
      this.destroy(componentRef, hostElement);
    });

    this.appRef.attachView(componentRef.hostView);
    document.body.appendChild(hostElement);

    componentRef.changeDetectorRef.detectChanges();

    queueMicrotask(() => {
      componentRef.instance.open();
    });

    return resultSubject.asObservable();
  }

  private destroy(componentRef: ComponentRef<unknown>, hostElement: HTMLElement): void {
    this.appRef.detachView(componentRef.hostView);

    if (hostElement.parentNode) {
      hostElement.parentNode.removeChild(hostElement);
    }

    componentRef.destroy();
  }
}
