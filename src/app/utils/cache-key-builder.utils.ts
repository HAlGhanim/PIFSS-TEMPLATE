// src/app/utils/cache-key-builder.ts
import { HttpParams } from '@angular/common/http';

/**
 * Builder pattern for creating cache keys consistently
 * Avoids repetition and provides a fluent API for cache key creation
 */
export class CacheKeyBuilder {
  private parts: string[] = [];
  private separator: string = '::';

  /**
   * Create a new CacheKeyBuilder instance
   */
  static create(): CacheKeyBuilder {
    return new CacheKeyBuilder();
  }

  /**
   * Set custom separator (default is '::')
   */
  withSeparator(separator: string): this {
    this.separator = separator;
    return this;
  }

  /**
   * Add URL to the cache key
   */
  addUrl(url: string): this {
    if (url) {
      // Normalize URL by removing trailing slashes
      const normalizedUrl = url.replace(/\/$/, '');
      this.parts.push(normalizedUrl);
    }
    return this;
  }

  /**
   * Add HTTP parameters to the cache key
   */
  addParams(params: any): this {
    if (params) {
      if (params instanceof HttpParams) {
        // Convert HttpParams to string representation
        const paramsString = params.toString();
        if (paramsString) {
          this.parts.push(paramsString);
        }
      } else if (typeof params === 'object') {
        // Sort keys for consistent cache key generation
        const sortedParams = this.sortObjectKeys(params);
        const paramsString = JSON.stringify(sortedParams);
        if (paramsString && paramsString !== '{}') {
          this.parts.push(paramsString);
        }
      } else if (params) {
        this.parts.push(params.toString());
      }
    }
    return this;
  }

  /**
   * Add headers to the cache key
   */
  addHeaders(headers: any): this {
    if (headers && Object.keys(headers).length > 0) {
      const sortedHeaders = this.sortObjectKeys(headers);
      this.parts.push(JSON.stringify(sortedHeaders));
    }
    return this;
  }

  /**
   * Add resource type to the cache key
   */
  addResource(resourceType: string, id?: string | number): this {
    if (resourceType) {
      let resourceKey = `resource_${resourceType}`;
      if (id !== undefined && id !== null) {
        resourceKey += `_${id}`;
      }
      this.parts.push(resourceKey);
    }
    return this;
  }

  /**
   * Add user context to the cache key
   */
  addUser(userId?: string | number): this {
    if (userId !== undefined && userId !== null) {
      this.parts.push(`user_${userId}`);
    }
    return this;
  }

  /**
   * Add timestamp for time-based caching
   */
  addTimestamp(
    granularity: 'second' | 'minute' | 'hour' | 'day' = 'minute'
  ): this {
    const now = new Date();
    let timestamp: string;

    switch (granularity) {
      case 'second':
        timestamp = now.toISOString();
        break;
      case 'minute':
        timestamp = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}-${now.getMinutes()}`;
        break;
      case 'hour':
        timestamp = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}`;
        break;
      case 'day':
        timestamp = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
        break;
    }

    this.parts.push(`time_${timestamp}`);
    return this;
  }

  /**
   * Add custom key-value pair
   */
  addCustom(key: string, value: any): this {
    if (key && value !== undefined && value !== null) {
      const valueString =
        typeof value === 'object'
          ? JSON.stringify(this.sortObjectKeys(value))
          : value.toString();
      this.parts.push(`${key}_${valueString}`);
    }
    return this;
  }

  /**
   * Add filter criteria
   */
  addFilters(filters: Record<string, any>): this {
    if (filters && Object.keys(filters).length > 0) {
      // Remove empty values and sort
      const cleanFilters = this.removeEmptyValues(filters);
      if (Object.keys(cleanFilters).length > 0) {
        const sortedFilters = this.sortObjectKeys(cleanFilters);
        this.parts.push(`filters_${JSON.stringify(sortedFilters)}`);
      }
    }
    return this;
  }

  /**
   * Add pagination info
   */
  addPagination(page?: number, pageSize?: number): this {
    if (page !== undefined && page !== null) {
      this.parts.push(`page_${page}`);
    }
    if (pageSize !== undefined && pageSize !== null) {
      this.parts.push(`size_${pageSize}`);
    }
    return this;
  }

  /**
   * Add sorting info
   */
  addSort(sortBy?: string, sortDirection?: 'asc' | 'desc'): this {
    if (sortBy) {
      let sortKey = `sort_${sortBy}`;
      if (sortDirection) {
        sortKey += `_${sortDirection}`;
      }
      this.parts.push(sortKey);
    }
    return this;
  }

  /**
   * Add search query
   */
  addSearch(searchQuery?: string): this {
    if (searchQuery && searchQuery.trim()) {
      this.parts.push(`search_${searchQuery.trim().toLowerCase()}`);
    }
    return this;
  }

  /**
   * Add version for cache busting
   */
  addVersion(version: string | number): this {
    if (version) {
      this.parts.push(`v_${version}`);
    }
    return this;
  }

  /**
   * Add locale for internationalization
   */
  addLocale(locale?: string): this {
    if (locale) {
      this.parts.push(`locale_${locale}`);
    }
    return this;
  }

  /**
   * Build the final cache key
   */
  build(): string {
    // Filter out empty parts
    const validParts = this.parts.filter((part) => part && part.length > 0);

    if (validParts.length === 0) {
      return 'default_cache_key';
    }

    return validParts.join(this.separator);
  }

  /**
   * Build and return a hash of the cache key (for shorter keys)
   */
  buildHash(): string {
    const key = this.build();
    return this.hashString(key);
  }

  /**
   * Reset the builder
   */
  reset(): this {
    this.parts = [];
    return this;
  }

  /**
   * Clone the current builder state
   */
  clone(): CacheKeyBuilder {
    const newBuilder = new CacheKeyBuilder();
    newBuilder.parts = [...this.parts];
    newBuilder.separator = this.separator;
    return newBuilder;
  }

  /**
   * Sort object keys for consistent cache key generation
   */
  private sortObjectKeys(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.sortObjectKeys(item));
    }

    const sorted: any = {};
    Object.keys(obj)
      .sort()
      .forEach((key) => {
        sorted[key] = this.sortObjectKeys(obj[key]);
      });

    return sorted;
  }

  /**
   * Remove empty values from object
   */
  private removeEmptyValues(obj: Record<string, any>): Record<string, any> {
    const clean: Record<string, any> = {};

    Object.entries(obj).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        clean[key] = value;
      }
    });

    return clean;
  }

  /**
   * Simple hash function for creating shorter cache keys
   */
  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }
}

