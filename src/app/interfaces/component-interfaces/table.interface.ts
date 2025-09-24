import { Observable } from 'rxjs';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  type?: 'text' | 'number' | 'date' | 'currency' | 'boolean' | 'custom';
  format?: (value: any) => string;
  customTemplate?: any;
}

export interface TableConfig {
  columns: TableColumn[];
  data: any[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  pageSizeOptions?: number[];
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  searchable?: boolean;
  selectable?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  rowClick?: (row: any) => void;
  actions?: TableAction[];
}

export interface TableAction {
  icon?: string;
  label: string;
  handler: (row: any) => void;
  condition?: (row: any) => boolean;
  class?: string;
}

export interface TableState {
  page: number;
  pageSize: number;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  search: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

export interface TableQueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}

export interface TableStateManager<T> {
  data$: Observable<T[]>;
  totalItems$: Observable<number>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  currentState$: Observable<TableQueryParams>;

  setPage(page: number): void;
  setPageSize(pageSize: number): void;
  setSort(sortBy: string, direction: 'asc' | 'desc'): void;
  setSearch(search: string): void;
  setFilters(filters: Record<string, any>): void;
  refresh(): void;
  reset(): void;
}
