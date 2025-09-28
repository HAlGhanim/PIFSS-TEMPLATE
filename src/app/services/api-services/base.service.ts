import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, shareReplay, tap } from 'rxjs';
import { environment } from '../../../environment';
import { CacheUtils, CacheKeyBuilder } from '../../utils/';
import { CacheEntry } from '../../interfaces';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  protected readonly _http = inject(HttpClient);

  private readonly baseUrl: string = environment.baseurl;
  private cache = new Map<string, CacheEntry<any>>();
  private readonly CACHE_DURATION_MS = CacheUtils.getCacheDuration();

  /**
   * GET request with 30-second caching
   * @param url - The endpoint URL
   * @param headers - Optional headers
   * @param params - Optional query parameters
   * @returns Observable of the response
   */
  get<ResponseType>(
    url: string,
    headers?: any,
    params?: any
  ): Observable<ResponseType> {
    // Check if caching is enabled
    if (!CacheUtils.isCachingEnabled()) {
      return this.getFresh<ResponseType>(url, headers, params);
    }

    // Create a unique cache key using CacheKeyBuilder
    const cacheKey = CacheKeyBuilder.create()
      .addUrl(url)
      .addParams(params)
      .addHeaders(headers)
      .build();

    // Check if we have a valid cached response
    const cachedEntry = this.cache.get(cacheKey);

    if (
      cachedEntry &&
      CacheUtils.isCacheValid(cachedEntry.timestamp, this.CACHE_DURATION_MS)
    ) {
      CacheUtils.logCacheEvent('hit', url);
      return cachedEntry.data;
    }

    CacheUtils.logCacheEvent('miss', url);

    // Make the HTTP request and cache it
    const request$ = this._http
      .get<ResponseType>(this.baseUrl + url, {
        headers,
        params,
      })
      .pipe(
        // Share the observable to prevent multiple subscriptions from triggering multiple requests
        shareReplay(1),
        tap(() => {
          CacheUtils.logCacheEvent('store', url);
        })
      );

    // Store in cache
    this.cache.set(cacheKey, {
      data: request$,
      timestamp: Date.now(),
    });

    // Clean up expired cache entries periodically
    CacheUtils.cleanupExpiredCache(this.cache, this.CACHE_DURATION_MS);

    return request$;
  }

  /**
   * Optional: Get a request without caching
   * Useful when you need fresh data regardless of cache
   */
  getFresh<ResponseType>(
    url: string,
    headers?: any,
    params?: any
  ): Observable<ResponseType> {
    CacheUtils.logCacheEvent('miss', url);

    return this._http.get<ResponseType>(this.baseUrl + url, {
      headers,
      params,
    });
  }

  /**
   * GET request for blob data (not cached as blob responses are typically large files)
   */
  getBlob(url: string, headers?: any, params?: any) {
    return this._http.get(this.baseUrl + url, {
      headers,
      params,
      responseType: 'blob',
      observe: 'response',
    });
  }

  /**
   * POST request (not cached as POST typically modifies data)
   */
  post<ResponseType, RequestBodyType>(
    url: string,
    body: RequestBodyType,
    headers?: any,
    params?: any
  ) {
    // Invalidate related cache entries when posting data
    this.invalidateCacheByUrlPattern(url);

    return this._http.post<ResponseType>(this.baseUrl + url, body, {
      headers,
      params,
    });
  }

  /**
   * POST FormData request (not cached)
   */
  postFormData<ResponseType>(
    url: string,
    formData: FormData,
    headers?: any,
    params?: any
  ) {
    // Invalidate related cache entries when posting data
    this.invalidateCacheByUrlPattern(url);

    return this._http.post<ResponseType>(this.baseUrl + url, formData, {
      headers,
      params,
    });
  }

  /**
   * PUT request (not cached as PUT typically modifies data)
   */
  put<ResponseType, RequestBodyType>(
    url: string,
    body: RequestBodyType,
    headers?: any,
    params?: any
  ) {
    // Invalidate related cache entries when updating data
    this.invalidateCacheByUrlPattern(url);

    return this._http.put<ResponseType>(this.baseUrl + url, body, {
      headers,
      params,
    });
  }

  /**
   * DELETE request (not cached as DELETE modifies data)
   */
  delete<ResponseType>(url: string, headers?: any, params?: any) {
    // Invalidate related cache entries when deleting data
    this.invalidateCacheByUrlPattern(url);

    return this._http.delete<ResponseType>(this.baseUrl + url, {
      headers,
      params,
    });
  }

  /**
   * Manually clear all cache entries
   * Useful for forcing fresh data fetch
   */
  public clearCache(): void {
    CacheUtils.clearCache(this.cache);
  }

  /**
   * Manually clear cache for a specific URL
   * Uses CacheKeyBuilder to find matching entries
   */
  public clearCacheForUrl(url: string): void {
    const keysToDelete: string[] = [];

    // Create a base pattern to match against
    const basePattern = CacheKeyBuilder.create()
      .addUrl(url)
      .build()
      .split('::')[0]; // Get just the URL part

    this.cache.forEach((value, key) => {
      if (key.startsWith(basePattern)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => {
      CacheUtils.logCacheEvent('invalidate', key);
      this.cache.delete(key);
    });
  }

  /**
   * Get cache statistics (useful for debugging)
   */
  public getCacheStats(): {
    size: number;
    entries: string[];
    validCount: number;
    expiredCount: number;
  } {
    return CacheUtils.getCacheStats(this.cache);
  }

  /**
   * Invalidate all cache entries for a specific resource type
   * Uses CacheKeyBuilder patterns for better matching
   */
  public invalidateCacheForResource(resourceType: string): void {
    const keysToDelete: string[] = [];
    const resourcePattern = `resource_${resourceType}`;

    this.cache.forEach((value, key) => {
      // Check if key contains the resource pattern
      if (key.includes(resourcePattern) || key.includes(`/${resourceType}`)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => {
      CacheUtils.logCacheEvent('invalidate', key);
      this.cache.delete(key);
    });
  }

  /**
   * Get current cache duration in a human-readable format
   */
  public getCacheDurationInfo(): string {
    return CacheUtils.formatCacheDuration(this.CACHE_DURATION_MS);
  }

  /**
   * Force cleanup of expired cache entries
   * This is called automatically, but can be triggered manually if needed
   */
  public forceCleanupExpiredCache(): void {
    CacheUtils.cleanupExpiredCache(this.cache, this.CACHE_DURATION_MS);
  }

  /**
   * Private helper to invalidate cache by URL pattern
   * Replaces the old CacheUtils.invalidateCacheForUrl calls
   */
  private invalidateCacheByUrlPattern(url: string): void {
    const keysToDelete: string[] = [];

    // Get the base path without query parameters
    const basePath = url.split('?')[0];

    this.cache.forEach((value, key) => {
      if (key.includes(basePath)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => {
      CacheUtils.logCacheEvent('invalidate', key);
      this.cache.delete(key);
    });
  }
}
