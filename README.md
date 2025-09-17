# PIFSS Angular Template

A modern, production-ready Angular 20 template specifically designed for the Public Institution for Social Security (PIFSS) Kuwait applications. This template provides a comprehensive foundation with pre-configured authentication, RTL support, and reusable components following PIFSS design standards.

## 🌟 Features

### Core Technologies

- **Angular 20** - Latest Angular framework with standalone components
- **Tailwind CSS v4** - Utility-first CSS framework with custom PIFSS theme
- **TypeScript 5.8** - Type-safe development
- **MSAL Authentication** - Azure AD/Entra ID integration for SSO
- **RxJS** - Reactive programming support

### Key Features

- ✅ **Arabic/RTL Support** - Full right-to-left layout support with custom Arabic fonts
- ✅ **MSAL Authentication** - Pre-configured Azure AD authentication with guards and interceptors
- ✅ **Reusable Components** - Production-ready UI components library
- ✅ **Form Validation** - Custom validators for Kuwait-specific data (Civil ID, etc.)
- ✅ **Error Handling** - Global error interceptor with Arabic messages
- ✅ **Loading States** - Automatic loading indicators for HTTP requests
- ✅ **Toast Notifications** - Clean toast notification system
- ✅ **File Download Service** - Utility for handling file downloads
- ✅ **Responsive Design** - Mobile-first approach with Tailwind CSS
- ✅ **Azure DevOps Ready** - Pre-configured pipeline YAML

## 📁 Project Structure

```
src/
├── app/
│   ├── components/           # Reusable UI components
│   │   ├── button/           # Custom button with loading states
│   │   ├── card/             # Card container component
│   │   ├── date-picker/      # Date picker with validation
│   │   ├── forms/            # Form-related components
│   │   │   ├── form-field/   # Form field wrapper with labels
│   │   │   ├── form-input/   # Custom input component
│   │   │   └── form-select-group/ # Grouped select dropdown
│   │   ├── icons/            # PIFSS logo components
│   │   ├── navbar/           # Navigation bar with sidebar
│   │   ├── page-header/      # Page title header
│   │   ├── report-container/ # Report page wrapper
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
│   │   ├── select/           # Select component interfaces
│   │   └── toast/            # Toast notification interfaces
│   │
│   ├── resources/            # Static resources
│   │   └── endpoints.json    # API endpoint definitions
│   │
│   ├── services/             # Application services
│   │   ├── api-services/     # API communication services
│   │   │   └── base.service.ts
│   │   ├── app-services/     # Application-level services
│   │   │   ├── file-download.service.ts
│   │   │   ├── loading.service.ts
│   │   │   └── msal-auth.service.ts
│   │   └── component-services/
│   │       └── toast.service.ts    # Toast notification service
│   │
│   ├── utils/                # Utility functions
│   │   ├── DateUtils.class.ts      # Date manipulation utilities
│   │   ├── apiValidationError.ts   # API error parsing
│   │   └── validators.ts           # Custom form validators
│   │
│   ├── pages/                # Page components
│   │   └── showcase.component.ts   # Component showcase page
│   │
│   ├── app.component.ts      # Root component
│   ├── app.config.ts         # App configuration
│   └── app.routes.ts         # Route definitions
│
├── assets/
│   └── fonts/                # Custom Arabic/English fonts
│       ├── Arabic/
│       └── English/
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
   SourceFolder: "dist/YOUR-PROJECT-NAME/browser" # Change from "dist/YOUR-PROJECT-NAME/browser"

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

### Adding New Routes

Update `src/app/app.routes.ts`:

```typescript
{
  path: 'your-route',
  title: 'عنوان الصفحة',
  canActivate: [MsalGuard], // Uncomment after MSAL setup
  loadComponent: () => import('./pages/your-component').then(m => m.YourComponent)
}
```

### Adding Navigation Links

Update the links array in `src/app/components/navbar/navbar.component.ts`:

```typescript
links = [
  {
    label: "اسم الصفحة",
    path: "/your-route",
    icon: "icon-name",
  },
];
```

Navbar Example:
![Screenshot](./src/assets/images/Navbar-example.png)

## 📦 Available Components

### Toast Notifications

```typescript
// In your component
import { ToastService } from './services';

