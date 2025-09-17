import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  combineLatest,
  debounceTime,
  of,
  switchMap,
  tap,
} from 'rxjs';
import {
  PaginatedResponse,
  TableQueryParams,
  TableStateManager,
} from '../../interfaces';
import { BaseService } from '../api-services/base.service';

@Injectable({
  providedIn: 'root',
})
export class TableService extends BaseService {
  /**
   * Create a managed table state with automatic data fetching
   */
  createTableState<T>(
    endpoint: string,
    initialParams: TableQueryParams = {}
  ): TableStateManager<T> {
    // State subjects
    const page$ = new BehaviorSubject(initialParams.page || 1);
    const pageSize$ = new BehaviorSubject(initialParams.pageSize || 10);
    const sortBy$ = new BehaviorSubject(initialParams.sortBy || '');
    const sortDirection$ = new BehaviorSubject<'asc' | 'desc'>(
      initialParams.sortDirection || 'asc'
    );
    const search$ = new BehaviorSubject(initialParams.search || '');
    const filters$ = new BehaviorSubject<Record<string, any>>(
      initialParams.filters || {}
    );
    const refresh$ = new BehaviorSubject(0);
    const loading$ = new BehaviorSubject(false);
    const error$ = new BehaviorSubject<string | null>(null);
    const data$ = new BehaviorSubject<T[]>([]);
    const totalItems$ = new BehaviorSubject(0);

    // Combine all state changes
    const currentState$ = combineLatest([
      page$,
      pageSize$,
      sortBy$,
      sortDirection$,
      search$,
      filters$,
      refresh$,
    ]).pipe(
      debounceTime(300),
      tap(() => {
        loading$.next(true);
        error$.next(null);
      }),
      switchMap(([page, pageSize, sortBy, sortDirection, search, filters]) => {
        const params = this.buildHttpParams({
          page,
          pageSize,
          sortBy,
          sortDirection,
          search,
          filters,
        });

        return this.fetchData<T>(endpoint, params).pipe(
          tap((response) => {
            data$.next(response.data);
            totalItems$.next(response.totalItems);
            loading$.next(false);
          }),
          catchError((error) => {
            console.error('Table data fetch error:', error);
            error$.next(this.getErrorMessage(error));
            loading$.next(false);
            data$.next([]);
            totalItems$.next(0);
            return of(null);
          })
        );
      })
    );

    // Subscribe to keep state updated
    const subscription = currentState$.subscribe();

    return {
      data$: data$.asObservable(),
      totalItems$: totalItems$.asObservable(),
      loading$: loading$.asObservable(),
      error$: error$.asObservable(),
      currentState$: combineLatest([
        page$,
        pageSize$,
        sortBy$,
        sortDirection$,
        search$,
        filters$,
      ]).pipe(
        debounceTime(0),
        switchMap(([page, pageSize, sortBy, sortDirection, search, filters]) =>
          of({ page, pageSize, sortBy, sortDirection, search, filters })
        )
      ),

      setPage: (page: number) => {
        page$.next(page);
      },

      setPageSize: (pageSize: number) => {
        pageSize$.next(pageSize);
        page$.next(1); // Reset to first page
      },

      setSort: (sortBy: string, direction: 'asc' | 'desc') => {
        sortBy$.next(sortBy);
        sortDirection$.next(direction);
      },

      setSearch: (search: string) => {
        search$.next(search);
        page$.next(1); // Reset to first page
      },

      setFilters: (filters: Record<string, any>) => {
        filters$.next(filters);
        page$.next(1); // Reset to first page
      },

      refresh: () => {
        refresh$.next(refresh$.value + 1);
      },

      reset: () => {
        page$.next(initialParams.page || 1);
        pageSize$.next(initialParams.pageSize || 10);
        sortBy$.next(initialParams.sortBy || '');
        sortDirection$.next(initialParams.sortDirection || 'asc');
        search$.next(initialParams.search || '');
        filters$.next(initialParams.filters || {});
        refresh$.next(0);
      },
    };
  }

