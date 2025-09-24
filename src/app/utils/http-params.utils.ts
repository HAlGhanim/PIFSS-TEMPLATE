import { HttpParams } from '@angular/common/http';

export class HttpParamsUtils {
  /**
   * Build HttpParams from a record of key-value pairs
   * Filters out null, undefined, and empty string values
   */
  static buildParams(params: Record<string, any>): HttpParams {
    let httpParams = new HttpParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        httpParams = httpParams.set(key, value.toString());
      }
    });

    return httpParams;
  }

  /**
   * Build HttpParams with support for arrays and nested objects
   */
  static buildComplexParams(params: Record<string, any>): HttpParams {
    let httpParams = new HttpParams();

    const appendParams = (
      obj: Record<string, any>,
      prefix: string = ''
    ): void => {
      Object.entries(obj).forEach(([key, value]) => {
        const paramKey = prefix ? `${prefix}[${key}]` : key;

        if (value === null || value === undefined || value === '') {
          return;
        }

        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (typeof item === 'object' && item !== null) {
              appendParams(item, `${paramKey}[${index}]`);
            } else if (item !== null && item !== undefined && item !== '') {
              httpParams = httpParams.append(`${paramKey}[]`, item.toString());
            }
          });
        } else if (typeof value === 'object' && !(value instanceof Date)) {
          appendParams(value, paramKey);
        } else if (value instanceof Date) {
          httpParams = httpParams.set(paramKey, value.toISOString());
        } else {
          httpParams = httpParams.set(paramKey, value.toString());
        }
      });
    };

    appendParams(params);
    return httpParams;
  }

  /**
   * Build HttpParams for pagination
   */
  static buildPaginationParams(
    page: number = 1,
    pageSize: number = 10,
    additionalParams?: Record<string, any>
  ): HttpParams {
    const params: Record<string, any> = {
      page,
      pageSize,
      ...additionalParams,
    };

    return this.buildParams(params);
  }

  /**
   * Build HttpParams for sorting
   */
  static buildSortParams(
    sortBy?: string,
    sortDirection: 'asc' | 'desc' = 'asc',
    additionalParams?: Record<string, any>
  ): HttpParams {
    const params: Record<string, any> = { ...additionalParams };

    if (sortBy) {
      params['sortBy'] = sortBy;
      params['sortDirection'] = sortDirection;
    }

    return this.buildParams(params);
  }

  /**
   * Build HttpParams for table queries (pagination, sorting, search, filters)
   */
  static buildTableParams(options: {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    search?: string;
    filters?: Record<string, any>;
  }): HttpParams {
    let httpParams = new HttpParams();

    // Add pagination
    if (options.page) {
      httpParams = httpParams.set('page', options.page.toString());
    }

    if (options.pageSize) {
      httpParams = httpParams.set('pageSize', options.pageSize.toString());
    }

    // Add sorting
    if (options.sortBy) {
      httpParams = httpParams.set('sortBy', options.sortBy);
      httpParams = httpParams.set(
        'sortDirection',
        options.sortDirection || 'asc'
      );
    }

    // Add search
    if (options.search) {
      httpParams = httpParams.set('search', options.search);
    }

    // Add filters
    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return httpParams;
  }

  /**
   * Build HttpParams for date range queries
   */
  static buildDateRangeParams(
    startDate?: Date | string,
    endDate?: Date | string,
    dateFormat: 'iso' | 'timestamp' = 'iso',
    additionalParams?: Record<string, any>
  ): HttpParams {
    const params: Record<string, any> = { ...additionalParams };

    if (startDate) {
      params['startDate'] =
        dateFormat === 'iso'
          ? startDate instanceof Date
            ? startDate.toISOString()
            : startDate
          : startDate instanceof Date
          ? startDate.getTime()
          : new Date(startDate).getTime();
    }

    if (endDate) {
      params['endDate'] =
        dateFormat === 'iso'
          ? endDate instanceof Date
            ? endDate.toISOString()
            : endDate
          : endDate instanceof Date
          ? endDate.getTime()
          : new Date(endDate).getTime();
    }

    return this.buildParams(params);
  }

  /**
   * Merge multiple HttpParams objects
   */
  static mergeParams(...paramsList: HttpParams[]): HttpParams {
    let merged = new HttpParams();

    paramsList.forEach((params) => {
      params.keys().forEach((key) => {
        const values = params.getAll(key);
        if (values) {
          values.forEach((value) => {
            merged = merged.append(key, value);
          });
        }
      });
    });

    return merged;
  }

  /**
   * Remove specific parameters from HttpParams
   */
  static removeParams(params: HttpParams, keysToRemove: string[]): HttpParams {
    let filtered = new HttpParams();

    params.keys().forEach((key) => {
      if (!keysToRemove.includes(key)) {
        const values = params.getAll(key);
        if (values) {
          values.forEach((value) => {
            filtered = filtered.append(key, value);
          });
        }
      }
    });

    return filtered;
  }

  /**
   * Convert HttpParams to a plain object
   */
  static toObject(params: HttpParams): Record<string, string | string[]> {
    const obj: Record<string, string | string[]> = {};

    params.keys().forEach((key) => {
      const values = params.getAll(key);
      if (values) {
        obj[key] = values.length === 1 ? values[0] : values;
      }
    });

    return obj;
  }

  /**
   * Build HttpParams from URL search string
   */
  static fromQueryString(queryString: string): HttpParams {
    // Remove leading '?' if present
    const cleanQuery = queryString.startsWith('?')
      ? queryString.substring(1)
      : queryString;

    return new HttpParams({ fromString: cleanQuery });
  }

  /**
   * Build HttpParams with custom encoding for special characters
   */
  static buildParamsWithCustomEncoding(
    params: Record<string, any>,
    encoder?: {
      encodeKey?: (key: string) => string;
      encodeValue?: (value: string) => string;
    }
  ): HttpParams {
    let httpParams = new HttpParams({
      encoder: encoder
        ? {
            encodeKey:
              encoder.encodeKey || ((k: string) => encodeURIComponent(k)),
            encodeValue:
              encoder.encodeValue || ((v: string) => encodeURIComponent(v)),
            decodeKey: (k: string) => decodeURIComponent(k),
            decodeValue: (v: string) => decodeURIComponent(v),
          }
        : undefined,
    });

    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        httpParams = httpParams.set(key, value.toString());
      }
    });

    return httpParams;
  }
}