/**
 * Factory functions for common cache key patterns
 */
export class CacheKeyPatterns {
  /**
   * Create cache key for API endpoint with params
   */
  static forApiCall(url: string, params?: any, headers?: any): string {
    return CacheKeyBuilder.create()
      .addUrl(url)
      .addParams(params)
      .addHeaders(headers)
      .build();
  }

  /**
   * Create cache key for table data
   */
  static forTableData(
    endpoint: string,
    page: number,
    pageSize: number,
    sortBy?: string,
    sortDirection?: 'asc' | 'desc',
    search?: string,
    filters?: Record<string, any>
  ): string {
    return CacheKeyBuilder.create()
      .addUrl(endpoint)
      .addPagination(page, pageSize)
      .addSort(sortBy, sortDirection)
      .addSearch(search)
      .addFilters(filters || {})
      .build();
  }

  /**
   * Create cache key for resource
   */
  static forResource(
    resourceType: string,
    id?: string | number,
    params?: any
  ): string {
    return CacheKeyBuilder.create()
      .addResource(resourceType, id)
      .addParams(params)
      .build();
  }

  /**
   * Create cache key for user-specific data
   */
  static forUserData(
    userId: string | number,
    dataType: string,
    params?: any
  ): string {
    return CacheKeyBuilder.create()
      .addUser(userId)
      .addCustom('dataType', dataType)
      .addParams(params)
      .build();
  }

  /**
   * Create cache key for search results
   */
  static forSearch(
    searchQuery: string,
    filters?: Record<string, any>,
    page?: number
  ): string {
    return CacheKeyBuilder.create()
      .addSearch(searchQuery)
      .addFilters(filters || {})
      .addPagination(page, undefined)
      .build();
  }

  /**
   * Create cache key for report data
   */
  static forReport(
    reportType: string,
    startDate?: string,
    endDate?: string,
    params?: any
  ): string {
    return CacheKeyBuilder.create()
      .addCustom('report', reportType)
      .addCustom('startDate', startDate)
      .addCustom('endDate', endDate)
      .addParams(params)
      .build();
  }
}

/**
 * Example usage in services and components
 */
export class CacheKeyExamples {
  // Simple API call
  example1() {
    const key = CacheKeyBuilder.create()
      .addUrl('/api/employees')
      .addParams({ department: 'IT' })
      .build();
    // Result: "/api/employees::{"department":"IT"}"
  }

  // Table with full options
  example2() {
    const key = CacheKeyPatterns.forTableData(
      '/api/employees',
      1,
      10,
      'name',
      'asc',
      'john',
      { department: 'IT', status: 'active' }
    );
    // Result: organized cache key with all table parameters
  }

  // Resource with ID
  example3() {
    const key = CacheKeyPatterns.forResource('employee', 123, {
      include: 'department',
    });
    // Result: "resource_employee_123::{"include":"department"}"
  }

  // User-specific cache
  example4() {
    const key = CacheKeyPatterns.forUserData(456, 'preferences', {
      section: 'display',
    });
    // Result: "user_456::dataType_preferences::{"section":"display"}"
  }

  // Shorter hash-based key
  example5() {
    const key = CacheKeyBuilder.create()
      .addUrl('/api/very/long/url/with/many/segments')
      .addParams({
        lots: 'of',
        different: 'parameters',
        that: 'would',
        make: 'a',
        very: 'long',
        cache: 'key',
      })
      .buildHash();
    // Result: Short hash like "a3f5x9b"
  }

  // Chaining multiple builders
  example6() {
    const baseBuilder = CacheKeyBuilder.create()
      .addUrl('/api/data')
      .addUser(123);

    const tableKey = baseBuilder.clone().addPagination(1, 10).build();

    const exportKey = baseBuilder.clone().addCustom('format', 'excel').build();
  }
}
