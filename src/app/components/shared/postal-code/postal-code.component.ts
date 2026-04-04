import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, forwardRef, inject, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PostalCodeAddress } from '@models/locations/response/postal-code-address.response';
import { PoFieldModule } from '@po-ui/ng-components';
import { PostalCodeService } from '@services/locations/postal-code.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-postal-code',
  templateUrl: './postal-code.component.html',
  styleUrls: ['./postal-code.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, PoFieldModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PostalCodeComponent),
      multi: true,
    },
  ],
})
export class PostalCodeComponent implements ControlValueAccessor {
  private readonly postalCodeService = inject(PostalCodeService);

  @Input() label = 'Postal Code';

  @Output() addressFound = new EventEmitter<PostalCodeAddress>();
  @Output() addressNotFound = new EventEmitter<void>();

  readonly loading = signal(false);

  value = '';
  disabled = false;

  get disabledStr() {
    return String(this.disabled);
  }

  private lastSearchedPostalCode = '';

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

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
  }

  handleBlur(): void {
    this.onTouched();

    const normalizedPostalCode = this.postalCodeService.normalize(this.value);

    if (normalizedPostalCode.length !== 8) {
      return;
    }

    if (normalizedPostalCode === this.lastSearchedPostalCode) {
      return;
    }

    this.lastSearchedPostalCode = normalizedPostalCode;
    this.searchPostalCode(normalizedPostalCode);
  }

  private searchPostalCode(postalCode: string): void {
    this.loading.set(true);

    this.postalCodeService
      .getAddressByPostalCode(postalCode)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (address) => {
          if (!address) {
            this.addressNotFound.emit();
            return;
          }

          this.value = address.postalCode;
          this.onChange(address.postalCode);
          this.addressFound.emit(address);
        },
        error: () => {
          this.addressNotFound.emit();
        },
      });
  }
}
