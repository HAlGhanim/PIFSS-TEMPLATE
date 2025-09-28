import { CommonModule } from '@angular/common';
import { Component, computed, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  GCCPhoneContext,
  InputRestriction,
  InputRestrictionUtils,
} from '../../../utils';

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
  // Input properties
  type = input<'text' | 'email' | 'password' | 'number' | 'tel'>('text');
  placeholder = input('');
  inputId = input('');
  inputClass = input('');
  restriction = input<InputRestriction>('none');
  customMaxLength = input<number | null>(null);
  phoneContext = input<GCCPhoneContext | undefined>(undefined);

  // Internal state
  value = signal<any>('');
  isDisabled = signal(false);

  // Computed max length based on restriction or custom value
  computedMaxLength = computed(() => {
    const custom = this.customMaxLength();
    if (custom !== null) {
      return custom;
    }
    return InputRestrictionUtils.getMaxLength(
      this.restriction(),
      this.phoneContext()
    );
  });

  // Control value accessor methods
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

  /**
   * Handle input changes
   */
  onInputChange(event: any): void {
    let newValue = event.target.value;

    // Apply restriction-based filtering with context
    newValue = InputRestrictionUtils.filterText(
      newValue,
      this.restriction(),
      this.phoneContext()
    );

    // Update the input element value if it was modified
    if (event.target.value !== newValue) {
      event.target.value = newValue;
    }

    this.value.set(newValue);
    this.onChange(newValue);
  }

  /**
   * Handle keypress events to prevent invalid characters
   */
  onKeyPress(event: KeyboardEvent): void {
    // Allow control keys (backspace, delete, tab, etc.)
    if (InputRestrictionUtils.isControlKey(event)) {
      return;
    }

    const char = String.fromCharCode(event.which || event.keyCode);

    // Check if character is allowed based on restriction
    if (!InputRestrictionUtils.isCharacterAllowed(char, this.restriction())) {
      event.preventDefault();
      return;
    }

    // Check max length (account for selection replacement)
    const target = event.target as HTMLInputElement;
    const maxLen = this.computedMaxLength();
    if (
      maxLen &&
      target.value.length >= maxLen &&
      target.selectionStart === target.selectionEnd
    ) {
      event.preventDefault();
    }
  }

  /**
   * Handle paste events to filter pasted content
   */
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();

    const pastedText = event.clipboardData?.getData('text') || '';
    const filteredText = InputRestrictionUtils.filterText(
      pastedText,
      this.restriction(),
      this.phoneContext()
    );

    // Get current cursor position
    const target = event.target as HTMLInputElement;
    const start = target.selectionStart || 0;
    const end = target.selectionEnd || 0;

    // Build new value with filtered pasted text
    const currentValue = target.value;
    let newValue =
      currentValue.substring(0, start) +
      filteredText +
      currentValue.substring(end);

    // Apply max length if needed
    const maxLen = this.computedMaxLength();
    if (maxLen && newValue.length > maxLen) {
      const availableLength = maxLen - currentValue.length + (end - start);
      const truncatedPaste = filteredText.substring(
        0,
        Math.max(0, availableLength)
      );
      newValue =
        currentValue.substring(0, start) +
        truncatedPaste +
        currentValue.substring(end);
    }

    // Update value
    target.value = newValue;
    this.value.set(newValue);
    this.onChange(newValue);

    // Set cursor position after pasted text
    const newCursorPos = Math.min(start + filteredText.length, newValue.length);
    setTimeout(() => {
      target.setSelectionRange(newCursorPos, newCursorPos);
    });
  }

  /**
   * Handle blur event
   */
  onBlur(): void {
    this.onTouched();

    // Optional: Format value on blur for display
    const currentValue = this.value();
    const formattedValue = InputRestrictionUtils.formatText(
      currentValue,
      this.restriction(),
      this.phoneContext()
    );

    // Only update if formatting changed the value and it's a display format
    if (this.restriction() === 'none' && formattedValue !== currentValue) {
      this.value.set(formattedValue);
      this.onChange(formattedValue);
    }
  }
}
