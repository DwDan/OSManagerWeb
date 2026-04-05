import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl } from '@angular/forms';
import { map, startWith } from 'rxjs';

export function formInvalidSignal(control: AbstractControl) {
  return toSignal(
    control.statusChanges.pipe(
      startWith(control.status),
      map(() => control.invalid),
    ),
    { initialValue: control.invalid },
  );
}
