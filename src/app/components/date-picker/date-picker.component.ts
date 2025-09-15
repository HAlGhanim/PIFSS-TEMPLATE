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
  maxDate = input(new Date().toISOString().split('T')[0]);
  minDate = input('');

  value: string = '';
  disabled = false;

  private onChangeCallback: (value: any) => void = () => {};
  private onTouchedCallback: () => void = () => {};
  private onValidatorChange: () => void = () => {};

  onChange(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;

    this.value = inputValue;

    this.onChangeCallback(inputValue);

    this.onValidatorChange();
  }

  onBlur(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;

    if (inputValue && this.maxDate() && inputValue > this.maxDate()) {
      this.value = this.maxDate();
      inputElement.value = this.maxDate();
      this.onChangeCallback(this.maxDate());
    }

    if (inputValue && this.minDate() && inputValue < this.minDate()) {
      this.value = this.minDate();
      inputElement.value = this.minDate();
      this.onChangeCallback(this.minDate());
    }

    this.onTouchedCallback();
    this.onValidatorChange();
  }

  writeValue(value: any): void {
    this.value = value || '';
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

    if (!value) {
      return null;
    }

    const errors: ValidationErrors = {};

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
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
  }
}
