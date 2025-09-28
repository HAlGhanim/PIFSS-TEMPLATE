import { getCountryByCode } from '.';

export type InputRestriction =
  | 'civilId'
  | 'gccPhone'
  | 'internationalPhone'
  | 'name'
  | 'number'
  | 'amount'
  | 'none';

export interface GCCPhoneContext {
  countryCode: string; // ISO country code (KW, SA, AE, etc.)
}

export class InputRestrictionUtils {
  /**
   * Get the maximum length for a specific restriction type
   */
  static getMaxLength(
    restriction: InputRestriction,
    context?: GCCPhoneContext
  ): number | null {
    switch (restriction) {
      case 'civilId':
        return 12;
      case 'gccPhone':
        if (context?.countryCode) {
          const country = getCountryByCode(context.countryCode);
          // Add space for country code, spaces, and dash
          return country
            ? country.phoneCode.length + country.phoneLength + 3
            : 20;
        }
        return 20; // Default max for any GCC phone with formatting
      case 'internationalPhone':
        return 20; // International format with country code
      default:
        return null;
    }
  }

  /**
   * Check if a character is allowed based on restriction type
   */
  static isCharacterAllowed(
    char: string,
    restriction: InputRestriction
  ): boolean {
    switch (restriction) {
      case 'civilId':
        // Only allow digits
        return /^\d$/.test(char);

      case 'gccPhone':
      case 'internationalPhone':
        // Allow digits, +, -, (, ), and space for phone numbers
        return /^[\d\+\-\(\)\s]$/.test(char);

      case 'name':
        // Allow Arabic letters, English letters, and spaces only
        // Extended Arabic Unicode ranges for better coverage
        return (
          /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s]$/.test(
            char
          ) || /^[a-zA-Z\s]$/.test(char)
        );

      case 'number':
        // Allow digits and decimal point
        return /^[\d\.]$/.test(char);

      case 'amount':
        // Allow digits and decimal point (for Kuwait Dinar format)
        return /^[\d\.]$/.test(char);

      default:
        return true;
    }
  }

  /**
   * Filter/clean a string based on restriction type
   */
  static filterText(
    text: string,
    restriction: InputRestriction,
    context?: GCCPhoneContext
  ): string {
    if (!text) return text;

    switch (restriction) {
      case 'civilId':
        // Remove non-digits and limit to 12 characters
        return text.replace(/\D/g, '').substring(0, 12);

      case 'gccPhone':
        // Keep digits, +, spaces, and dashes
        let gccPhone = text.replace(/[^\d\+\s\-]/g, '');

        // If we have country context, apply specific length limit
        if (context?.countryCode) {
          const country = getCountryByCode(context.countryCode);
          if (country) {
            // Remove country code to count actual phone digits
            let phoneDigits = gccPhone.replace(/\D/g, '');
            const countryCodeDigits = country.phoneCode.replace('+', '');

            if (phoneDigits.startsWith(countryCodeDigits)) {
              phoneDigits = phoneDigits.substring(countryCodeDigits.length);
            }

            // Limit to country-specific phone length
            if (phoneDigits.length > country.phoneLength) {
              phoneDigits = phoneDigits.substring(0, country.phoneLength);
            }

            // Reconstruct with country code if needed
            if (!gccPhone.startsWith('+') && !gccPhone.startsWith('00')) {
              return phoneDigits;
            }
          }
        }

        return gccPhone;

      case 'internationalPhone':
        // Remove invalid characters for phone
        return text.replace(/[^\d\+\-\(\)\s]/g, '').substring(0, 20);

      case 'name':
        // Remove numbers and special characters, keep only letters and spaces
        // Extended Arabic Unicode ranges
        return text.replace(
          /[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z\s]/g,
          ''
        );

      case 'number':
        // Remove non-numeric characters except decimal point
        return text.replace(/[^\d\.]/g, '');

      case 'amount':
        // Special handling for Kuwait Dinar format (X.XXX)
        let amount = text.replace(/[^\d\.]/g, '');

        // Ensure only one decimal point
        const parts = amount.split('.');
        if (parts.length > 2) {
          amount = parts[0] + '.' + parts.slice(1).join('');
        }

        // Limit decimal places to 3
        if (parts.length === 2 && parts[1].length > 3) {
          amount = parts[0] + '.' + parts[1].substring(0, 3);
        }

        return amount;

      default:
        return text;
    }
  }

  /**
   * Check if control keys (backspace, delete, arrows, etc.) are pressed
   */
  static isControlKey(event: KeyboardEvent): boolean {
    // Allow: backspace, delete, tab, escape, enter
    if (
      [8, 9, 13, 27, 46].indexOf(event.keyCode) !== -1 ||
      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (event.keyCode === 65 && event.ctrlKey === true) ||
      (event.keyCode === 67 && event.ctrlKey === true) ||
      (event.keyCode === 86 && event.ctrlKey === true) ||
      (event.keyCode === 88 && event.ctrlKey === true) ||
      // Allow: home, end, left, right, up, down
      (event.keyCode >= 35 && event.keyCode <= 40)
    ) {
      return true;
    }
    return false;
  }

  /**
   * Format text based on restriction type (for display)
   */
  static formatText(
    text: string,
    restriction: InputRestriction,
    context?: GCCPhoneContext
  ): string {
    if (!text) return text;

    switch (restriction) {
      case 'civilId':
        // Format as: XXX-XXXXXX-XXX
        if (text.length === 12) {
          return text.replace(/(\d{3})(\d{6})(\d{3})/, '$1-$2-$3');
        }
        return text;

      case 'gccPhone':
        if (context?.countryCode) {
          const country = getCountryByCode(context.countryCode);
          if (country) {
            // Clean the number
            let digits = text.replace(/\D/g, '');

            // Remove country code if present
            const countryCodeDigits = country.phoneCode.replace('+', '');
            if (digits.startsWith(countryCodeDigits)) {
              digits = digits.substring(countryCodeDigits.length);
            } else if (digits.startsWith('00' + countryCodeDigits)) {
              digits = digits.substring(countryCodeDigits.length + 2);
            }

            // Format based on country
            if (digits.length === country.phoneLength) {
              switch (context.countryCode) {
                case 'KW':
                case 'QA':
                case 'BH':
                case 'OM':
                  // Format as XXXX-XXXX
                  return `${country.phoneCode} ${digits.substring(
                    0,
                    4
                  )}-${digits.substring(4)}`;
                case 'SA':
                case 'AE':
                  // Format as 5X XXX-XXXX
                  return `${country.phoneCode} ${digits.substring(
                    0,
                    2
                  )} ${digits.substring(2, 5)}-${digits.substring(5)}`;
              }
            }
          }
        }
        return text;

      case 'amount':
        // Format as Kuwait Dinar with 3 decimal places
        const num = parseFloat(text);
        if (!isNaN(num)) {
          return num.toFixed(3);
        }
        return text;

      default:
        return text;
    }
  }

  /**
   * Validate if the current value matches the restriction format
   */
  static isValid(
    value: string,
    restriction: InputRestriction,
    context?: GCCPhoneContext
  ): boolean {
    if (!value) return true; // Empty is valid (use required validator for that)

    switch (restriction) {
      case 'civilId':
        return /^[123]\d{11}$/.test(value);

      case 'gccPhone':
        if (context?.countryCode) {
          const country = getCountryByCode(context.countryCode);
          if (country) {
            const cleaned = value.replace(/[\s\-\(\)]/g, '');
            return country.phoneRegex.test(cleaned);
          }
        }
        return false;

      case 'internationalPhone':
        // Basic phone validation (at least 7 digits)
        const digitsOnly = value.replace(/\D/g, '');
        return digitsOnly.length >= 7 && digitsOnly.length <= 20;

      case 'name':
        // At least 2 characters, only letters and spaces
        const nameRegex =
          /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z\s]{2,}$/;
        return nameRegex.test(value);

      case 'amount':
        // Valid Kuwait Dinar format
        return /^(?!0+(?:\.0+)?$)(\d+|\d+\.\d{1,3})$/.test(value);

      default:
        return true;
    }
  }

  /**
   * Get error message for restriction type
   */
  static getErrorMessage(
    restriction: InputRestriction,
    context?: GCCPhoneContext
  ): string {
    switch (restriction) {
      case 'civilId':
        return 'يجب أن يحتوي الرقم المدني على 12 رقم';
      case 'gccPhone':
        if (context?.countryCode) {
          const country = getCountryByCode(context.countryCode);
          if (country) {
            return `يجب أن يحتوي رقم الهاتف على ${country.phoneLength} أرقام`;
          }
        }
        return 'رقم هاتف غير صحيح';
      case 'internationalPhone':
        return 'رقم هاتف دولي غير صحيح';
      case 'name':
        return 'يجب أن يحتوي الاسم على أحرف فقط';
      case 'amount':
        return 'مبلغ غير صحيح';
      default:
        return '';
    }
  }
}
