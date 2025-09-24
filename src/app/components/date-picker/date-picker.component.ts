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

    // Use DateUtils for date comparisons
    if (inputValue) {
      const inputDate = DateUtils.safeParseDate(inputValue);
      const maxDateValue = DateUtils.safeParseDate(this.maxDate());
      const minDateValue = DateUtils.safeParseDate(this.minDate());

      if (
        inputDate &&
        maxDateValue &&
        DateUtils.isAfter(inputDate, maxDateValue)
      ) {
        correctedValue = this.maxDate();
      }

      if (
        inputDate &&
        minDateValue &&
        DateUtils.isBefore(inputDate, minDateValue)
      ) {
        correctedValue = this.minDate();
      }
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
    // Use DateUtils for consistent date string conversion
    this.value = DateUtils.toOptionalDateString(value) || '';
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

    // Use DateUtils for validation
    if (!DateUtils.isValidDateString(value)) {
      errors['invalidDate'] = {
        actual: value,
        message: 'تاريخ غير صحيح',
      };
      return errors;
    }

    // Use DateUtils for date comparisons
    const valueDate = DateUtils.safeParseDate(value);
    const maxDateValue = DateUtils.safeParseDate(this.maxDate());
    const minDateValue = DateUtils.safeParseDate(this.minDate());

    if (
      valueDate &&
      maxDateValue &&
      DateUtils.isAfter(valueDate, maxDateValue)
    ) {
      errors['maxDate'] = {
        max: this.maxDate(),
        actual: value,
        message: `التاريخ يجب أن يكون قبل أو يساوي ${DateUtils.toDisplayString(
          this.maxDate(),
          'ar-KW'
        )}`,
      };
    }

    if (
      valueDate &&
      minDateValue &&
      DateUtils.isBefore(valueDate, minDateValue)
    ) {
      errors['minDate'] = {
        min: this.minDate(),
        actual: value,
        message: `التاريخ يجب أن يكون بعد أو يساوي ${DateUtils.toDisplayString(
          this.minDate(),
          'ar-KW'
        )}`,
      };
    }

    return Object.keys(errors).length > 0 ? errors : null;
  }

  registerOnValidatorChange(fn: () => void): void {
    this.onValidatorChange = fn;
  }

  // Helper methods using DateUtils
  isDateValid(): boolean {
    return this.value ? DateUtils.isValidDateString(this.value) : true;
  }

  getDateValue(): Date | null {
    return DateUtils.safeParseDate(this.value);
  }
}
