import { Injectable } from '@angular/core';
import { DateUtils } from '../../utils';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  /**
   * Get today's date as a string in YYYY-MM-DD format
   */
  getToday(): string {
    return DateUtils.toDateString(new Date());
  }

  /**
   * Get yesterday's date as a string
   */
  getYesterday(): string {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return DateUtils.toDateString(yesterday);
  }

  /**
   * Get tomorrow's date as a string
   */
  getTomorrow(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return DateUtils.toDateString(tomorrow);
  }

  /**
   * Get the first day of current month
   */
  getMonthStart(): string {
    const date = new Date();
    date.setDate(1);
    return DateUtils.toDateString(date);
  }

  /**
   * Get the last day of current month
   */
  getMonthEnd(): string {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    date.setDate(0);
    return DateUtils.toDateString(date);
  }

  /**
   * Get the first day of current year
   */
  getYearStart(): string {
    const date = new Date();
    date.setMonth(0);
    date.setDate(1);
    return DateUtils.toDateString(date);
  }

  /**
   * Get the last day of current year
   */
  getYearEnd(): string {
    const date = new Date();
    date.setMonth(11);
    date.setDate(31);
    return DateUtils.toDateString(date);
  }

  /**
   * Add days to a date
   */
  addDays(date: Date | string, days: number): string {
    const d = DateUtils.safeParseDate(date);
    if (!d) return '';

    d.setDate(d.getDate() + days);
    return DateUtils.toDateString(d);
  }

  /**
   * Add months to a date
   */
  addMonths(date: Date | string, months: number): string {
    const d = DateUtils.safeParseDate(date);
    if (!d) return '';

    d.setMonth(d.getMonth() + months);
    return DateUtils.toDateString(d);
  }

  /**
   * Add years to a date
   */
  addYears(date: Date | string, years: number): string {
    const d = DateUtils.safeParseDate(date);
    if (!d) return '';

    d.setFullYear(d.getFullYear() + years);
    return DateUtils.toDateString(d);
  }

  /**
   * Format date for display
   */
  formatForDisplay(
    date: Date | string | null | undefined,
    locale: string = 'ar-KW'
  ): string {
    return DateUtils.toDisplayString(date, locale);
  }

  /**
   * Format date range for display
   */
  formatRange(
    startDate: Date | string | null | undefined,
    endDate: Date | string | null | undefined,
    locale: string = 'ar-KW'
  ): string {
    return DateUtils.formatDateRange(startDate, endDate, locale);
  }

  /**
   * Validate date string
   */
  isValid(dateString: string | null | undefined): boolean {
    return DateUtils.isValidDateString(dateString);
  }

  /**
   * Parse date safely
   */
  parse(date: any): Date | null {
    return DateUtils.safeParseDate(date);
  }

  /**
   * Convert to API format
   */
  toApiFormat(date: Date | string | null | undefined): string | undefined {
    return DateUtils.toOptionalDateString(date);
  }

  /**
   * Compare dates
   */
  compare(
    date1: Date | string | null | undefined,
    date2: Date | string | null | undefined
  ): number | null {
    return DateUtils.compareDates(date1, date2);
  }

  /**
   * Check if date is before another
   */
  isBefore(
    date1: Date | string | null | undefined,
    date2: Date | string | null | undefined
  ): boolean | null {
    return DateUtils.isBefore(date1, date2);
  }

  /**
   * Check if date is after another
   */
  isAfter(
    date1: Date | string | null | undefined,
    date2: Date | string | null | undefined
  ): boolean | null {
    return DateUtils.isAfter(date1, date2);
  }

  /**
   * Get days between dates
   */
  getDaysBetween(
    date1: Date | string | null | undefined,
    date2: Date | string | null | undefined
  ): number | null {
    return DateUtils.daysBetween(date1, date2);
  }

  /**
   * Create date parameters for API calls
   */
  createApiParams(
    date?: Date | string | null,
    paramName: string = 'Date'
  ): Record<string, string> {
    return DateUtils.createDateParams(date, paramName);
  }

  /**
   * Get date range parameters for API
   */
  createRangeParams(
    startDate?: Date | string | null,
    endDate?: Date | string | null,
    startParamName: string = 'StartDate',
    endParamName: string = 'EndDate'
  ): Record<string, string> {
    return {
      ...DateUtils.createDateParams(startDate, startParamName),
      ...DateUtils.createDateParams(endDate, endParamName),
    };
  }

  /**
   * Check if date is today
   */
  isToday(date: Date | string | null | undefined): boolean {
    const d = DateUtils.safeParseDate(date);
    if (!d) return false;

    const today = new Date();
    return d.toDateString() === today.toDateString();
  }

  /**
   * Check if date is in the past
   */
  isPast(date: Date | string | null | undefined): boolean {
    const d = DateUtils.safeParseDate(date);
    if (!d) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d < today;
  }

  /**
   * Check if date is in the future
   */
  isFuture(date: Date | string | null | undefined): boolean {
    const d = DateUtils.safeParseDate(date);
    if (!d) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d > today;
  }
}
