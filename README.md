# PIFSS Angular Template

A modern, production-ready Angular 20 template specifically designed for the Public Institution for Social Security (PIFSS) Kuwait applications. This template provides a comprehensive foundation with pre-configured authentication, RTL support, intelligent caching, and a rich set of reusable components following PIFSS design standards.

## 🌟 Features

### Core Technologies

- **Angular 20** - Latest Angular framework with standalone components
- **Tailwind CSS v4** - Utility-first CSS framework with custom PIFSS theme
- **TypeScript 5.8** - Type-safe development
- **MSAL Authentication** - Azure AD/Entra ID integration for SSO
- **RxJS** - Reactive programming support

### Key Features

- ✅ **Arabic/RTL Support** - Full right-to-left layout with custom Arabic fonts (Taminat)
- ✅ **MSAL Authentication** - Pre-configured Azure AD with guards and interceptors
- ✅ **Smart Caching System** - Intelligent 30-second caching with automatic invalidation
- ✅ **Reusable Components** - Production-ready UI component library
- ✅ **Advanced Table Component** - Feature-rich data table with pagination, sorting, search, and actions
- ✅ **Form Validation** - Kuwait-specific validators (Civil ID, phone, currency)
- ✅ **Error Handling** - Global error interceptor with Arabic messages
- ✅ **Loading States** - Automatic loading indicators for HTTP requests
- ✅ **Toast Notifications** - Clean notification system with success/error states
- ✅ **File Download Service** - Utility for handling file downloads
- ✅ **Date Utilities** - Comprehensive date handling with Arabic support
- ✅ **Icon Service** - Centralized SVG icon management
- ✅ **Responsive Design** - Mobile-first approach with Tailwind CSS
- ✅ **Azure DevOps Ready** - Pre-configured pipeline YAML

## 📁 Project Structure

```
src/
├── app/
│   ├── components/           # Reusable UI components
│   │   ├── button/           # Custom button with loading states & icons
│   │   ├── card/             # Card container component
│   │   ├── container/        # Page container wrapper
│   │   ├── date-picker/      # Date picker with validation
│   │   ├── forms/            # Form-related components
│   │   │   ├── form-field/   # Form field wrapper with labels & errors
│   │   │   ├── form-input/   # Custom input component
│   │   │   └── form-select-group/ # Grouped select dropdown
│   │   ├── icons/            # Icon components
│   │   │   ├── pifss-logo/   # PIFSS logo (3 variants)
│   │   │   └── svg-icon/     # Dynamic SVG icon component
│   │   ├── navbar/           # Navigation bar with sidebar
│   │   ├── page-header/      # Page title header
│   │   ├── table/            # Advanced data table component
│   │   └── toast/            # Toast notification component
│   │
│   ├── config/               # Configuration files
│   │   └── auth.config.ts    # MSAL authentication config
│   │
│   ├── interceptors/         # HTTP interceptors
│   │   ├── error.interceptor.ts    # Global error handling
│   │   └── loading.interceptor.ts  # Loading state management
│   │
│   ├── interfaces/           # TypeScript interfaces
│   │   ├── app-interfaces/
│   │   │   └── cache.interface.ts
│   │   └── component-interfaces/
│   │       ├── icon.interface.ts
│   │       ├── navigation.interface.ts
│   │       ├── select-option.interface.ts
│   │       ├── table.interface.ts
│   │       └── toast.interface.ts
│   │
│   ├── resources/            # Static resources
│   │   └── endpoints.json    # API endpoint definitions
│   │
│   ├── services/             # Application services
│   │   ├── api-services/
│   │   │   └── base.service.ts     # Base HTTP service with caching
│   │   ├── app-services/
│   │   │   ├── date.service.ts     # Date manipulation service
│   │   │   ├── file-download.service.ts
│   │   │   ├── loading.service.ts
│   │   │   └── msal-auth.service.ts # Authentication service
│   │   └── component-services/
│   │       ├── icon.service.ts     # Icon management
│   │       ├── table.service.ts    # Table state management
│   │       └── toast.service.ts    # Toast notifications
│   │
│   ├── utils/                # Utility functions
│   │   ├── cache-key-builder.utils.ts  # Cache key generation
│   │   ├── CacheUtils.utils.ts         # Cache management utilities
│   │   ├── DateUtils.utils.ts          # Date manipulation utilities
│   │   ├── error-message.utils.ts      # Error message formatting
│   │   ├── http-params.utils.ts        # HTTP params builder
│   │   ├── table-column-builder.utils.ts # Table column factory
│   │   ├── apiValidationError.utils.ts # API error parsing
│   │   └── validators.utils.ts         # Custom form validators
│   │
│   ├── pages/                # Page components
│   │   ├── showcase/         # Component showcase page
│   │   └── employee-list/    # Table component example
│   │
│   ├── app.component.ts      # Root component
│   ├── app.config.ts         # App configuration
│   └── app.routes.ts         # Route definitions
│
├── assets/
│   └── fonts/                # Custom Arabic/English fonts
│       ├── Arabic/           # Taminat Arabic font
│       └── English/          # Taminat English font
│
├── environment.ts            # Development environment
└── environment.prod.ts       # Production environment
```

