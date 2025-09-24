import { environment } from '../../environment';
import { CacheEntry } from '../interfaces';
import { CacheKeyPatterns } from './cache-key-builder.utils';

export class CacheUtils {
  private static readonly CACHE_DURATION_MS = 30000; // 30 seconds

  /**
   * Create a unique cache key based on URL and parameters
   * Now uses CacheKeyBuilder for consistency
   */
  static createCacheKey(url: string, headers?: any, params?: any): string {
    return CacheKeyPatterns.forApiCall(url, params, headers);
  }

  /**
   * Check if a cache entry is still valid (within 30 seconds)
   */
  static isCacheValid(
    timestamp: number,
    duration: number = CacheUtils.CACHE_DURATION_MS
  ): boolean {
    return Date.now() - timestamp < duration;
  }

  /**
   * Get keys to invalidate based on URL pattern
   */
  static getKeysToInvalidate(cache: Map<string, any>, url: string): string[] {
    // Get the base path without query parameters
    const basePath = url.split('?')[0];

    // Find all cache entries that start with the same base path
    const keysToDelete: string[] = [];
    cache.forEach((value, key) => {
      if (key.startsWith(basePath)) {
        keysToDelete.push(key);
      }
    });

    return keysToDelete;
  }

  /**
   * Invalidate cache entries that match a specific URL pattern
   * This is useful when data is modified via POST/PUT/DELETE
   */
  static invalidateCacheForUrl(cache: Map<string, any>, url: string): void {
    const keysToDelete = CacheUtils.getKeysToInvalidate(cache, url);

    keysToDelete.forEach((key) => {
      if (CacheUtils.isVerboseLoggingEnabled()) {
        console.log(`[Cache Invalidate] Removing cache for: ${key}`);
      }
      cache.delete(key);
    });
  }

  /**
   * Get expired cache keys
   */
  static getExpiredKeys(
    cache: Map<string, CacheEntry<any>>,
    duration: number = CacheUtils.CACHE_DURATION_MS
  ): string[] {
    const keysToDelete: string[] = [];

    cache.forEach((value, key) => {
      if (!CacheUtils.isCacheValid(value.timestamp, duration)) {
        keysToDelete.push(key);
      }
    });

    return keysToDelete;
  }

  /**
   * Clean up expired cache entries to prevent memory leaks
   */
  static cleanupExpiredCache(
    cache: Map<string, CacheEntry<any>>,
    duration: number = CacheUtils.CACHE_DURATION_MS
  ): void {
    const keysToDelete = CacheUtils.getExpiredKeys(cache, duration);

    keysToDelete.forEach((key) => {
      if (CacheUtils.isVerboseLoggingEnabled()) {
        console.log(`[Cache Cleanup] Removing expired cache for: ${key}`);
      }

      cache.delete(key);
    });
  }

  /**
   * Clear all cache entries
   * Useful for forcing fresh data fetch
   */
  static clearCache(cache: Map<string, any>): void {
    if (CacheUtils.isVerboseLoggingEnabled()) {
      console.log('[Cache Clear] Clearing all cache entries');
    }
    cache.clear();
  }

