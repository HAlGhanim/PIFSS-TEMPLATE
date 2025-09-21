import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, shareReplay, tap } from 'rxjs';
import { environment } from '../../../environment';
import { CacheUtils } from '../../utils/';
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

    // Create a unique cache key based on URL, headers, and params
    const cacheKey = CacheUtils.createCacheKey(url, headers, params);

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
    CacheUtils.invalidateCacheForUrl(this.cache, url);

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
    CacheUtils.invalidateCacheForUrl(this.cache, url);

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
    CacheUtils.invalidateCacheForUrl(this.cache, url);

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
    CacheUtils.invalidateCacheForUrl(this.cache, url);

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
   */
  public clearCacheForUrl(url: string): void {
    CacheUtils.clearCacheForUrl(this.cache, url);
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
   * Invalidate all cache entries for a specific resource type
   * Example: invalidateCacheForResource('employees')
   */
  public invalidateCacheForResource(resourceType: string): void {
    const keysToDelete: string[] = [];

    this.cache.forEach((value, key) => {
      const parsed = CacheUtils.parseCacheKey(key);
      if (
        parsed.url?.includes(resourceType) ||
        parsed.resourceType === resourceType
      ) {
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
}
