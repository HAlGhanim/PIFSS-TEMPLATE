import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  OnInit,
} from '@angular/core';
import { FormControl, NgModel, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { TableAction, TableColumn } from '../../interfaces';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './table.component.html',
  styles: [
    `
      :host {
        display: block;
      }

      table {
        direction: rtl;
      }

      .table-container {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }

      .table-container::-webkit-scrollbar {
        height: 8px;
      }

      .table-container::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
      }

      .table-container::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 10px;
      }

      .table-container::-webkit-scrollbar-thumb:hover {
        background: #555;
      }

      .sort-icon {
        transition: transform 0.2s ease;
      }

      .sort-icon.asc {
        transform: rotate(180deg);
      }

      .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      .spinner {
        animation: spin 1s linear infinite;
      }

      .checkbox-cell {
        width: 40px;
        min-width: 40px;
      }

      .action-cell {
        width: 100px;
        min-width: 100px;
      }

      tr {
        transition: background-color 0.2s ease;
      }

      tbody tr:hover {
        background-color: #f9fafb;
      }

      .pagination-button {
        transition: all 0.2s ease;
      }

      .pagination-button:not(:disabled):hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
    `,
  ],
})
export class TableComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Inputs
  columns = input.required<TableColumn[]>();
  data = input.required<any[]>();
  totalItems = input<number>(0);
  loading = input<boolean>(false);
  selectable = input<boolean>(false);
  searchable = input<boolean>(true);
  emptyMessage = input<string>('لا توجد بيانات للعرض');
  pageSizeOptions = input<number[]>([10, 25, 50, 100]);
  syncWithUrl = input<boolean>(true);
  rowClickable = input<boolean>(false);
  actions = input<TableAction[]>([]);

  // Outputs
  pageChange = output<number>();
  pageSizeChange = output<number>();
  sortChange = output<{ sortBy: string; sortDirection: 'asc' | 'desc' }>();
  searchChange = output<string>();
  selectionChange = output<any[]>();
  rowClick = output<any>();
  refresh = output<void>();

  // State
  currentPage = signal(1);
  pageSize = signal(10);
  sortBy = signal<string>('');
  sortDirection = signal<'asc' | 'desc'>('asc');
  searchControl = new FormControl('');
  selectedRows = signal<Set<any>>(new Set());
  allRowsSelected = signal(false);

  // Computed values
  totalPages = computed(() => {
    const total = this.totalItems();
    const size = this.pageSize();
    return Math.ceil(total / size);
  });

  startItem = computed(() => {
    return (this.currentPage() - 1) * this.pageSize() + 1;
  });

  endItem = computed(() => {
    const end = this.currentPage() * this.pageSize();
    return Math.min(end, this.totalItems());
  });

  pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= total; i++) {
      if (
        i === 1 ||
        i === total ||
        (i >= current - delta && i <= current + delta)
      ) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  });

  constructor() {
    // Setup search debounce
    this.searchControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        this.onSearch(value || '');
        if (this.syncWithUrl()) {
          this.updateUrl();
        }
      });
  }

  ngOnInit(): void {
    // Initialize from URL on component init
    if (this.syncWithUrl()) {
      this.initializeFromUrl();
    }

    // Setup effect after initialization
    effect(() => {
      if (this.syncWithUrl()) {
        // Access all reactive values to track them
        const page = this.currentPage();
        const size = this.pageSize();
        const sort = this.sortBy();
        const dir = this.sortDirection();

        // Update URL
        this.updateUrl();
      }
    });
  }

  private initializeFromUrl() {
    const params = this.route.snapshot.queryParams;

    if (params['page']) {
      const page = parseInt(params['page'], 10);
      this.currentPage.set(page);
      // Emit the change to parent component
      setTimeout(() => this.pageChange.emit(page), 0);
    }
    if (params['pageSize']) {
      const pageSize = parseInt(params['pageSize'], 10);
      this.pageSize.set(pageSize);
      // Emit the change to parent component
      setTimeout(() => this.pageSizeChange.emit(pageSize), 0);
    }
    if (params['sortBy']) {
      this.sortBy.set(params['sortBy']);
      if (params['sortDirection']) {
        this.sortDirection.set(params['sortDirection'] as 'asc' | 'desc');
      }
      // Emit the change to parent component
      setTimeout(
        () =>
          this.sortChange.emit({
            sortBy: this.sortBy(),
            sortDirection: this.sortDirection(),
          }),
        0
      );
    }
    if (params['search']) {
      this.searchControl.setValue(params['search'], { emitEvent: false });
      // Emit the change to parent component
      setTimeout(() => this.searchChange.emit(params['search']), 0);
    }
  }

  private updateUrl() {
    if (!this.syncWithUrl()) return;

    const queryParams: any = {};

    // Always include all params to ensure they're properly tracked
    queryParams.page = this.currentPage();
    queryParams.pageSize = this.pageSize();

    if (this.sortBy()) {
      queryParams.sortBy = this.sortBy();
      queryParams.sortDirection = this.sortDirection();
    }

    const searchValue = this.searchControl.value;
    if (searchValue) {
      queryParams.search = searchValue;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'replace', // Changed from 'merge' to 'replace'
    });
  }

  onPageChange(page: number | string) {
    if (typeof page === 'string') return;

    this.currentPage.set(page);
    this.pageChange.emit(page);
    this.scrollToTop();

    if (this.syncWithUrl()) {
      this.updateUrl();
    }
  }

  onPageSizeChange(event: Event) {
    const size = parseInt((event.target as HTMLSelectElement).value, 10);
    this.pageSize.set(size);
    this.currentPage.set(1); // Reset to first page
    this.pageSizeChange.emit(size);

    if (this.syncWithUrl()) {
      this.updateUrl();
    }
  }

  onSort(column: TableColumn) {
    if (!column.sortable) return;

    if (this.sortBy() === column.key) {
      // Toggle direction
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      // New column
      this.sortBy.set(column.key);
      this.sortDirection.set('asc');
    }

    this.sortChange.emit({
      sortBy: this.sortBy(),
      sortDirection: this.sortDirection(),
    });

    if (this.syncWithUrl()) {
      this.updateUrl();
    }
  }

  onSearch(value: string) {
    this.currentPage.set(1); // Reset to first page
    this.searchChange.emit(value);
  }

  onRowSelect(row: any, event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    const selected = new Set(this.selectedRows());
    if (selected.has(row)) {
      selected.delete(row);
    } else {
      selected.add(row);
    }
    this.selectedRows.set(selected);
    this.selectionChange.emit(Array.from(selected));
    this.updateAllRowsSelected();
  }

  onSelectAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const selected = new Set<any>();

    if (checked) {
      this.data().forEach((row) => selected.add(row));
    }

    this.selectedRows.set(selected);
    this.allRowsSelected.set(checked);
    this.selectionChange.emit(Array.from(selected));
  }

  private updateAllRowsSelected() {
    const allSelected =
      this.data().length > 0 &&
      this.data().every((row) => this.selectedRows().has(row));
    this.allRowsSelected.set(allSelected);
  }

  isSelected(row: any): boolean {
    return this.selectedRows().has(row);
  }

  onRowClick(row: any) {
    if (this.rowClickable()) {
      this.rowClick.emit(row);
    }
  }

  onRefresh() {
    this.refresh.emit();
  }

  formatCellValue(column: TableColumn, value: any): string {
    if (column.format) {
      return column.format(value);
    }

    switch (column.type) {
      case 'date':
        return value ? new Date(value).toLocaleDateString('en-US') : '';
      case 'currency':
        return value
          ? new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'KWD',
              minimumFractionDigits: 3,
            }).format(value)
          : '';
      case 'number':
        return value ? new Intl.NumberFormat('en-US').format(value) : '';
      case 'boolean':
        return value ? 'نعم' : 'لا';
      default:
        return value?.toString() || '';
    }
  }

  getTextAlign(column: TableColumn): string {
    // Always return text-right for RTL layout
    return 'text-right';
  }

  private scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Helper for tracking
  trackByIndex(index: number): number {
    return index;
  }

  trackByRow(index: number, row: any): any {
    return row.id || index;
  }
}