## 🚀 Getting Started

### Prerequisites

- Node.js 22.x or higher
- npm or yarn package manager
- Angular CLI (`npm install -g @angular/cli@20`)

### Installation & Project Setup

1. **Clone the repository**

   ```bash
   git clone [repository-url]
   cd PIFSS-Template
   ```

2. **Rename the project from PIFSS-Template to your project name**

   Update the following files with your project name (replace `YOUR-PROJECT-NAME` with your actual project name):

   **a. package.json**

   ```json
   {
     "name": "your-project-name",  // Change from "pifss-template"
     ...
   }
   ```

   **b. angular.json**

   ```json
   {
     "projects": {
       "YOUR-PROJECT-NAME": {  // Change from "PIFSS-Template"
         ...
       }
     }
   }
   ```

   **c. package-lock.json**

   - Search and replace all occurrences of `"pifss-template"` with `"your-project-name"`
   - Search and replace all occurrences of `"PIFSS-Template"` with `"YOUR-PROJECT-NAME"`

   **d. src/index.html**

   ```html
   <title>YOUR-PROJECT-NAME</title>
   <!-- Change from "PIFSSTemplate" -->
   ```

   **e. azure-pipelines.yml**

   ```yaml
   # Update the SourceFolder path
   SourceFolder: "dist/YOUR-PROJECT-NAME/browser"

   # Update the base href
   customCommand: "run build -- --configuration=production --base-href /YOUR-APP-PATH/"
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Configure MSAL Authentication**

   Update `src/environment.ts` and `src/environment.prod.ts`:

   ```typescript
   msal: {
     entraId: {
       clientId: 'YOUR-CLIENT-ID',  // Get from infrastructure team
       apiScopes: ['api://YOUR-CLIENT-ID/User.Read']
     }
   }
   ```

5. **Update API Base URL**

   ```typescript
   baseurl: "https://your-api-endpoint.com";
   ```

6. **Run the development server**
   ```bash
   npm start
   ```
   Navigate to `http://localhost:4200`

## 🔧 Configuration

### MSAL/Azure AD Setup

1. Contact your infrastructure team (specifically Nidheesh Nattiala) to:

   - Get your application's Client ID
   - Set up the User.Read scope
   - Configure redirect URIs

2. Update the authentication configuration in `src/app/config/auth.config.ts`

3. The tenant ID is pre-configured for PIFSS: `31819927-6989-4bd0-b5e5-81740d4154c3`

4. Uncomment MSAL-related code in:
   - `src/app/app.config.ts` - MSAL providers
   - `src/app/app.component.ts` - Authentication initialization
   - `src/app/components/navbar/navbar.component.ts` - User section
   - `src/app/app.routes.ts` - Route guards

