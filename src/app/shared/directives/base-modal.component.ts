import { Directive, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { PoModalComponent } from '@po-ui/ng-components';

@Directive()
export abstract class BaseModalComponent<TData = unknown, TResult = unknown> {
  @ViewChild('modal', { static: true }) modalRef!: PoModalComponent;

  @Input() data?: TData;

  @Output() done = new EventEmitter<TResult>();
  @Output() closed = new EventEmitter<void>();

  open(): void {
    this.modalRef?.open();
  }

  close(): void {
    this.closed.emit();
  }

  submit(result: TResult): void {
    this.done.emit(result);
    this.modalRef?.close();
  }
}
