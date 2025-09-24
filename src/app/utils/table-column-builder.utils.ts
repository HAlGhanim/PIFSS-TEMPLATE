import { TemplateRef } from '@angular/core';
import { TableColumn } from '../interfaces';

/**
 * Builder pattern for creating table columns with less verbosity
 * Provides a fluent API for table column configuration
 */
export class TableColumnBuilder<T = any> {
  private column: Partial<TableColumn> = {};

  /**
   * Create a new builder instance
   */
  static create<T = any>(key: keyof T | string): TableColumnBuilder<T> {
    const builder = new TableColumnBuilder<T>();
    builder.column.key = key as string;
    return builder;
  }

  /**
   * Set the column label
   */
  label(label: string): this {
    this.column.label = label;
    return this;
  }

  /**
   * Make the column sortable
   */
  sortable(sortable: boolean = true): this {
    this.column.sortable = sortable;
    return this;
  }

  /**
   * Set column width
   */
  width(width: string): this {
    this.column.width = width;
    return this;
  }

  /**
   * Set column alignment
   */
  align(align: 'left' | 'center' | 'right'): this {
    this.column.align = align;
    return this;
  }

  /**
   * Set column type
   */
  type(
    type: 'text' | 'number' | 'date' | 'currency' | 'boolean' | 'custom'
  ): this {
    this.column.type = type;
    return this;
  }

  /**
   * Set custom format function
   */
  format(formatFn: (value: any) => string): this {
    this.column.format = formatFn;
    return this;
  }

  /**
   * Set custom template
   */
  template(template: TemplateRef<any>): this {
    this.column.customTemplate = template;
    return this;
  }

  /**
   * Shorthand for text column
   */
  asText(): this {
    return this.type('text');
  }

  /**
   * Shorthand for number column
   */
  asNumber(): this {
    return this.type('number');
  }

  /**
   * Shorthand for currency column
   */
  asCurrency(): this {
    return this.type('currency');
  }

  /**
   * Shorthand for date column
   */
  asDate(): this {
    return this.type('date');
  }

  /**
   * Shorthand for boolean column
   */
  asBoolean(): this {
    return this.type('boolean');
  }

  /**
   * Build the final column configuration
   */
  build(): TableColumn {
    // Set default label if not provided
    if (!this.column.label && this.column.key) {
      this.column.label = this.humanizeKey(this.column.key);
    }

    // Validate required fields
    if (!this.column.key) {
      throw new Error('Column key is required');
    }

    return this.column as TableColumn;
  }

  /**
   * Convert key to human-readable label
   */
  private humanizeKey(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1') // Add space before capitals
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/^\w/, (c) => c.toUpperCase()) // Capitalize first letter
      .trim();
  }
}

/**
 * Factory class for creating common column configurations
 */
export class TableColumnFactory {
  /**
   * Create ID column
   */
  static id(key: string = 'id', label: string = 'ID'): TableColumn {
    return TableColumnBuilder.create(key)
      .label(label)
      .width('80px')
      .sortable()
      .asNumber()
      .build();
  }

  /**
   * Create name column
   */
  static name(key: string = 'name', label: string = 'Name'): TableColumn {
    return TableColumnBuilder.create(key)
      .label(label)
      .sortable()
      .asText()
      .build();
  }

  /**
   * Create email column
   */
  static email(key: string = 'email', label: string = 'Email'): TableColumn {
    return TableColumnBuilder.create(key)
      .label(label)
      .sortable()
      .asText()
      .format((value: string) => value?.toLowerCase())
      .build();
  }

  /**
   * Create date column with custom format
   */
  static date(
    key: string,
    label: string,
    formatFn?: (value: any) => string
  ): TableColumn {
    const builder = TableColumnBuilder.create(key)
      .label(label)
      .sortable()
      .asDate()
      .width('120px');

    if (formatFn) {
      builder.format(formatFn);
    }

    return builder.build();
  }

  /**
   * Create currency column
   */
  static currency(
    key: string,
    label: string,
    width: string = '120px'
  ): TableColumn {
    return TableColumnBuilder.create(key)
      .label(label)
      .sortable()
      .asCurrency()
      .width(width)
      .align('right')
      .build();
  }

  /**
   * Create boolean/status column
   */
  static boolean(
    key: string,
    label: string,
    trueLabel: string = 'Yes',
    falseLabel: string = 'No'
  ): TableColumn {
    return TableColumnBuilder.create(key)
      .label(label)
      .sortable()
      .asBoolean()
      .width('100px')
      .align('center')
      .format((value: boolean) => (value ? trueLabel : falseLabel))
      .build();
  }

