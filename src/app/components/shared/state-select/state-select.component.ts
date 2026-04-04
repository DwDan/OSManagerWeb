import { CommonModule } from '@angular/common';
import { Component, computed, forwardRef, inject, Input, OnInit, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { StateResponse } from '@models/locations/response/state.response';
import { PoFieldModule, PoSelectOption } from '@po-ui/ng-components';
import { LocationsService } from '@services/locations/locations.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-state-select',
  standalone: true,
  imports: [CommonModule, FormsModule, PoFieldModule],
  templateUrl: './state-select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StateSelectComponent),
      multi: true,
    },
  ],
})
export class StateSelectComponent implements ControlValueAccessor, OnInit {
  private readonly locationsService = inject(LocationsService);

  @Input() label = '';

  readonly loading = signal(false);
  readonly states = signal<StateResponse[]>([]);

  readonly options = computed<PoSelectOption[]>(() =>
    this.states().map((state) => ({
      label: `${state.acronym} - ${state.name}`,
      value: state.acronym,
    })),
  );

  value = '';
  disabled = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    this.loadStates();
  }

  writeValue(value: string | null): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  handleChange(value: string): void {
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }

  private loadStates(): void {
    this.loading.set(true);

    this.locationsService
      .getStates()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (states) => {
          this.states.set(states);
        },
      });
  }
}