// Example usage in your TableService
export class ExampleUsage {
  // Simple usage
  simpleExample() {
    const params = HttpParamsUtils.buildParams({
      name: 'John',
      age: 30,
      active: true,
      empty: '', // Will be filtered out
      nullValue: null, // Will be filtered out
    });
    // Results in: ?name=John&age=30&active=true
  }

  // Table parameters
  tableExample() {
    const params = HttpParamsUtils.buildTableParams({
      page: 2,
      pageSize: 20,
      sortBy: 'createdAt',
      sortDirection: 'desc',
      search: 'angular',
      filters: {
        status: 'active',
        category: 'development',
      },
    });
    // Results in: ?page=2&pageSize=20&sortBy=createdAt&sortDirection=desc&search=angular&status=active&category=development
  }

  // Complex nested parameters
  complexExample() {
    const params = HttpParamsUtils.buildComplexParams({
      user: {
        name: 'John',
        age: 30,
      },
      tags: ['angular', 'typescript', 'rxjs'],
      metadata: {
        created: new Date(),
        modified: new Date(),
      },
    });
    // Results in nested parameter structure
  }

  // Date range
  dateRangeExample() {
    const params = HttpParamsUtils.buildDateRangeParams(
      new Date('2024-01-01'),
      new Date('2024-12-31'),
      'iso',
      { includeArchived: false }
    );
    // Results in: ?startDate=2024-01-01T00:00:00.000Z&endDate=2024-12-31T00:00:00.000Z&includeArchived=false
  }

  // Merge multiple params
  mergeExample() {
    const paginationParams = HttpParamsUtils.buildPaginationParams(1, 10);
    const sortParams = HttpParamsUtils.buildSortParams('name', 'asc');
    const filterParams = HttpParamsUtils.buildParams({ status: 'active' });

    const merged = HttpParamsUtils.mergeParams(
      paginationParams,
      sortParams,
      filterParams
    );
    // Results in: ?page=1&pageSize=10&sortBy=name&sortDirection=asc&status=active
  }
}
