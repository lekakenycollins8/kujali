# Kujali - Quick Reference Guide

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Start development (app + emulators)
npm run run-develop

# Start only Angular app
npm run start

# Start only Firebase emulators
npm run start-firebase-emulators

# Build for production
npm run build-kujali-app

# Deploy to Firebase
npm run deploy-kujali
```

## 📁 Project Structure Quick Map

```
kujali/
├── apps/
│   ├── kujali/              # Frontend Angular app
│   └── kujali-functions/    # Backend Firebase Functions
├── libs/
│   ├── elements/            # UI components (buttons, forms, layouts)
│   ├── features/            # Feature modules (dashboard, budgets, CRM)
│   ├── model/               # Data interfaces & types
│   ├── state/               # State management (stores, services)
│   ├── functions/           # Backend function logic
│   └── util/                # Utility libraries (iote, ngfi)
└── demo-data/               # Firebase emulator demo data
```

## 🔑 Key Concepts

### 1. Path Aliases
```typescript
// Use these imports instead of relative paths:
import { UserStore } from '@app/state/user';
import { Budget } from '@app/model/finance/planning/budgets';
import { BudgetsStateModule } from '@app/state/finance/budgetting/budgets';
```

### 2. Module Types

| Type | Location | Purpose | Example |
|------|----------|---------|---------|
| **Elements** | `libs/elements/` | Reusable UI components | Forms, buttons, layouts |
| **Features** | `libs/features/` | Business features | Dashboard, budgets, CRM |
| **Models** | `libs/model/` | Data structures | Budget, User, Invoice |
| **State** | `libs/state/` | Data management | UserStore, BudgetStore |
| **Functions** | `libs/functions/` | Backend logic | Budget calculations |

### 3. State Management Pattern

```typescript
// 1. Define Model (libs/model/)
export interface Budget extends IObject {
  name: string;
  orgId: string;
  // ...
}

// 2. Create Store (libs/state/)
@Injectable({ providedIn: 'root' })
export class BudgetStore extends Store<Budget> {
  getBudgets(): Observable<Budget[]> {
    // ...
  }
}

// 3. Use in Component (libs/features/)
export class BudgetComponent {
  budgets$ = this.budgetStore.getBudgets();
  
  constructor(private budgetStore: BudgetStore) {}
}
```

## 🗺️ Feature Map

### Authentication & Users
- **Login**: `libs/features/auth/login/`
- **User State**: `libs/state/user/`
- **User Model**: `libs/model/common/user/`

### Dashboard
- **Main Dashboard**: `libs/features/dashboard/main/`

### Budgeting
- **Budget List**: `libs/features/budgetting/budgets/`
- **Budget Explorer**: `libs/features/budgetting/budget-explorer/`
- **Budget Planning**: `libs/features/budgetting/budget-planning/`
- **Burn Chart**: `libs/features/budgetting/budget-explorer-burnchart/`
- **Budget State**: `libs/state/finance/budgetting/budgets/`
- **Budget Model**: `libs/model/finance/planning/budgets/`

### CRM (Business)
- **Companies**: `libs/features/finance/business/companies/`
- **Contacts**: `libs/features/finance/business/contacts/`
- **Opportunities**: `libs/features/finance/business/opportunities/`
- **Invoices**: `libs/features/finance/business/invoices/`

### Operations
- **Expenses**: `libs/features/finance/operations/expenses/`
- **Payments**: `libs/features/finance/operations/payments/`
- **Budgets**: `libs/features/finance/operations/budgets/`

### Banking
- **Banking Main**: `libs/features/finance/banking/main/`
- **Activate Banking**: `libs/features/finance/banking/activate-banking/`
- **Allocations**: `libs/features/finance/banking/allocations/`

## 🛠️ Common Tasks

### 1. Find a Feature
```bash
# Search for a specific feature
find libs/features -name "*budget*" -type d

# List all feature modules
ls libs/features/
```

### 2. Find a Model
```bash
# Search for a model
find libs/model -name "*.interface.ts" | grep budget

# List all models
ls libs/model/
```

### 3. Find State Management
```bash
# Find a store
find libs/state -name "*.store.ts" | grep budget

