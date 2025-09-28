import { Component, input, forwardRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { SelectOption, SelectOptionGroup } from '../../../interfaces';

@Component({
  selector: 'app-form-select-group',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-select-group.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormSelectGroupComponent),
      multi: true,
    },
  ],
})
export class FormSelectGroupComponent implements ControlValueAccessor {
  placeholder = input<string>('');
  selectId = input<string>('');
  selectClass = input<string>('');
  groups = input<SelectOptionGroup[]>([]);
  showIndex = input<boolean>(true);
  indexOffset = input<number>(0);

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

  onSelectChange(event: any): void {
    const newValue = event.target.value;
    this.value.set(newValue);
    this.onChange(newValue);
  }

  getOptionLabel(
    option: SelectOption,
    groupIndex: number,
    optionIndex: number
  ): string {
    if (!this.showIndex()) {
      return option.label;
    }

    let absoluteIndex = this.indexOffset() + 1;

    for (let i = 0; i < groupIndex; i++) {
      absoluteIndex += this.groups()[i].options.length;
    }

    absoluteIndex += optionIndex;

    return `${absoluteIndex}. ${option.label}`;
  }

  hasGroups(): boolean {
    return (
      this.groups().length > 0 &&
      this.groups().some((group) => group.options.length > 0)
    );
  }
}