constructor(private toastService: ToastService) {}

// Show success toast
this.toastService.showSuccess('Operation completed successfully!');

// Show error toast
this.toastService.showError('An error occurred');

// Show with custom duration (in milliseconds)
this.toastService.showSuccess('Message', 5000);
```

### Button Component

```html
<app-button text="نص الزر" [loading]="isLoading" [disabled]="isDisabled" (btnClick)="handleClick()" [showIcon]="true" iconType="download"> </app-button>
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

## 🛠️ Custom Validators

The template includes Kuwait-specific validators:

- **Kuwait Civil ID**: Validates 12-digit Kuwait civil IDs
- **Date Range**: Ensures end date is after start date
- **Positive Number**: Validates positive numeric values
- **Arabic Text**: Validates Arabic-only text input
- **English Text**: Validates English-only text input

Usage example:

```typescript
form = this.fb.group(
  {
    civilId: ["", [Validators.required, CustomValidators.kuwaitCivilId()]],
    startDate: ["", Validators.required],
    endDate: ["", Validators.required],
  },
  {
    validators: CustomValidators.dateRange("startDate", "endDate"),
  }
);
```

## 🎨 Styling

### Tailwind Configuration

The project uses Tailwind CSS v4 with custom PIFSS theme colors:

- Primary: `hsl(203.59 100% 28.43%)` - PIFSS Blue
- Custom utility classes for RTL support
- Pre-defined form styles

### Custom CSS Classes

- `.form-input-rtl` - RTL text input
- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.card` - Card container style
- `.form-grid` - Form grid layout

## 📋 Services

### ToastService

Display toast notifications:

```typescript
// Inject the service
private toastService = inject(ToastService);

// Show notifications
toastService.showSuccess("Success message");
toastService.showError("Error message");

// Clear all toasts
toastService.clearAll();
```

### MsalAuthService

Handles authentication operations:

```typescript
authService.isAuthenticated();
authService.getUserDisplayName();
authService.loginRedirect();
authService.logoutRedirect();
```

### FileDownloadService

Handles file downloads:

```typescript
fileDownloadService.downloadFile(blob, filename);
fileDownloadService.getFileNameFromResponse(response);
```

### LoadingService

Loading state management (automatically handled by interceptor):

```typescript
loadingService.isLoading(); // Returns signal<boolean>
```

## 🚢 Deployment

### Azure DevOps Pipeline

The project includes a pre-configured pipeline (`azure-pipelines.yml`):

1. Update the base href in the pipeline:

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
  baseurl: 'http://localhost:5000',  // Your local API
  msal: {
    local: {
      redirectUri: 'http://localhost:4200'
    }
  }
}
```

### Production (`environment.prod.ts`)

```typescript
{
  production: true,
  baseurl: 'https://api.production.com',  // Production API
  msal: {
    dev: {
      redirectUri: 'https://your-app.pifss.gov.kw'
    }
  }
}
```

## 🧪 Example Page

The template includes a comprehensive showcase page demonstrating all components. To view it:

1. Run the development server: `npm start`
2. Navigate to `http://localhost:4200/showcase`

The showcase includes:

- Toast notification examples
- Complete form with validation
- All button states
- Statistics cards
- Form components with error handling

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Test thoroughly with Arabic/RTL content
4. Submit a pull request

## 🆘 Support

For technical support or questions:

- Infrastructure/MSAL: Nidheesh Nattiala - Nidheesh@pifss.gov.kw
- Infrastructure/Pipelines - CI/CD: Abdulmutalib AlHaddad - AHAlhaddad@pifss.gov.kw

---

## Quick Reference

### Common Commands

```bash
# Development server
npm start

# Build for production
npm run build -- --configuration=production

# Run tests
npm test
```

### Project Checklist

- [ ] Rename project from PIFSS-Template
- [ ] Configure MSAL authentication
- [ ] Update API base URL
- [ ] Update Azure Pipeline configuration
- [ ] Test RTL/Arabic support
- [ ] Configure navigation links
- [ ] Set up routes with guards