# List all state modules
ls libs/state/
```

### 4. Add a New Route
Edit `apps/kujali/src/app/app.routing.module.ts`:
```typescript
{
  path: 'my-feature',
  loadChildren: () => import('@app/features/my-feature').then(m => m.MyFeatureModule),
  canActivate: [IsLoggedInGuard]
}
```

### 5. Create a New Component
```bash
# Generate component in a library
nx generate @nrwl/angular:component my-component --project=my-library
```

### 6. Run Tests
```bash
# Test specific project
nx test my-library

# Test all
nx test

# E2E tests
nx e2e kujali-e2e
```

### 7. Check Dependencies
```bash
# See project dependency graph
nx graph

# See affected projects
nx affected:graph
```

## 🔍 Finding Things

### By Feature Area

| What | Where |
|------|-------|
| Budget UI | `libs/features/budgetting/` |
| Budget Logic | `libs/state/finance/budgetting/` |
| Budget Data | `libs/model/finance/planning/` |
| Budget Functions | `libs/functions/finance/budgeting/` |

### By File Type

| Type | Pattern | Example |
|------|---------|---------|
| Component | `*.component.ts` | `budget-list.component.ts` |
| Service | `*.service.ts` | `budget.service.ts` |
| Store | `*.store.ts` | `budget.store.ts` |
| Model | `*.interface.ts` | `budget.interface.ts` |
| Module | `*.module.ts` | `budgets.module.ts` |
| Page | `*.page.ts` | `dashboard.page.ts` |

## 🔐 Environment Setup

### 1. Create Environment Files

**Frontend** (`apps/kujali/src/environments/environment.ts`):
```typescript
export const environment = {
  production: false,
  useEmulators: true,
  firebase: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_ID",
    appId: "YOUR_APP_ID"
  },
  project: {
    name: 'Kujali'
  }
}
```

**Backend** (`apps/kujali-functions/src/environments/environment.ts`):
```typescript
export const environment = {
  production: false,
  firebase: {
    // Same as frontend
  }
}
```

### 2. Firebase Configuration
```bash
# Login to Firebase
firebase login

# Initialize emulators
firebase init emulators

# Start emulators
firebase emulators:start --import=demo-data
```

## 📊 Data Models Quick Reference

### Core Models

```typescript
// User
interface KuUser extends User {
  roles: KuUserRoles;
  profile: KuUserProfile;
}

// Organization
interface Organisation extends IObject {
  name: string;
  users: string[];
  bankingInfo: OrgBankingInfo;
  // ...
}

// Budget
interface Budget extends IObject {
  name: string;
  orgId: string;
  status: BudgetStatus;
  startYear: number;
  startMonth: number;
  duration: number;
  // ...
}

// Invoice
interface Invoice extends IObject {
  number: string;
  amount: number;
  dueDate: Date;
  status: InvoiceStatus;
  // ...
}

// Payment
interface Payment extends IObject {
  amount: number;
  date: Date;
  reference: string;
  // ...
}
```

## 🎯 Routing Structure

```
/ → /home (redirect)
├── /auth → Login
├── /home → Dashboard (protected)
├── /business → CRM Features (protected)
│   ├── /companies
│   ├── /contacts
│   ├── /opportunities
│   └── /invoices
├── /operations → Finance Operations (protected)
│   ├── /expenses
│   ├── /payments
│   └── /budgets
└── /budgets → Budget Planning (protected)
    ├── /list
    ├── /create
    └── /[id]
```

## 🧪 Testing

```bash
# Unit tests
nx test [project-name]

# E2E tests
nx e2e kujali-e2e

# Test with coverage
nx test [project-name] --coverage

# Test specific file
nx test [project-name] --testFile=my-component.spec.ts
```

## 🐛 Debugging

### Frontend
1. Open Chrome DevTools
2. Check Console for errors
3. Use Angular DevTools extension
4. Check Network tab for API calls

### Backend (Functions)
1. Check Firebase Emulator UI: http://localhost:4000
2. View function logs in emulator
3. Use `console.log()` in functions
4. Check Firestore data in emulator

### Common Issues

| Issue | Solution |
|-------|----------|
| Port already in use | Kill process: `lsof -ti:4200 \| xargs kill -9` |
| Module not found | Check `tsconfig.base.json` paths |
| Firebase connection error | Check emulators are running |
| Build memory error | Increase Node memory: `export NODE_OPTIONS="--max-old-space-size=8192"` |

## 📦 Key Dependencies

### Frontend
- **Angular**: 15.0.4
- **Angular Material**: 15.0.3
- **Firebase**: 7.5.0
- **RxJS**: 7.5.0
- **Chart.js**: 3.9.1
- **Moment.js**: 2.29.4

### Backend
- **Firebase Admin**: 11.4.1
- **Firebase Functions**: 3.13.1

### Build Tools
- **Nx**: 15.4.4
- **TypeScript**: 4.8.4
- **Jest**: 28.1.1

## 🔗 Useful Links

- **Firebase Console**: https://console.firebase.google.com
- **Emulator UI**: http://localhost:4000 (when running)
- **App (dev)**: http://localhost:4200
- **Angular Docs**: https://angular.io
- **Nx Docs**: https://nx.dev
- **Firebase Docs**: https://firebase.google.com/docs

## 💡 Tips & Tricks

### 1. Fast Navigation
```bash
# Jump to feature
cd libs/features/budgetting/budgets