  /**
   * Fetch paginated data from an endpoint
   */
  fetchData<T>(
    endpoint: string,
    params: HttpParams
  ): Observable<PaginatedResponse<T>> {
    return this.get<PaginatedResponse<T>>(endpoint, undefined, params);
  }

  /**
   * Build HttpParams from table query parameters
   */
  buildHttpParams(params: TableQueryParams): HttpParams {
    let httpParams = new HttpParams();

    if (params.page) {
      httpParams = httpParams.set('page', params.page.toString());
    }

    if (params.pageSize) {
      httpParams = httpParams.set('pageSize', params.pageSize.toString());
    }

    if (params.sortBy) {
      httpParams = httpParams.set('sortBy', params.sortBy);
      httpParams = httpParams.set(
        'sortDirection',
        params.sortDirection || 'asc'
      );
    }

    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }

    if (params.filters) {
      Object.keys(params.filters).forEach((key) => {
        const value = params.filters![key];
        if (value !== null && value !== undefined && value !== '') {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return httpParams;
  }

  /**
   * Export table data to CSV
   */
  exportToCSV<T extends Record<string, any>>(
    data: T[],
    filename: string = 'export.csv',
    columns?: { key: string; label: string }[]
  ): void {
    if (!data || data.length === 0) {
      console.warn('No data to export');
      return;
    }

    // Determine columns to export
    const columnsToExport =
      columns || Object.keys(data[0]).map((key) => ({ key, label: key }));

    // Create CSV header
    const headers = columnsToExport.map((col) =>
      this.escapeCsvValue(col.label)
    );
    const csvHeader = headers.join(',');

    // Create CSV rows
    const csvRows = data.map((row) => {
      return columnsToExport
        .map((col) => {
          const value = row[col.key];
          return this.escapeCsvValue(this.formatCsvValue(value));
        })
        .join(',');
    });

    // Combine header and rows
    const csvContent = [csvHeader, ...csvRows].join('\n');

    // Add BOM for proper UTF-8 encoding in Excel
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], {
      type: 'text/csv;charset=utf-8;',
    });

    // Download file
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Export table data to Excel using API endpoint
   */
  exportToExcel<T>(
    endpoint: string,
    params: TableQueryParams,
    filename: string = 'export.xlsx'
  ): Observable<void> {
    const httpParams = this.buildHttpParams({
      ...params,
      export: 'excel',
    } as any);

    return this.getBlob(
      endpoint,
      { Accept: 'application/vnd.ms-excel' },
      httpParams
    ).pipe(
      tap((response) => {
        if (response.body) {
          const blob = new Blob([response.body], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          const link = document.createElement('a');
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', filename);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }),
      switchMap(() => of(void 0)),
      catchError((error) => {
        console.error('Export failed:', error);
        throw error;
      })
    );
  }

  /**
   * Helper: Escape CSV values
   */
  private escapeCsvValue(value: string): string {
    if (value === null || value === undefined) {
      return '';
    }

    value = value.toString();

    // Check if value needs escaping
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      // Escape quotes by doubling them
      value = value.replace(/"/g, '""');
      // Wrap in quotes
      value = `"${value}"`;
    }

    return value;
  }

  /**
   * Helper: Format value for CSV export
   */
  private formatCsvValue(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }

    if (typeof value === 'boolean') {
      return value ? 'نعم' : 'لا';
    }

    if (value instanceof Date) {
      return value.toLocaleDateString('ar-SA');
    }

    if (typeof value === 'object') {
      return JSON.stringify(value);
    }

    return value.toString();
  }

  /**
   * Helper: Get user-friendly error message
   */
  private getErrorMessage(error: any): string {
    if (error?.error?.message) {
      return error.error.message;
    }

    if (error?.message) {
      return error.message;
    }

    switch (error?.status) {
      case 0:
        return 'لا يمكن الاتصال بالخادم';
      case 404:
        return 'البيانات المطلوبة غير موجودة';
      case 500:
        return 'خطأ في الخادم';
      default:
        return 'حدث خطأ في تحميل البيانات';
    }
  }

  /**
   * Helper: Create a simple observable for static data with pagination
   */
  createStaticTableState<T>(
    data: T[],
    initialParams: TableQueryParams = {}
  ): TableStateManager<T> {
    const allData = [...data];
    const page$ = new BehaviorSubject(initialParams.page || 1);
    const pageSize$ = new BehaviorSubject(initialParams.pageSize || 10);
    const sortBy$ = new BehaviorSubject(initialParams.sortBy || '');
    const sortDirection$ = new BehaviorSubject<'asc' | 'desc'>(
      initialParams.sortDirection || 'asc'
    );
    const search$ = new BehaviorSubject(initialParams.search || '');
    const filters$ = new BehaviorSubject<Record<string, any>>(
      initialParams.filters || {}
    );

    const processedData$ = combineLatest([
      page$,
      pageSize$,
      sortBy$,
      sortDirection$,
      search$,
      filters$,
    ]).pipe(
      switchMap(([page, pageSize, sortBy, sortDirection, search, filters]) => {
        let filtered = [...allData];

        // Apply search
        if (search) {
          const searchLower = search.toLowerCase();
          filtered = filtered.filter((item) =>
            Object.values(item as any).some((value) =>
              value?.toString().toLowerCase().includes(searchLower)
            )
          );
        }

        // Apply filters
        Object.keys(filters).forEach((key) => {
          const filterValue = filters[key];
          if (
            filterValue !== null &&
            filterValue !== undefined &&
            filterValue !== ''
          ) {
            filtered = filtered.filter(
              (item: any) => item[key] === filterValue
            );
          }
        });

        // Apply sorting
        if (sortBy) {
          filtered.sort((a: any, b: any) => {
            const aVal = a[sortBy];
            const bVal = b[sortBy];

            if (aVal === bVal) return 0;

            const comparison = aVal > bVal ? 1 : -1;
            return sortDirection === 'asc' ? comparison : -comparison;
          });
        }

        // Apply pagination
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedData = filtered.slice(startIndex, endIndex);

        return of({
          data: paginatedData,
          totalItems: filtered.length,
        });
      })
    );

    const data$ = processedData$.pipe(switchMap((result) => of(result.data)));

    const totalItems$ = processedData$.pipe(
      switchMap((result) => of(result.totalItems))
    );

    return {
      data$,
      totalItems$,
      loading$: of(false),
      error$: of(null),
      currentState$: combineLatest([
        page$,
        pageSize$,
        sortBy$,
        sortDirection$,
        search$,
        filters$,
      ]).pipe(
        switchMap(([page, pageSize, sortBy, sortDirection, search, filters]) =>
          of({ page, pageSize, sortBy, sortDirection, search, filters })
        )
      ),

      setPage: (page: number) => page$.next(page),
      setPageSize: (pageSize: number) => {
        pageSize$.next(pageSize);
        page$.next(1);
      },
      setSort: (sortBy: string, direction: 'asc' | 'desc') => {
        sortBy$.next(sortBy);
        sortDirection$.next(direction);
      },
      setSearch: (search: string) => {
        search$.next(search);
        page$.next(1);
      },
      setFilters: (filters: Record<string, any>) => {
        filters$.next(filters);
        page$.next(1);
      },
      refresh: () => {
        // For static data, refresh doesn't need to do anything
      },
      reset: () => {
        page$.next(initialParams.page || 1);
        pageSize$.next(initialParams.pageSize || 10);
        sortBy$.next(initialParams.sortBy || '');
        sortDirection$.next(initialParams.sortDirection || 'asc');
        search$.next(initialParams.search || '');
        filters$.next(initialParams.filters || {});
      },
    };
  }
}
