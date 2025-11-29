# Getting Started with Kujali Development

## 📚 Documentation Index

I've created comprehensive documentation for the Kujali project. Here's what's available:

1. **PROJECT_STRUCTURE_ANALYSIS.md** - Complete technical deep-dive
   - Full architecture explanation
   - All modules and libraries documented
   - Data models and interfaces
   - Development workflow
   - 18 comprehensive sections

2. **QUICK_REFERENCE_GUIDE.md** - Fast lookup guide
   - Common commands
   - Quick navigation tips
   - Code snippets
   - Troubleshooting

3. **ARCHITECTURE_DIAGRAM.md** - Visual architecture
   - System diagrams
   - Data flow charts
   - Component relationships
   - Technology stack visualization

4. **README.md** - Original project documentation
   - Setup instructions
   - Firebase configuration
   - Contributing guidelines

---

## 🎯 Start Here

### For Complete Understanding
Read in this order:
1. This file (GETTING_STARTED.md) - Overview
2. PROJECT_STRUCTURE_ANALYSIS.md - Deep dive
3. QUICK_REFERENCE_GUIDE.md - Daily reference
4. ARCHITECTURE_DIAGRAM.md - Visual understanding

### For Quick Start
1. Read "Quick Setup" below
2. Jump to QUICK_REFERENCE_GUIDE.md
3. Reference PROJECT_STRUCTURE_ANALYSIS.md as needed

---

## 🚀 Quick Setup (5 Minutes)

### 1. Prerequisites
```bash
# Check Node.js version (need 14.20.1+)
node -v

# Install Angular CLI
npm install -g @angular/cli

# Install Firebase Tools
npm install -g firebase-tools
```

### 2. Install Dependencies
```bash
cd /home/leky_reborn/kujali
npm install
```

### 3. Setup Environment Files

Create `apps/kujali/src/environments/environment.ts`:
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

Create `apps/kujali/src/environments/environment.prod.ts` (same structure, set `production: true`, `useEmulators: false`)

### 4. Initialize Firebase Emulators
```bash
firebase login
firebase init emulators
# Select: Authentication, Firestore, Functions, Storage
```

### 5. Start Development
```bash
# Start everything (app + emulators)
npm run run-develop

# Or start separately:
# Terminal 1: npm run start
# Terminal 2: npm run start-firebase-emulators
```

### 6. Access the App
- **App**: http://localhost:4200
- **Firebase Emulator UI**: http://localhost:4000
- **Demo Login**: user@demo.com / demoUser

---

## 📖 Project Overview

### What is Kujali?
A comprehensive financial management application with:
- **Budgeting**: Create, manage, and track budgets
- **CRM**: Manage companies, contacts, opportunities, invoices
- **Operations**: Track expenses, payments, and allocations
- **Banking**: Connect to banks via Ponto API
- **Multi-tenancy**: Organization-based data isolation

### Technology Stack
- **Frontend**: Angular 15 + TypeScript 4.8
- **Backend**: Firebase (Firestore, Functions, Auth)
- **Architecture**: Nx Monorepo (100+ libraries)
- **State**: Custom RxJS-based state management
- **UI**: Angular Material 15

### Key Features
✅ Real-time data synchronization
✅ Role-based access control
✅ Multi-language support
✅ Banking integration (Ponto)
✅ Budget planning & tracking
✅ Invoice & payment management
✅ CRM functionality
✅ Activity tracking

---

## 🗂️ Project Structure at a Glance

```
kujali/
├── apps/
│   ├── kujali/              # Frontend (Angular)
│   └── kujali-functions/    # Backend (Firebase Functions)
├── libs/
│   ├── elements/            # UI Components
│   ├── features/            # Feature Modules (lazy-loaded)
│   ├── model/               # Data Models & Interfaces
│   ├── state/               # State Management (Stores)
│   ├── functions/           # Backend Logic
│   └── util/                # Utility Libraries
├── demo-data/               # Emulator demo data
└── [docs]/                  # Documentation (you are here)
```

### Library Categories

