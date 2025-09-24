import { Component, forwardRef, input } from '@angular/core';
import {
  ReactiveFormsModule,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  Validator,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { DateUtils } from '../../utils';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: `./date-picker.component.html`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePicker),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DatePicker),
      multi: true,
    },
  ],
})
export class DatePicker implements ControlValueAccessor, Validator {
  maxDate = input(DateUtils.toDateString(new Date()));
  minDate = input('');

  value: string = '';
  disabled = false;
  touched = false;

  private onChangeCallback: (value: any) => void = () => {};
  private onTouchedCallback: () => void = () => {};
  private onValidatorChange: () => void = () => {};

  onChange(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;

    this.value = inputValue;
    this.onChangeCallback(inputValue);

    if (!this.touched) {
      this.touched = true;
      this.onTouchedCallback();
    }

    this.onValidatorChange();
  }

  onBlur(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;

    let correctedValue = inputValue;

    if (inputValue && this.maxDate() && inputValue > this.maxDate()) {
      correctedValue = this.maxDate();
    }

    if (inputValue && this.minDate() && inputValue < this.minDate()) {
      correctedValue = this.minDate();
    }

    if (correctedValue !== inputValue) {
      this.value = correctedValue;
      inputElement.value = correctedValue;
      this.onChangeCallback(correctedValue);
    }

    this.touched = true;
    this.onTouchedCallback();
    this.onValidatorChange();
  }

  writeValue(value: any): void {
    if (value instanceof Date) {
      this.value = DateUtils.toDateString(value);
    } else {
      this.value = value || '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const errors: ValidationErrors = {};

    if (!value) {
      return null;
    }

    if (!DateUtils.isValidDateString(value)) {
      errors['invalidDate'] = {
        actual: value,
        message: 'تاريخ غير صحيح',
      };
      return errors;
    }

    if (this.maxDate() && value > this.maxDate()) {
      errors['maxDate'] = {
        max: this.maxDate(),
        actual: value,
        message: `التاريخ يجب أن يكون قبل أو يساوي ${this.formatDate(
          this.maxDate()
        )}`,
      };
    }

    if (this.minDate() && value < this.minDate()) {
      errors['minDate'] = {
        min: this.minDate(),
        actual: value,
        message: `التاريخ يجب أن يكون بعد أو يساوي ${this.formatDate(
          this.minDate()
        )}`,
      };
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  private formatDate(dateString: string): string {
    if (!dateString) return '';
    return DateUtils.toDisplayString(dateString, 'ar-KW');
  }

  isDateValid(): boolean {
    return this.value ? DateUtils.isValidDateString(this.value) : true;
  }

  getDateValue(): Date | null {
    return this.value ? new Date(this.value) : null;
  }
}