# Jump to model
cd libs/model/finance/planning/budgets

# Jump to state
cd libs/state/finance/budgetting/budgets
```

### 2. Search Code
```bash
# Find all usages of a class
grep -r "BudgetStore" libs/

# Find all interfaces
find libs/model -name "*.interface.ts"

# Find all components
find libs/features -name "*.component.ts"
```

### 3. Nx Commands
```bash
# List all projects
nx list

# Show project info
nx show project kujali

# Run affected tests
nx affected:test

# Build affected projects
nx affected:build
```

### 4. Git Workflow
```bash
# Create feature branch
git checkout -b feature/my-feature

# Commit changes
git add .
git commit -m "feat: add my feature"

# Push to remote
git push origin feature/my-feature
```

## 🎓 Learning Path

### For New Developers

1. **Week 1**: Understand project structure
   - Read `README.md`
   - Explore `libs/` structure
   - Run the app locally

2. **Week 2**: Learn core concepts
   - Study state management pattern
   - Understand routing
   - Review key models

3. **Week 3**: Make small changes
   - Fix a bug
   - Add a new field to a form
   - Update a component

4. **Week 4**: Build a feature
   - Create a new component
   - Add a new route
   - Implement business logic

### Key Files to Understand

1. `apps/kujali/src/app/app.module.ts` - App initialization
2. `apps/kujali/src/app/app.routing.module.ts` - Routing
3. `libs/state/user/src/lib/stores/user.store.ts` - State pattern
4. `libs/features/dashboard/main/` - Feature structure
5. `libs/model/finance/planning/budgets/` - Data models

## 📝 Code Snippets

### Create a New Store
```typescript
import { Injectable } from '@angular/core';
import { Store } from '@iote/state';
import { MyModel } from '@app/model/my-domain';

@Injectable({ providedIn: 'root' })
export class MyModelStore extends Store<MyModel> {
  constructor() {
    super('my-models');
  }
  
  getAll(): Observable<MyModel[]> {
    return this.getDocuments();
  }
}
```

### Create a Component
```typescript
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { MyModelStore } from '@app/state/my-domain';
import { MyModel } from '@app/model/my-domain';

@Component({
  selector: 'app-my-component',
  templateUrl: './my-component.component.html',
  styleUrls: ['./my-component.component.scss']
})
export class MyComponent {
  items$: Observable<MyModel[]>;
  
  constructor(private store: MyModelStore) {
    this.items$ = this.store.getAll();
  }
}
```

### Create a Cloud Function
```typescript
import { RestRegistrar } from '@ngfi/functions';
import { KujaliFunction } from '../../../environments/kujali-func.class';
import { MyFunctionHandler } from '@app/functions/my-domain';

const handler = new MyFunctionHandler();

export const myFunction = new KujaliFunction(
  'myFunction',
  new RestRegistrar(),
  [],
  handler
).build();
```

---

## 🆘 Getting Help

1. **Check Documentation**: Start with README files
2. **Search Codebase**: Look for similar implementations
3. **Firebase Console**: Check backend data and logs
4. **DevTools**: Use browser console for frontend issues
5. **Nx Graph**: Visualize dependencies: `nx graph`

---

**Remember**: The codebase is organized by domain (budgeting, business, operations) and by layer (features, state, models). When looking for something, think about:
1. **What domain?** (budgeting, business, etc.)
2. **What layer?** (UI, state, model, function)
3. **What type?** (component, service, store, interface)

This will help you navigate the codebase efficiently!
