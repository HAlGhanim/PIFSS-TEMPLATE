import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../components';
import { BaseService, TableService, ToastService } from '../../services';
import { TableAction, TableColumn, TableStateManager } from '../../interfaces';
import { DateUtils, CacheUtils } from '../../utils';

// Example data interface
interface Employee {
  id: number;
  civilId: string;
  name: string;
  department: string;
  position: string;
  salary: number;
  joinDate: string;
  isActive: boolean;
  email: string;
}

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, TableComponent],
  templateUrl: `./employee-list.component.html`,
})
export class EmployeeListComponent implements OnInit {
  private tableService = inject(TableService);
  private toastService = inject(ToastService);
  private baseService = inject(BaseService);

  // Table state manager for API data
  tableState!: TableStateManager<Employee>;

  // Table columns configuration
  columns: TableColumn[] = [
    {
      key: 'civilId',
      label: 'الرقم المدني',
      sortable: true,
      width: '130px',
    },
    {
      key: 'name',
      label: 'الاسم',
      sortable: true,
      width: '180px',
    },
    {
      key: 'department',
      label: 'القسم',
      sortable: true,
      width: '150px',
    },
    {
      key: 'position',
      label: 'المنصب',
      sortable: false,
      width: '150px',
    },
    {
      key: 'salary',
      label: 'الراتب',
      sortable: true,
      type: 'currency',
      width: '120px',
    },
    {
      key: 'joinDate',
      label: 'تاريخ الالتحاق',
      sortable: true,
      type: 'date',
      width: '120px',
      // Using DateUtils for custom formatting
      format: (value: string) => DateUtils.toDisplayString(value, 'en-US'),
    },
    {
      key: 'isActive',
      label: 'الحالة',
      sortable: true,
      type: 'boolean',
      width: '80px',
    },
  ];

  // Simple columns for static example
  simpleColumns: TableColumn[] = [
    {
      key: 'id',
      label: 'الرقم',
      sortable: true,
      width: '80px',
    },
    {
      key: 'name',
      label: 'الاسم',
      sortable: true,
    },
    {
      key: 'value',
      label: 'القيمة',
      sortable: true,
      type: 'number',
      align: 'left',
    },
  ];

  // Table actions - removed as per request
  actions: TableAction[] = [];

  // Static data for example
  staticData = [
    { id: 1, name: 'أحمد محمد', value: 1500 },
    { id: 2, name: 'فاطمة علي', value: 2000 },
    { id: 3, name: 'محمد سالم', value: 1800 },
    { id: 4, name: 'نورة خالد', value: 2200 },
    { id: 5, name: 'عبدالله أحمد', value: 1900 },
    { id: 6, name: 'مريم سعيد', value: 2100 },
    { id: 7, name: 'خالد عمر', value: 1700 },
    { id: 8, name: 'زينب حسن', value: 2300 },
  ];

  ngOnInit() {
    // Log cache status for debugging
    this.logCacheStatus();

    // For demonstration with static data
    this.initializeWithStaticData();

    // FOR PRODUCTION: Replace the above with this when you have a real API:
    // this.initializeWithAPI();
  }

  // Initialize with API (use this in production)
  private initializeWithAPI() {
    this.tableState = this.tableService.createTableState<Employee>(
      '/api/employees',
      {
        page: 1,
        pageSize: 10,
        sortBy: 'name',
        sortDirection: 'asc',
      }
    );
  }

  // Initialize with static data (for demo/development)
  private initializeWithStaticData() {
    const demoData: Employee[] = this.generateDemoEmployees();

    // Use static table state for demo
    this.tableState = this.tableService.createStaticTableState(demoData, {
      page: 1,
      pageSize: 10,
      sortBy: 'name',
      sortDirection: 'asc',
    });
  }