### Adding New Routes

Update `src/app/app.routes.ts`:

```typescript
{
  path: 'your-route',
  title: 'عنوان الصفحة',
  canActivate: [MsalGuard], // After MSAL setup
  loadComponent: () => import('./pages/your-component').then(m => m.YourComponent)
}
```

### Adding Navigation Links

Update `src/app/components/navbar/navbar.component.ts`:

```typescript
links: NavigationLink[] = [
  {
    label: 'اسم الصفحة',
    path: '/your-route',
    icon: 'icon-name',
    badge: 'جديد',
    badgeColor: 'success'
  }
];
```

## 💾 Smart Caching System

The template includes an intelligent caching system that automatically caches GET requests for 30 seconds to improve performance and reduce server load.

### Features

- **Automatic Caching** - All GET requests cached for 30 seconds by default
- **Smart Invalidation** - Cache automatically invalidates when data is modified (POST/PUT/DELETE)
- **Memory Management** - Automatic cleanup of expired cache entries
- **Development Tools** - Built-in debugging and cache statistics
- **Configurable** - Easy to enable/disable and adjust cache duration

### How It Works

```typescript
// All GET requests are automatically cached
this.baseService.get("/api/employees"); // First call - hits server
this.baseService.get("/api/employees"); // Within 30 seconds - returns cached data

// Get fresh data (bypass cache)
this.baseService.getFresh("/api/employees");

// Clear cache
this.baseService.clearCache();
this.baseService.clearCacheForUrl("/api/employees");
this.baseService.invalidateCacheForResource("employees");
```

### Debugging Cache

```typescript
// Via localStorage
localStorage.setItem("disableCache", "true");
localStorage.setItem("verboseLogging", "true");

// Via URL parameter
//localhost:4200?noCache=true

// Get cache statistics
http: const stats = this.baseService.getCacheStats();
```

## 📦 Components Library

### Button Component

```html
<app-button text="نص الزر" [loading]="isLoading" [disabled]="isDisabled" [showIcon]="true" iconType="download" (btnClick)="handleClick()"> </app-button>
```

### Toast Notifications

```typescript
constructor(private toastService: ToastService) {}

this.toastService.showSuccess('Operation successful!');
this.toastService.showError('An error occurred');
this.toastService.showSuccess('Custom duration', 5000);
```

### Form Components

```html
<app-form-field label="العنوان" [required]="true" [showError]="hasError" [errorMessage]="errorMsg">
  <app-form-input formControlName="fieldName" type="text" placeholder="نص توضيحي"> </app-form-input>
</app-form-field>
```

### Date Picker

```html
<app-date-picker formControlName="date" [maxDate]="maxDate" [minDate]="minDate"> </app-date-picker>
```

### Select with Groups

```html
<app-form-select-group formControlName="department" placeholder="اختر القسم" [groups]="departmentGroups" [showIndex]="true"> </app-form-select-group>
```

## 📊 Table Component

The template includes a powerful, reusable table component with extensive features.

### Features

- ✅ Pagination with customizable page sizes
- ✅ Column sorting (ascending/descending)
- ✅ Real-time search with Arabic text normalization
- ✅ Row selection with checkboxes
- ✅ Row actions with conditional rendering
- ✅ Loading states with overlay
- ✅ Custom cell templates
- ✅ Responsive design
- ✅ Static & dynamic data support

### Basic Usage

```typescript
// Define columns using the builder pattern
columns: TableColumn[] = TableColumnsBuilder.create<Employee>()
  .addCustom('civilId', 'الرقم المدني', builder =>
    builder.sortable().width('130px'))
  .addName('name', 'الاسم')
  .addCurrency('salary', 'الراتب', '120px')
  .addDate('joinDate', 'تاريخ الالتحاق')
  .addBoolean('isActive', 'الحالة', 'نشط', 'غير نشط')
  .build();

// Create table state with API
tableState = this.tableService.createTableState<Employee>(
  '/api/employees',
  { page: 1, pageSize: 10, sortBy: 'name', sortDirection: 'asc' }
);
```