  /**
   * Create action column (non-sortable, centered)
   */
  static actions(width: string = '100px'): TableColumn {
    return TableColumnBuilder.create('actions')
      .label('Actions')
      .width(width)
      .align('center')
      .sortable(false)
      .build();
  }
}

/**
 * Helper class for building multiple columns at once
 */
export class TableColumnsBuilder<T = any> {
  private columns: TableColumn[] = [];

  /**
   * Create a new instance
   */
  static create<T = any>(): TableColumnsBuilder<T> {
    return new TableColumnsBuilder<T>();
  }

  /**
   * Add a column using builder
   */
  add(
    builderFn: (builder: TableColumnBuilder<T>) => TableColumnBuilder<T>
  ): this {
    const builder = new TableColumnBuilder<T>();
    const configured = builderFn(builder);
    this.columns.push(configured.build());
    return this;
  }

  /**
   * Add a pre-built column
   */
  addColumn(column: TableColumn): this {
    this.columns.push(column);
    return this;
  }

  /**
   * Add multiple pre-built columns
   */
  addColumns(...columns: TableColumn[]): this {
    this.columns.push(...columns);
    return this;
  }

  /**
   * Add an ID column
   */
  addId(key: string = 'id', label: string = 'ID'): this {
    this.columns.push(TableColumnFactory.id(key, label));
    return this;
  }

  /**
   * Add a name column
   */
  addName(key: string = 'name', label: string = 'Name'): this {
    this.columns.push(TableColumnFactory.name(key, label));
    return this;
  }

  /**
   * Add an email column
   */
  addEmail(key: string = 'email', label: string = 'Email'): this {
    this.columns.push(TableColumnFactory.email(key, label));
    return this;
  }

  /**
   * Add a date column
   */
  addDate(key: string, label: string, formatFn?: (value: any) => string): this {
    this.columns.push(TableColumnFactory.date(key, label, formatFn));
    return this;
  }

  /**
   * Add a currency column
   */
  addCurrency(key: string, label: string, width?: string): this {
    this.columns.push(TableColumnFactory.currency(key, label, width));
    return this;
  }

  /**
   * Add a boolean column
   */
  addBoolean(
    key: string,
    label: string,
    trueLabel?: string,
    falseLabel?: string
  ): this {
    this.columns.push(
      TableColumnFactory.boolean(key, label, trueLabel, falseLabel)
    );
    return this;
  }

  /**
   * Add custom column with builder
   */
  addCustom(
    key: string,
    label: string,
    configFn?: (builder: TableColumnBuilder<T>) => TableColumnBuilder<T>
  ): this {
    const builder = TableColumnBuilder.create<T>(key).label(label);
    const configured = configFn ? configFn(builder) : builder;
    this.columns.push(configured.build());
    return this;
  }

  /**
   * Build the final columns array
   */
  build(): TableColumn[] {
    return this.columns;
  }
}

/**
 * Usage examples
 */
export class TableColumnExamples {
  // Single column with builder
  example1() {
    const column = TableColumnBuilder.create('name')
      .label('Full Name')
      .sortable()
      .width('200px')
      .build();
  }

  // Using factory for common columns
  example2() {
    const columns = [
      TableColumnFactory.id(),
      TableColumnFactory.name('fullName', 'الاسم الكامل'),
      TableColumnFactory.email(),
      TableColumnFactory.date('joinDate', 'تاريخ الالتحاق'),
      TableColumnFactory.currency('salary', 'الراتب'),
      TableColumnFactory.boolean('isActive', 'الحالة', 'نشط', 'غير نشط'),
    ];
  }

  // Building multiple columns with fluent API
  example3() {
    const columns = TableColumnsBuilder.create()
      .addId()
      .addName('fullName', 'الاسم الكامل')
      .addEmail()
      .addDate('joinDate', 'تاريخ الالتحاق')
      .addCurrency('salary', 'الراتب')
      .addBoolean('isActive', 'الحالة', 'نشط', 'غير نشط')
      .addCustom('department', 'القسم', (builder) =>
        builder.sortable().width('150px')
      )
      .build();
  }

  // Complex column with custom format
  example4() {
    const column = TableColumnBuilder.create('phoneNumber')
      .label('رقم الهاتف')
      .sortable()
      .width('130px')
      .format((value: string) => {
        if (!value) return '';
        // Format as: XXXX-XXXX
        return value.replace(/(\d{4})(\d{4})/, '$1-$2');
      })
      .build();
  }

  // Using with TypeScript type safety
  example5<T extends { id: number; name: string; email: string }>() {
    const columns = TableColumnsBuilder.create<T>()
      .add((builder) => builder.label('ID').sortable().width('80px').asNumber())
      .add((builder) => builder.label('Name').sortable().asText())
      .build();
  }
}