| Category | Purpose | Examples |
|----------|---------|----------|
| **elements/** | Reusable UI | Forms, buttons, layouts, modals |
| **features/** | Business features | Dashboard, budgets, CRM |
| **model/** | Data structures | Budget, User, Invoice interfaces |
| **state/** | Data management | UserStore, BudgetStore |
| **functions/** | Backend logic | Budget calculations, allocations |
| **util/** | Infrastructure | State library, Firebase utils |

---

## 🎓 Learning Path

### Week 1: Orientation
**Goal**: Understand the big picture

**Tasks**:
1. ✅ Read all documentation files
2. ✅ Run the app locally
3. ✅ Explore the demo account
4. ✅ Browse the codebase structure
5. ✅ Understand the routing

**Key Files**:
- `apps/kujali/src/app/app.module.ts`
- `apps/kujali/src/app/app.routing.module.ts`
- `libs/features/dashboard/main/`

### Week 2: Core Concepts
**Goal**: Learn the patterns

**Tasks**:
1. Study state management pattern
2. Understand model-state-feature relationship
3. Learn the custom frameworks (@iote, @ngfi)
4. Explore a complete feature (e.g., budgets)
5. Understand Firebase integration

**Key Files**:
- `libs/state/user/src/lib/stores/user.store.ts`
- `libs/model/finance/planning/budgets/`
- `libs/features/budgetting/budgets/`

### Week 3: Hands-On
**Goal**: Make small changes

**Tasks**:
1. Add a field to a form
2. Create a new component
3. Modify a service method
4. Update a model interface
5. Test your changes

**Practice**:
- Add a description field to Budget
- Create a simple display component
- Modify budget list filtering

### Week 4: Feature Development
**Goal**: Build something new

**Tasks**:
1. Design a small feature
2. Create necessary models
3. Implement state management
4. Build UI components
5. Add routing
6. Write tests

**Project Ideas**:
- Add tags to budgets
- Create a budget template system
- Add export functionality

---

## 🔍 How to Find Things

### By Domain
```bash
# Budget-related code
libs/features/budgetting/     # UI
libs/state/finance/budgetting/ # State
libs/model/finance/planning/   # Models
libs/functions/finance/budgeting/ # Backend

# CRM-related code
libs/features/finance/business/ # UI
libs/state/finance/companies/   # State
libs/model/finance/companies/   # Models
```

### By Type
```bash
# All components
find libs/features -name "*.component.ts"

# All stores
find libs/state -name "*.store.ts"

# All models
find libs/model -name "*.interface.ts"

# All services
find libs -name "*.service.ts"
```

### By Feature
Use the path alias pattern:
- `@app/features/[domain]/[feature]` - UI
- `@app/state/[domain]/[feature]` - State
- `@app/model/[domain]/[feature]` - Models

---

## 🛠️ Common Development Tasks

### 1. Adding a New Field to a Model
```typescript
// 1. Update interface (libs/model/)
export interface Budget extends IObject {
  name: string;
  description: string; // NEW FIELD
  // ...
}

// 2. Update form (libs/features/)
// Add form control and input field

// 3. Update display (libs/features/)
// Show the new field in templates
```

### 2. Creating a New Component
```bash
# Generate component
nx generate @nrwl/angular:component my-component \
  --project=my-library \
  --export

# Use in templates
<app-my-component></app-my-component>
```

### 3. Adding a New Route
```typescript
// apps/kujali/src/app/app.routing.module.ts
{
  path: 'my-feature',
  loadChildren: () => import('@app/features/my-feature')
    .then(m => m.MyFeatureModule),
  canActivate: [IsLoggedInGuard]
}
```

### 4. Creating a Cloud Function
```typescript
// 1. Create handler (libs/functions/)
export class MyFunctionHandler {
  async execute(data: any) {
    // Logic here
  }
}

// 2. Export function (apps/kujali-functions/src/main.ts)
export * from './app/my-domain/my-function.function';

// 3. Deploy
firebase deploy --only functions:myFunction
```

---

## 🧪 Testing

### Run Tests
```bash
# All tests
nx test

# Specific project
nx test my-library

# With coverage
nx test my-library --coverage

# Watch mode
nx test my-library --watch
```

### E2E Tests
```bash
nx e2e kujali-e2e
```

---

## 🐛 Debugging

### Frontend Debugging
1. Open Chrome DevTools (F12)
2. Check Console for errors
3. Use Angular DevTools extension
4. Check Network tab for API calls
5. Use breakpoints in Sources tab

### Backend Debugging
1. Open Firebase Emulator UI: http://localhost:4000
2. Check function logs
3. Inspect Firestore data
4. View authentication users
5. Add `console.log()` in functions

### Common Issues

| Issue | Solution |
|-------|----------|
| Port in use | `lsof -ti:4200 \| xargs kill -9` |
| Module not found | Check `tsconfig.base.json` paths |
| Firebase error | Ensure emulators are running |
| Build memory error | `export NODE_OPTIONS="--max-old-space-size=8192"` |

---

## 📝 Code Style & Conventions

### File Naming
- Components: `my-component.component.ts`
- Services: `my-service.service.ts`
- Stores: `my-store.store.ts`
- Interfaces: `my-model.interface.ts`
- Modules: `my-module.module.ts`

### Class Naming
- Components: `MyComponent`
- Services: `MyService`
- Stores: `MyStore`
- Interfaces: `MyModel` (no suffix)

### Import Order
1. Angular imports
2. Third-party imports
3. @iote/@ngfi imports
4. @app imports
5. Relative imports

### Code Organization
```typescript
// 1. Imports
import { Component } from '@angular/core';

// 2. Decorator
@Component({...})

// 3. Class
export class MyComponent {
  // 3.1 Properties
  // 3.2 Constructor
  // 3.3 Lifecycle hooks
  // 3.4 Public methods
  // 3.5 Private methods
}
```

---

## 🤝 Working on Assignments

### Before Starting
1. ✅ Read all documentation
2. ✅ Understand the feature area
3. ✅ Identify affected files
4. ✅ Plan your approach
5. ✅ Create a branch

### During Development
1. Follow existing patterns
2. Maintain code style
3. Write tests
4. Test locally
5. Commit frequently

### Before Submitting
1. Run tests: `nx test`
2. Check linting: `nx lint`
3. Test in browser
4. Review your changes
5. Write clear commit messages

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/my-assignment

# Make changes and commit
git add .
git commit -m "feat: implement my assignment"

# Push to remote
git push origin feature/my-assignment

# Create pull request
```

---

## 💡 Pro Tips

### 1. Use Nx Commands
```bash
# See project graph
nx graph

# See what's affected by changes
nx affected:graph

# Run affected tests
nx affected:test
```

### 2. Use Path Aliases
```typescript
// ❌ Don't do this
import { UserStore } from '../../../libs/state/user/src/lib/stores/user.store';

// ✅ Do this
import { UserStore } from '@app/state/user';
```

### 3. Subscribe Properly
```typescript
// ❌ Don't forget to unsubscribe
this.store.getData().subscribe(data => {});

// ✅ Use async pipe
data$ = this.store.getData();
// In template: {{ data$ | async }}

// ✅ Or use SubSink
private subs = new SubSink();
this.subs.sink = this.store.getData().subscribe();
ngOnDestroy() { this.subs.unsubscribe(); }
```

### 4. Use TypeScript Features
```typescript
// Use interfaces
interface MyData {
  name: string;
  age: number;
}

// Use type safety
const data: MyData = { name: 'John', age: 30 };

// Use optional chaining
const value = data?.nested?.property;
```

### 5. Leverage RxJS
```typescript
// Combine streams
combineLatest([users$, orgs$]).pipe(
  map(([users, orgs]) => /* combine */)
)