```html
<app-table [columns]="columns" [data]="(tableState.data$ | async) || []" [totalItems]="(tableState.totalItems$ | async) || 0" [loading]="(tableState.loading$ | async) || false" [selectable]="true" [searchable]="true" (pageChange)="tableState.setPage($event)" (sortChange)="tableState.setSort($event.sortBy, $event.sortDirection)" (searchChange)="tableState.setSearch($event)" (refresh)="tableState.refresh()" />
```

## 🛠️ Services

### BaseService

Base service for API communication with automatic caching:

```typescript
// GET request (cached for 30 seconds)
baseService.get<T>(url, headers, params);

// GET fresh data (bypass cache)
baseService.getFresh<T>(url, headers, params);

// POST/PUT/DELETE (invalidates related cache)
baseService.post<T>(url, body, headers, params);
baseService.put<T>(url, body, headers, params);
baseService.delete<T>(url, headers, params);

// Cache management
baseService.clearCache();
baseService.getCacheStats();
```

### DateService

Comprehensive date manipulation service:

```typescript
dateService.getToday();
dateService.formatForDisplay(date, "ar-KW");
dateService.formatRange(startDate, endDate);
dateService.addDays(date, 5);
dateService.getDaysBetween(date1, date2);
dateService.isValid(dateString);
dateService.createRangeParams(startDate, endDate);
```

### TableService

Manages table state with API integration:

```typescript
// Create table with API
tableService.createTableState<T>(endpoint, initialParams);

// Create table with static data
tableService.createStaticTableState<T>(data, initialParams);
```

### IconService

Centralized SVG icon management:

```typescript
iconService.getIcon("users");
iconService.hasIcon("custom-icon");
iconService.getAllIconNames();
```

## 🔍 Utilities

### Custom Validators

Kuwait-specific form validators:

```typescript
CustomValidators.kuwaitCivilId(); // 12-digit Civil ID
CustomValidators.KuwaitPhoneNumber(); // 8-digit phone number
CustomValidators.kuwaitDinar(); // KWD format (X.XXX)
CustomValidators.dateRange("start", "end");
CustomValidators.arabicText();
CustomValidators.englishText();
CustomValidators.positiveNumber();
```

### Error Message Utils

Centralized error message handling:

```typescript
ErrorMessageUtils.getErrorMessage(control, fieldName);
ErrorMessageUtils.hasError(control);
ErrorMessageUtils.getAllFormErrors(form);
```

### Table Column Builder

Fluent API for building table columns:

```typescript
TableColumnsBuilder.create<T>().addId().addName("fullName", "الاسم الكامل").addEmail().addDate("joinDate", "تاريخ الالتحاق").addCurrency("salary", "الراتب").addBoolean("isActive", "الحالة", "نشط", "غير نشط").build();
```

### Cache Key Builder

Consistent cache key generation:

```typescript
CacheKeyBuilder.create().addUrl("/api/employees").addParams({ department: "IT" }).addPagination(1, 10).build();
```

### HTTP Params Utils

Utility for building HTTP parameters:

```typescript
HttpParamsUtils.buildTableParams({
  page: 1,
  pageSize: 10,
  sortBy: "name",
  sortDirection: "asc",
  search: "john",
  filters: { status: "active" },
});
```

## 🎨 Styling

### Tailwind Configuration

- Custom PIFSS theme with primary color: `hsl(203.59 100% 28.43%)`
- Custom Arabic (Taminat Arabic) and English (Taminat English) fonts
- RTL-ready utility classes
- Pre-defined component styles

### Custom CSS Classes

```css
.form-input-rtl    /* RTL text input */
/* RTL text input */
.btn-primary        /* Primary button style */
.btn-secondary      /* Secondary button style */
.card               /* Card container */
.form-grid          /* Form grid layout */
.alert-success      /* Success alert */
.alert-error; /* Error alert */
```

