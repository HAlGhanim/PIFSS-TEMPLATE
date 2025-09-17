import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  output,
  signal,
  OnInit,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
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
  // Inputs
  columns = input.required<TableColumn[]>();
  data = input.required<any[]>();
  totalItems = input<number>(0);
  loading = input<boolean>(false);
  selectable = input<boolean>(false);
  searchable = input<boolean>(true);
  emptyMessage = input<string>('لا توجد بيانات للعرض');
  pageSizeOptions = input<number[]>([10, 25, 50, 100]);
  rowClickable = input<boolean>(false);
  actions = input<TableAction[]>([]);
  initialPageSize = input<number>(10); // New input for initial page size

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
    const start = (this.currentPage() - 1) * this.pageSize() + 1;
    return this.totalItems() > 0 ? start : 0;
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
      });
  }

  ngOnInit(): void {
    // Set initial page size from input
    const initialSize = this.initialPageSize();
    if (this.pageSizeOptions().includes(initialSize)) {
      this.pageSize.set(initialSize);
    }
  }

  onPageChange(page: number | string) {
    if (typeof page === 'string') return;

    this.currentPage.set(page);
    this.pageChange.emit(page);
    this.scrollToTop();
  }

  onPageSizeChange(event: Event) {
    const size = parseInt((event.target as HTMLSelectElement).value, 10);
    this.pageSize.set(size);
    this.currentPage.set(1); // Reset to first page
    this.pageSizeChange.emit(size);
  }

  onSort(column: TableColumn) {
    if (!column.sortable) return;

    if (this.sortBy() === column.key) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(column.key);
      this.sortDirection.set('asc');
    }

    this.sortChange.emit({
      sortBy: this.sortBy(),
      sortDirection: this.sortDirection(),
    });
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
  private scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  trackByIndex(index: number): number {
    return index;
  }

  trackByRow(index: number, row: any): any {
    return row.id || index;
  }
}