  /**
   * Clear cache for a specific URL pattern
   */
  static clearCacheForUrl(cache: Map<string, any>, url: string): void {
    const keysToDelete: string[] = [];

    cache.forEach((value, key) => {
      if (key.startsWith(url)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => {
      if (CacheUtils.isVerboseLoggingEnabled()) {
        console.log(`[Cache Clear] Removing cache for: ${key}`);
      }
      cache.delete(key);
    });
  }

  /**
   * Get cache statistics (useful for debugging)
   */
  static getCacheStats(cache: Map<string, any>): {
    size: number;
    entries: string[];
    validCount: number;
    expiredCount: number;
  } {
    const entries = Array.from(cache.keys());
    let validCount = 0;
    let expiredCount = 0;

    cache.forEach((value) => {
      if (value.timestamp && CacheUtils.isCacheValid(value.timestamp)) {
        validCount++;
      } else if (value.timestamp) {
        expiredCount++;
      }
    });

    return {
      size: cache.size,
      entries,
      validCount,
      expiredCount,
    };
  }

  /**
   * Get default cache duration
   */
  static getCacheDuration(): number {
    return CacheUtils.CACHE_DURATION_MS;
  }

  /**
   * Format cache duration for display
   */
  static formatCacheDuration(
    durationMs: number = CacheUtils.CACHE_DURATION_MS
  ): string {
    const seconds = durationMs / 1000;
    if (seconds < 60) {
      return `${seconds} seconds`;
    }
    const minutes = seconds / 60;
    return `${minutes} minutes`;
  }

  /**
   * Check if caching should be disabled (useful for development/debugging)
   */
  static isCachingEnabled(): boolean {
    // Check localStorage for manual override (useful for debugging)
    if (
      typeof localStorage !== 'undefined' &&
      localStorage.getItem('disableCache') === 'true'
    ) {
      console.log('[Cache] Caching disabled via localStorage');
      return false;
    }

    // Check URL parameters for temporary disable (useful for testing)
    if (typeof window !== 'undefined' && window.location) {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('noCache') === 'true') {
        console.log('[Cache] Caching disabled via URL parameter');
        return false;
      }
    }

    // Default: caching is enabled in both development and production
    // You can change this to disable caching in development:
    // return environment.production;

    return true;
  }

  /**
   * Check if verbose logging should be enabled
   */
  static isVerboseLoggingEnabled(): boolean {
    // Check localStorage for override
    if (typeof localStorage !== 'undefined') {
      const verboseLogging = localStorage.getItem('verboseLogging');
      if (verboseLogging === 'true') return true;
      if (verboseLogging === 'false') return false;
    }

    // Default: Enable verbose logging in development only
    return !environment.production;
  }

  /**
   * Log cache hit/miss for debugging
   */
  static logCacheEvent(
    event: 'hit' | 'miss' | 'store' | 'invalidate' | 'clear',
    url: string
  ): void {
    // Only log if verbose logging is enabled (typically in development)
    if (!CacheUtils.isVerboseLoggingEnabled()) {
      return;
    }

    const timestamp = new Date().toISOString();
    const eventLabel = {
      hit: '[Cache Hit]',
      miss: '[Cache Miss]',
      store: '[Cache Store]',
      invalidate: '[Cache Invalidate]',
      clear: '[Cache Clear]',
    };

    console.log(`${eventLabel[event]} ${timestamp} - ${url}`);
  }

  /**
   * Create a cache key for a specific resource type
   * Now uses CacheKeyBuilder
   */
  static createResourceCacheKey(
    resourceType: string,
    id?: string | number,
    params?: any
  ): string {
    return CacheKeyPatterns.forResource(resourceType, id, params);
  }

  /**
   * Create table cache key with all parameters
   */
  static createTableCacheKey(
    endpoint: string,
    page: number = 1,
    pageSize: number = 10,
    sortBy?: string,
    sortDirection?: 'asc' | 'desc',
    search?: string,
    filters?: Record<string, any>
  ): string {
    return CacheKeyPatterns.forTableData(
      endpoint,
      page,
      pageSize,
      sortBy,
      sortDirection,
      search,
      filters
    );
  }

  /**
   * Parse a cache key to extract information
   */
  static parseCacheKey(key: string): {
    url?: string;
    headers?: string;
    params?: string;
    resourceType?: string;
    id?: string;
  } {
    const parts = key.split('::');

    if (parts[0] === 'resource') {
      return {
        resourceType: parts[1],
        id: parts[2],
        params: parts[3],
      };
    }

    return {
      url: parts[0],
      headers: parts[1] || undefined,
      params: parts[2] || undefined,
    };
  }
}