## 🧪 Example Pages

### Showcase Page (`/showcase`)

Comprehensive demonstration of all components including:

- Toast notifications with various states
- Complete form with Kuwait-specific validation
- All button variations and states
- Statistics cards
- Form components with error handling

### Employee List Page (`/employee-list`)

Complete table implementation example featuring:

- Pagination with customizable page sizes
- Column sorting
- Real-time search with Arabic support
- Row selection
- Loading states
- Static and dynamic data examples
- Cache management integration

## 🚢 Deployment

### Azure DevOps Pipeline

1. Update the base href in `azure-pipelines.yml`:

   ```yaml
   customCommand: "run build -- --configuration=production --base-href /YOUR-APP-PATH/"
   ```

2. Update the project name:
   ```yaml
   SourceFolder: "dist/YOUR-PROJECT-NAME/browser"
   ```

### Build for Production

```bash
npm run build -- --configuration=production
```

## 📝 Environment Variables

### Development (`environment.ts`)

```typescript
{
  production: false,
  baseurl: 'http://localhost:5000',
  msal: {
    redirectUri: 'http://localhost:4200',
    entraId: {
      clientId: 'YOUR-CLIENT-ID',
      apiScopes: ['api://YOUR-CLIENT-ID/User.Read']
    }
  }
}
```

### Production (`environment.prod.ts`)

```typescript
{
  production: true,
  baseurl: 'https://api.production.com',
  msal: {
    redirectUri: 'https://your-app.pifss.gov.kw',
    entraId: {
      clientId: 'YOUR-CLIENT-ID',
      apiScopes: ['api://YOUR-CLIENT-ID/User.Read']
    }
  }
}
```

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Test thoroughly with Arabic/RTL content
4. Ensure caching works correctly
5. Submit a pull request

## 🆘 Support

For technical support or questions:

- **Infrastructure/MSAL**: Nidheesh Nattiala - Nidheesh@pifss.gov.kw
- **Infrastructure/Pipelines - CI/CD**: Abdulmutalib AlHaddad - AHAlhaddad@pifss.gov.kw

## 📋 Quick Reference

### Common Commands

```bash
# Development server
npm start

# Build for production
npm run build -- --configuration=production

# Run tests
npm test

# Clear cache (in browser console)
localStorage.setItem('disableCache', 'true')

# Enable verbose logging
localStorage.setItem('verboseLogging', 'true')
```

### Project Setup Checklist

- [ ] Clone and rename project from PIFSS-Template
- [ ] Configure MSAL authentication with infrastructure team
- [ ] Update API base URL in environment files
- [ ] Configure Azure Pipeline settings
- [ ] Test RTL/Arabic support
- [ ] Set up navigation links in navbar
- [ ] Configure routes with appropriate guards
- [ ] Test table component with your API endpoints
- [ ] Verify caching behavior with your data
- [ ] Implement custom validators as needed
- [ ] Configure toast notifications
- [ ] Test file downloads if needed

### Key Features Summary

- 🚀 **Performance**: 30-second intelligent caching system
- 🔐 **Security**: MSAL/Azure AD authentication ready
- 🌍 **Localization**: Full Arabic/RTL support with custom fonts
- 📊 **Data Management**: Advanced table with state management
- 🎨 **UI/UX**: Comprehensive component library with Tailwind CSS
- 🛠️ **Developer Experience**: TypeScript, standalone components, utilities
- 📱 **Responsive**: Mobile-first design approach
- 🔍 **Validation**: Kuwait-specific form validators
- 📦 **Architecture**: Clean, modular structure with separation of concerns

---

## Version History

- **v1.0.0** - Initial release with core components and MSAL authentication
- **v1.1.0** - Added intelligent caching system
- **v1.2.0** - Enhanced table component with builder pattern
- **v1.3.0** - Added comprehensive date and icon services
- **v1.4.0** - Improved error handling and validation utilities
