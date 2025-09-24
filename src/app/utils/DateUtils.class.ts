export class DateUtils {
  /**
   * Converts a Date object or string to YYYY-MM-DD format
   * @param date Date object or string or null/undefined
   * @returns Date string in YYYY-MM-DD format or empty string if null/undefined
   */
  static toDateString(date: Date | string | null | undefined): string {
    if (!date) {
      return '';
    }

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
   * @param date Optional Date object or string or null
   * @returns Date string in YYYY-MM-DD format or undefined
   */
  static toOptionalDateString(date?: Date | string | null): string | undefined {
    if (date === null || date === undefined || date === '') {
      return undefined;
    }
    return this.toDateString(date);
  }

  /**
   * Creates date params object for API calls
   * @param date Optional Date object or string or null
   * @param paramName Name of the date parameter (default: 'Date')
   * @returns Record with date parameter or empty object
   */
  static createDateParams(
    date?: Date | string | null,
    paramName: string = 'Date'
  ): Record<string, string> {
    if (!date) {
      return {};
    }
    const dateString = this.toDateString(date);
    if (!dateString) {
      return {};
    }
    return { [paramName]: dateString };
  }

  /**
   * Validates if a string is in YYYY-MM-DD format
   * @param dateString String to validate (can be null/undefined)
   * @returns boolean indicating if the string is valid
   */
  static isValidDateString(dateString: string | null | undefined): boolean {
    if (!dateString) {
      return false;
    }
    return /^\d{4}-\d{2}-\d{2}$/.test(dateString);
  }

  /**
   * Converts a date string or Date object to a formatted display string
   * @param date Date object or string or null/undefined
   * @param locale Locale for formatting (default: 'en-US')
   * @returns Formatted date string or empty string if null/undefined
   */
  static toDisplayString(
    date: Date | string | null | undefined,
    locale: string = 'en-US'
  ): string {
    if (!date) {
      return '';
    }

    const dateObj = typeof date === 'string' ? new Date(date) : date;

    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return '';
    }

    return dateObj.toLocaleDateString(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }

  /**
   * Safely parse a date value that might be null/undefined
   * @param date Any date value
   * @returns Date object or null
   */
  static safeParseDate(date: any): Date | null {
    if (!date) {
      return null;
    }

    if (date instanceof Date) {
      return date;
    }

    if (typeof date === 'string') {
      const parsed = new Date(date);
      return isNaN(parsed.getTime()) ? null : parsed;
    }

    return null;
  }

  /**
   * Compare two dates (handles null/undefined)
   * @param date1 First date
   * @param date2 Second date
   * @returns -1 if date1 < date2, 0 if equal, 1 if date1 > date2, null if either is invalid
   */
  static compareDates(
    date1: Date | string | null | undefined,
    date2: Date | string | null | undefined
  ): number | null {
    const d1 = this.safeParseDate(date1);
    const d2 = this.safeParseDate(date2);

    if (!d1 || !d2) {
      return null;
    }

    const time1 = d1.getTime();
    const time2 = d2.getTime();

    if (time1 < time2) return -1;
    if (time1 > time2) return 1;
    return 0;
  }

  /**
   * Check if a date is before another date (handles null/undefined)
   * @param date1 First date
   * @param date2 Second date
   * @returns boolean or null if either date is invalid
   */
  static isBefore(
    date1: Date | string | null | undefined,
    date2: Date | string | null | undefined
  ): boolean | null {
    const comparison = this.compareDates(date1, date2);
    return comparison === null ? null : comparison < 0;
  }

  /**
   * Check if a date is after another date (handles null/undefined)
   * @param date1 First date
   * @param date2 Second date
   * @returns boolean or null if either date is invalid
   */
  static isAfter(
    date1: Date | string | null | undefined,
    date2: Date | string | null | undefined
  ): boolean | null {
    const comparison = this.compareDates(date1, date2);
    return comparison === null ? null : comparison > 0;
  }

  /**
   * Get the number of days between two dates (handles null/undefined)
   * @param date1 First date
   * @param date2 Second date
   * @returns Number of days or null if either date is invalid
   */
  static daysBetween(
    date1: Date | string | null | undefined,
    date2: Date | string | null | undefined
  ): number | null {
    const d1 = this.safeParseDate(date1);
    const d2 = this.safeParseDate(date2);

    if (!d1 || !d2) {
      return null;
    }

    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  /**
   * Format a date range for display
   * @param startDate Start date
   * @param endDate End date
   * @param locale Locale for formatting
   * @returns Formatted date range string
   */
  static formatDateRange(
    startDate: Date | string | null | undefined,
    endDate: Date | string | null | undefined,
    locale: string = 'en-US'
  ): string {
    const start = this.toDisplayString(startDate, locale);
    const end = this.toDisplayString(endDate, locale);

    if (!start && !end) {
      return '';
    }

    if (!start) {
      return `حتى ${end}`;
    }

    if (!end) {
      return `من ${start}`;
    }

    return `${start} - ${end}`;
  }
}