  // Generate demo employees with properly formatted dates
  private generateDemoEmployees(): Employee[] {
    const employees: Employee[] = [
      {
        id: 1,
        civilId: '123456789012',
        name: 'أحمد محمد السالم',
        department: 'تكنولوجيا المعلومات',
        position: 'مطور أول',
        salary: 2500,
        joinDate: DateUtils.toDateString(new Date('2020-01-15')),
        isActive: true,
        email: 'ahmad@pifss.gov.kw',
      },
      {
        id: 2,
        civilId: '234567890123',
        name: 'فاطمة علي الصباح',
        department: 'الموارد البشرية',
        position: 'مدير موارد بشرية',
        salary: 3000,
        joinDate: DateUtils.toDateString(new Date('2019-06-20')),
        isActive: true,
        email: 'fatima@pifss.gov.kw',
      },
      {
        id: 3,
        civilId: '345678901234',
        name: 'محمد سالم الكندري',
        department: 'المالية',
        position: 'محاسب',
        salary: 2200,
        joinDate: DateUtils.toDateString(new Date('2021-03-10')),
        isActive: false,
        email: 'mohammed@pifss.gov.kw',
      },
      {
        id: 4,
        civilId: '456789012345',
        name: 'نورة عبدالله العنزي',
        department: 'تكنولوجيا المعلومات',
        position: 'محلل نظم',
        salary: 2300,
        joinDate: DateUtils.toDateString(new Date('2020-08-01')),
        isActive: true,
        email: 'noura@pifss.gov.kw',
      },
      {
        id: 5,
        civilId: '567890123456',
        name: 'خالد فهد المطيري',
        department: 'العمليات',
        position: 'مدير عمليات',
        salary: 3200,
        joinDate: DateUtils.toDateString(new Date('2018-04-15')),
        isActive: true,
        email: 'khalid@pifss.gov.kw',
      },
      {
        id: 6,
        civilId: '678901234567',
        name: 'مريم سعد الرشيدي',
        department: 'الموارد البشرية',
        position: 'أخصائي موارد بشرية',
        salary: 2100,
        joinDate: DateUtils.toDateString(new Date('2021-11-20')),
        isActive: true,
        email: 'mariam@pifss.gov.kw',
      },
      {
        id: 7,
        civilId: '789012345678',
        name: 'عبدالرحمن حمد الشمري',
        department: 'المالية',
        position: 'مدير مالي',
        salary: 3500,
        joinDate: DateUtils.toDateString(new Date('2017-02-10')),
        isActive: true,
        email: 'abdulrahman@pifss.gov.kw',
      },
      {
        id: 8,
        civilId: '890123456789',
        name: 'هدى ناصر العجمي',
        department: 'تكنولوجيا المعلومات',
        position: 'مطور واجهات',
        salary: 2400,
        joinDate: DateUtils.toDateString(new Date('2020-05-15')),
        isActive: true,
        email: 'huda@pifss.gov.kw',
      },
      {
        id: 9,
        civilId: '901234567890',
        name: 'سالم محمد الدوسري',
        department: 'العمليات',
        position: 'محلل عمليات',
        salary: 2200,
        joinDate: DateUtils.toDateString(new Date('2021-09-01')),
        isActive: false,
        email: 'salem@pifss.gov.kw',
      },
      {
        id: 10,
        civilId: '012345678901',
        name: 'لطيفة أحمد الحربي',
        department: 'الموارد البشرية',
        position: 'منسق تدريب',
        salary: 2000,
        joinDate: DateUtils.toDateString(new Date('2022-01-15')),
        isActive: true,
        email: 'latifa@pifss.gov.kw',
      },
      {
        id: 11,
        civilId: '123450987654',
        name: 'يوسف علي القطان',
        department: 'تكنولوجيا المعلومات',
        position: 'مهندس شبكات',
        salary: 2600,
        joinDate: DateUtils.toDateString(new Date('2019-03-20')),
        isActive: true,
        email: 'yousef@pifss.gov.kw',
      },
      {
        id: 12,
        civilId: '234561098765',
        name: 'عائشة فيصل الجاسم',
        department: 'المالية',
        position: 'محاسب أول',
        salary: 2400,
        joinDate: DateUtils.toDateString(new Date('2020-10-05')),
        isActive: true,
        email: 'aisha@pifss.gov.kw',
      },
    ];

    return employees;
  }

  // Event handlers
  onPageChange(page: number) {
    console.log('Page changed:', page);
    this.tableState.setPage(page);
  }

  onPageSizeChange(pageSize: number) {
    console.log('Page size changed:', pageSize);
    this.tableState.setPageSize(pageSize);
  }

  onSortChange(sort: { sortBy: string; sortDirection: 'asc' | 'desc' }) {
    console.log('Sort changed:', sort);
    this.tableState.setSort(sort.sortBy, sort.sortDirection);
  }

  onSearchChange(search: string) {
    console.log('Search changed:', search);
    this.tableState.setSearch(search);
  }

  onSelectionChange(selected: Employee[]) {
    console.log('Selection changed:', selected);
  }

  onRowClick(row: Employee) {
    console.log('Row clicked:', row);
    this.viewEmployee(row);
  }

  onRefresh() {
    console.log('Refreshing data...');

    // Clear cache for employees endpoint if using API
    if (CacheUtils.isCachingEnabled()) {
      this.baseService.clearCacheForUrl('/api/employees');
      console.log('Cache cleared for employees');
    }

    this.tableState.refresh();
    this.toastService.showSuccess('تم تحديث البيانات');
  }

  // Action handlers
  viewEmployee(employee: Employee) {
    // Navigate to employee details page
  }

  editEmployee(employee: Employee) {
    console.log('Edit employee:', employee);
    this.toastService.showSuccess(`تعديل بيانات: ${employee.name}`);
    // Navigate to employee edit page
  }

  deleteEmployee(employee: Employee) {
    console.log('Delete employee:', employee);
    if (confirm(`هل تريد حذف الموظف: ${employee.name}؟`)) {
      // Invalidate cache for employees when deleting
      this.baseService.invalidateCacheForResource('employees');

      this.toastService.showSuccess(`تم حذف: ${employee.name}`);
      // Call delete API
      this.tableState.refresh();
    }
  }

  // Cache management methods
  private logCacheStatus() {
    if (CacheUtils.isCachingEnabled()) {
      console.log('Cache is enabled');
      const cacheStats = this.baseService.getCacheStats();
      console.log('Cache statistics:', cacheStats);
      console.log('Cache duration:', this.baseService.getCacheDurationInfo());
    } else {
      console.log('Cache is disabled');
    }
  }

  // Method to force clear all cache (useful for debugging)
  clearAllCache() {
    this.baseService.clearCache();
    this.toastService.showSuccess('تم مسح الذاكرة المؤقتة');
    this.tableState.refresh();
  }

  // Method to get date range parameters for API filtering
  getDateRangeParams(startDate?: Date | string, endDate?: Date | string) {
    return {
      ...DateUtils.createDateParams(startDate, 'StartDate'),
      ...DateUtils.createDateParams(endDate, 'EndDate'),
    };
  }
}
