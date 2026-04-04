import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  computed,
  forwardRef,
  inject,
  signal,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CityResponse } from '@models/locations/response/city.response';
import { PoFieldModule, PoSelectOption } from '@po-ui/ng-components';
import { LocationsService } from '@services/locations/locations.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-city-select',
  standalone: true,
  imports: [CommonModule, FormsModule, PoFieldModule],
  templateUrl: './city-select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CitySelectComponent),
      multi: true,
    },
  ],
})
export class CitySelectComponent implements ControlValueAccessor, OnChanges {
  private readonly locationsService = inject(LocationsService);

  @Input() state = '';
  @Input() label = '';

  readonly loading = signal(false);
  readonly cities = signal<CityResponse[]>([]);

  readonly options = computed<PoSelectOption[]>(() =>
    this.cities().map((city) => ({
      label: city.name,
      value: city.name,
    })),
  );

  value = '';
  disabled = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['state']) {
      return;
    }

    const currentState = (changes['state'].currentValue ?? '').trim();

    if (!currentState) {
      this.cities.set([]);
      return;
    }

    this.loadCities(currentState);
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

  private loadCities(state: string): void {
    this.loading.set(true);

    this.locationsService
      .getCitiesByState(state)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (cities) => {
          this.cities.set(cities);
        },
      });
  }
}
