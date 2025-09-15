export class DateUtils {
  /**
   * Converts a Date object or string to YYYY-MM-DD format
   * @param date Date object or string
   * @returns Date string in YYYY-MM-DD format
   */
  static toDateString(date: Date | string): string {
    if (typeof date === 'string') {
      // If it's already a string, validate it's in correct format
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date;
      }
      // Try to parse the string as a Date
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toISOString().split('T')[0];
      }
      throw new Error('Invalid date string format');
    }
    return date.toISOString().split('T')[0];
  }

  /**
   * Converts a Date to YYYY-MM-DD format or returns undefined if not provided
   * @param date Optional Date object or string
   * @returns Date string in YYYY-MM-DD format or undefined
   */
  static toOptionalDateString(date?: Date | string): string | undefined {
    return date ? this.toDateString(date) : undefined;
  }

  /**
   * Creates date params object for API calls
   * @param date Optional Date object or string
   * @param paramName Name of the date parameter (default: 'Date')
   * @returns Record with date parameter or empty object
   */
  static createDateParams(
    date?: Date | string,
    paramName: string = 'Date'
  ): Record<string, string> {
    if (!date) {
      return {};
    }
    return { [paramName]: this.toDateString(date) };
  }

  /**
   * Validates if a string is in YYYY-MM-DD format
   * @param dateString String to validate
   * @returns boolean indicating if the string is valid
   */
  static isValidDateString(dateString: string): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
  }

  /**
   * Converts a date string or Date object to a formatted display string
   * @param date Date object or string
   * @param locale Locale for formatting (default: 'en-US')
   * @returns Formatted date string
   */
  static toDisplayString(
    date: Date | string,
    locale: string = 'en-US'
  ): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }
}
