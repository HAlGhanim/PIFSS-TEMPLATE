import { CommonModule } from '@angular/common';
import { Component, forwardRef, input, signal } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: `./form-input.component.html`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputComponent),
      multi: true,
    },
  ],
})
export class FormInputComponent implements ControlValueAccessor {
  type = input<'text' | 'email' | 'password' | 'number' | 'tel'>('text');
  placeholder = input('');
  inputId = input('');
  inputClass = input('');

  value = signal<any>('');
  isDisabled = signal(false);

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(val: any): void {
    this.value.set(val || '');
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.isDisabled.set(disabled);
  }

  onInputChange(event: any): void {
    const newValue = event.target.value;
    this.value.set(newValue);
    this.onChange(newValue);
  }
}