// Transform data
data$.pipe(
  map(item => transform(item)),
  filter(item => item.active),
  tap(item => console.log(item))
)
```

---

## 📚 Additional Resources

### Official Documentation
- [Angular Docs](https://angular.io/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Nx Docs](https://nx.dev)
- [RxJS Docs](https://rxjs.dev)
- [Angular Material](https://material.angular.io)

### Project Documentation
- `PROJECT_STRUCTURE_ANALYSIS.md` - Complete technical reference
- `QUICK_REFERENCE_GUIDE.md` - Daily development reference
- `ARCHITECTURE_DIAGRAM.md` - Visual architecture
- `README.md` - Setup and contributing

### Library READMEs
Each library has its own README:
- `libs/features/[feature]/README.md`
- `libs/state/[domain]/README.md`
- `libs/model/[domain]/README.md`

---

## 🎯 Next Steps

### Immediate Actions
1. ✅ Set up your development environment
2. ✅ Run the application locally
3. ✅ Explore the demo account
4. ✅ Read PROJECT_STRUCTURE_ANALYSIS.md
5. ✅ Bookmark QUICK_REFERENCE_GUIDE.md

### This Week
1. Understand the architecture
2. Explore key features
3. Study the code patterns
4. Make a small change
5. Ask questions

### This Month
1. Complete a small feature
2. Write tests
3. Review code with team
4. Contribute to documentation
5. Help others

---

## ❓ Getting Help

### When Stuck
1. Check the documentation files
2. Search the codebase for examples
3. Check Firebase console/emulator
4. Use browser DevTools
5. Review similar features

### Resources
- **Documentation**: Start here
- **Code Examples**: Look at existing features
- **Firebase Console**: Check backend data
- **Nx Graph**: Visualize dependencies
- **Git History**: See how things evolved

---

## 🎉 You're Ready!

You now have:
- ✅ Complete project documentation
- ✅ Understanding of architecture
- ✅ Development environment setup
- ✅ Quick reference guides
- ✅ Learning path

**Start with**: QUICK_REFERENCE_GUIDE.md for daily tasks
**Deep dive**: PROJECT_STRUCTURE_ANALYSIS.md for complete understanding
**Visualize**: ARCHITECTURE_DIAGRAM.md for system overview

---

## 📞 Quick Links

| Resource | Location |
|----------|----------|
| **Complete Analysis** | PROJECT_STRUCTURE_ANALYSIS.md |
| **Quick Reference** | QUICK_REFERENCE_GUIDE.md |
| **Architecture** | ARCHITECTURE_DIAGRAM.md |
| **Setup Guide** | README.md |
| **This Guide** | GETTING_STARTED.md |

---

**Good luck with your assignments! 🚀**

Remember: The codebase is well-organized and follows consistent patterns. Once you understand the structure, everything will make sense!
