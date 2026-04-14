import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, Input, OnDestroy } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { PoDatepickerModule, PoFieldModule } from '@po-ui/ng-components';
import moment from 'moment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-datetime-picker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PoDatepickerModule, PoFieldModule],
  templateUrl: './datetime-picker.component.html',
  styleUrl: './datetime-picker.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatetimePickerComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatetimePickerComponent implements ControlValueAccessor, OnDestroy {
  @Input({ required: true }) label!: string;
  @Input() required = false;
  @Input() placeholderTime = '00:00';

  readonly dateControl = new FormControl<Date | string | null>(null);
  readonly timeControl = new FormControl<string>('', { nonNullable: true });

  disabled = false;

  private onChange: (value: Date | null) => void = () => {};
  private onTouched: () => void = () => {};
  private readonly subscriptions = new Subscription();
  private isWritingValue = false;

  constructor() {
    this.subscriptions.add(
      this.dateControl.valueChanges.subscribe(() => {
        this.updateValue();
      }),
    );

    this.subscriptions.add(
      this.timeControl.valueChanges.subscribe((value) => {
        const normalizedValue = this.normalizeTyping(value);

        if (normalizedValue !== value) {
          this.timeControl.setValue(normalizedValue, { emitEvent: false });
        }

        this.updateValue();
      }),
    );
  }

  get poDisabled(): string {
    return this.disabled ? 'true' : 'false';
  }

  writeValue(value: Date | string | null): void {
    this.isWritingValue = true;

    if (!value) {
      this.dateControl.setValue(null, { emitEvent: false });
      this.timeControl.setValue('', { emitEvent: false });
      this.isWritingValue = false;
      return;
    }

    const parsedValue = moment(value);

    if (!parsedValue.isValid()) {
      this.dateControl.setValue(null, { emitEvent: false });
      this.timeControl.setValue('', { emitEvent: false });
      this.isWritingValue = false;
      return;
    }

    this.dateControl.setValue(parsedValue.toDate(), {
      emitEvent: false,
    });

    this.timeControl.setValue(parsedValue.format('HH:mm'), {
      emitEvent: false,
    });

    this.isWritingValue = false;
  }

  registerOnChange(fn: (value: Date | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;

    if (isDisabled) {
      this.dateControl.disable({ emitEvent: false });
      this.timeControl.disable({ emitEvent: false });
      return;
    }

    this.dateControl.enable({ emitEvent: false });
    this.timeControl.enable({ emitEvent: false });
  }

  onDateBlur(): void {
    this.updateValue();
    this.onTouched();
  }

  onTimeBlur(): void {
    const normalizedValue = this.normalizeTimeOnBlur(this.timeControl.value);

    if (normalizedValue !== this.timeControl.value) {
      this.timeControl.setValue(normalizedValue, { emitEvent: false });
    }

    this.updateValue();
    this.onTouched();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private updateValue(): void {
    if (this.isWritingValue) {
      return;
    }

    const dateValue = this.dateControl.value;
    const timeValue = this.normalizeTimeOnBlur(this.timeControl.value);

    const parsedDate = this.parseDateValue(dateValue);

    if (!parsedDate) {
      this.onChange(null);
      return;
    }

    if (!timeValue) {
      this.onChange(parsedDate.clone().hour(0).minute(0).second(0).millisecond(0).toDate());
      return;
    }

    const parsedTime = this.parseTime(timeValue);

    if (!parsedTime) {
      this.onChange(parsedDate.clone().hour(0).minute(0).second(0).millisecond(0).toDate());
      return;
    }

    this.onChange(
      parsedDate
        .clone()
        .hour(parsedTime.hours)
        .minute(parsedTime.minutes)
        .second(0)
        .millisecond(0)
        .toDate(),
    );
  }

  private parseDateValue(value: Date | string | null): moment.Moment | null {
    if (!value) {
      return null;
    }

    if (value instanceof Date) {
      const parsedDate = moment(value);
      return parsedDate.isValid() ? parsedDate : null;
    }

    const parsedBrDate = moment(value, 'DD/MM/YYYY', true);

    if (parsedBrDate.isValid()) {
      return parsedBrDate;
    }

    const parsedGenericDate = moment(value);

    return parsedGenericDate.isValid() ? parsedGenericDate : null;
  }

  private normalizeTyping(value: string): string {
    if (!value) {
      return '';
    }

    const digitsOnly = value.replace(/\D/g, '').slice(0, 4);

    if (digitsOnly.length <= 2) {
      return digitsOnly;
    }

    return `${digitsOnly.slice(0, 2)}:${digitsOnly.slice(2)}`;
  }

  private normalizeTimeOnBlur(value: string): string {
    const digitsOnly = value.replace(/\D/g, '').slice(0, 4);

    if (!digitsOnly) {
      return '';
    }

    if (digitsOnly.length === 1) {
      return `0${digitsOnly}:00`;
    }

    if (digitsOnly.length === 2) {
      const hours = Number(digitsOnly);

      if (!this.isValidHour(hours)) {
        return '';
      }

      return `${digitsOnly}:00`;
    }

    if (digitsOnly.length === 3) {
      const hours = Number(`0${digitsOnly[0]}`);
      const minutes = Number(digitsOnly.slice(1));

      if (!this.isValidTime(hours, minutes)) {
        return '';
      }

      return `0${digitsOnly[0]}:${digitsOnly.slice(1)}`;
    }

    const hours = Number(digitsOnly.slice(0, 2));
    const minutes = Number(digitsOnly.slice(2, 4));

    if (!this.isValidTime(hours, minutes)) {
      return '';
    }

    return `${digitsOnly.slice(0, 2)}:${digitsOnly.slice(2, 4)}`;
  }

  private parseTime(value: string): { hours: number; minutes: number } | null {
    const match = /^(\d{2}):(\d{2})$/.exec(value);

    if (!match) {
      return null;
    }

    const hours = Number(match[1]);
    const minutes = Number(match[2]);

    if (!this.isValidTime(hours, minutes)) {
      return null;
    }

    return { hours, minutes };
  }

  private isValidHour(hours: number): boolean {
    return hours >= 0 && hours <= 23;
  }

  private isValidMinute(minutes: number): boolean {
    return minutes >= 0 && minutes <= 59;
  }

  private isValidTime(hours: number, minutes: number): boolean {
    return this.isValidHour(hours) && this.isValidMinute(minutes);
  }
}
