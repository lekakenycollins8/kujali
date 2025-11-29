# Kujali Architecture Diagram

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                               │
│                    (Angular 15 Application)                          │
│                      http://localhost:4200                           │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ HTTP/WebSocket
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      FIREBASE SERVICES                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │ Authentication│  │  Firestore   │  │   Storage    │             │
│  │   (Auth)      │  │  (Database)  │  │   (Files)    │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │            Cloud Functions (Backend Logic)                    │  │
│  │  - Budget Calculations  - Banking API  - Allocations         │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ API Calls
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │ Ponto Banking│  │ Google Cloud │  │  SurrealDB   │             │
│  │     API      │  │Secret Manager│  │  (Optional)  │             │
│  └──────────────┘  └──────────────┘  └──────────────┘             │
└─────────────────────────────────────────────────────────────────────┘
```

## Frontend Architecture (Angular App)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         apps/kujali/                                 │
│                      (Main Angular App)                              │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                    app.module.ts                            │    │
│  │  - Firebase Initialization                                  │    │
│  │  - State Modules Registration                               │    │
│  │  - Material Design Setup                                    │    │
│  └────────────────────────────────────────────────────────────┘    │
│                              │                                       │
│                              ▼                                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                app.routing.module.ts                        │    │
│  │  /auth        → Login                                       │    │
│  │  /home        → Dashboard (protected)                       │    │
│  │  /business    → CRM Features (protected)                    │    │
│  │  /operations  → Finance Operations (protected)              │    │
│  │  /budgets     → Budget Planning (protected)                 │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

## Library Architecture (Nx Monorepo)

```
┌─────────────────────────────────────────────────────────────────────┐
│                            libs/                                     │
│                    (Shared Libraries)                                │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                      PRESENTATION LAYER                       │  │
│  │  ┌────────────────┐  ┌────────────────┐                      │  │
│  │  │   elements/    │  │   features/    │                      │  │
│  │  │  - base        │  │  - auth        │                      │  │
│  │  │  - forms       │  │  - dashboard   │                      │  │
│  │  │  - layout      │  │  - budgetting  │                      │  │
│  │  │  - modals      │  │  - finance     │                      │  │
│  │  └────────────────┘  └────────────────┘                      │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                       │
│                              ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    BUSINESS LOGIC LAYER                       │  │
│  │  ┌────────────────┐  ┌────────────────┐                      │  │
│  │  │    state/      │  │  functions/    │                      │  │
│  │  │  - user        │  │  - budgeting   │                      │  │
│  │  │  - organisation│  │  - banking     │                      │  │
│  │  │  - finance     │  │  - manage      │                      │  │
│  │  │  - files       │  │  - data        │                      │  │
│  │  └────────────────┘  └────────────────┘                      │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                       │
│                              ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                       DATA LAYER                              │  │
│  │  ┌────────────────────────────────────────────────────────┐  │  │
│  │  │                    model/                               │  │  │
│  │  │  - common (user, config)                                │  │  │
│  │  │  - organisation                                          │  │  │
│  │  │  - finance (budgets, invoices, payments, etc.)          │  │  │
│  │  │  - roles, tags                                           │  │  │
│  │  └────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                       │
│                              ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                   INFRASTRUCTURE LAYER                        │  │
│  │  ┌────────────────┐  ┌────────────────┐                      │  │
│  │  │  util/iote/    │  │  util/ngfi/    │                      │  │
│  │  │  - bricks      │  │  - angular     │                      │  │
│  │  │  - state       │  │  - firestore   │                      │  │
│  │  │  - cqrs        │  │  - functions   │                      │  │
│  │  │  - time        │  │  - multi-lang  │                      │  │
│  │  └────────────────┘  └────────────────┘                      │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER ACTION                                  │
│                    (Click, Input, Submit)                            │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        COMPONENT                                     │
│                  (Presentation Logic)                                │
│  - Handles user interactions                                         │
│  - Subscribes to observables                                         │
│  - Displays data                                                     │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      STORE/SERVICE                                   │
│                   (Business Logic)                                   │
│  - Manages state                                                     │
│  - Handles data transformations                                      │
│  - Communicates with Firebase                                        │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    FIREBASE/BACKEND                                  │
│                                                                       │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐        │
│  │   Firestore    │  │Cloud Functions │  │  Authentication│        │
│  │   (Read/Write) │  │  (Compute)     │  │    (Auth)      │        │
│  └────────────────┘  └────────────────┘  └────────────────┘        │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    OBSERVABLE STREAM                                 │
│                  (Real-time Updates)                                 │
│  - Data changes pushed to component                                  │
│  - UI automatically updates                                          │
└─────────────────────────────────────────────────────────────────────┘
```

## Feature Module Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│              Example: Budget Feature Module                          │
│                                                                       │
│  libs/features/budgetting/budgets/                                   │
│  │                                                                    │
│  ├── src/                                                            │
│  │   ├── lib/                                                        │
│  │   │   ├── components/                                             │
│  │   │   │   ├── budget-list/                                        │
│  │   │   │   │   ├── budget-list.component.ts                        │
│  │   │   │   │   ├── budget-list.component.html                      │
│  │   │   │   │   └── budget-list.component.scss                      │
│  │   │   │   └── budget-form/                                        │
│  │   │   │       └── ...                                             │
│  │   │   ├── pages/                                                  │
│  │   │   │   └── budgets-page/                                       │
│  │   │   │       └── budgets.page.ts                                 │
│  │   │   ├── budgets.module.ts                                       │
│  │   │   └── budgets-routing.module.ts                               │
│  │   └── index.ts (public API)                                       │
│  │                                                                    │
│  │   Uses:                                                            │
│  │   ├── @app/state/finance/budgetting/budgets (State)               │
│  │   ├── @app/model/finance/planning/budgets (Models)                │
│  │   └── @app/elements/* (UI Components)                             │
│  │                                                                    │
│  └── project.json (Nx configuration)                                 │
└─────────────────────────────────────────────────────────────────────┘
```

## State Management Pattern

```
┌─────────────────────────────────────────────────────────────────────┐
│                      STATE MANAGEMENT FLOW                           │
│                                                                       │
│  Component                                                           │
│     │                                                                 │
│     │ 1. Subscribes                                                  │
│     ▼                                                                 │
│  Store (extends @iote/state)                                         │
│     │                                                                 │
│     │ 2. Queries                                                     │
│     ▼                                                                 │
│  Firebase Service (@ngfi/angular)                                    │
│     │                                                                 │
│     │ 3. Fetches                                                     │
│     ▼                                                                 │
│  Firestore Database                                                  │
│     │                                                                 │
│     │ 4. Real-time Updates                                           │
│     ▼                                                                 │
│  Observable Stream                                                   │
│     │                                                                 │
│     │ 5. Emits                                                       │
│     ▼                                                                 │
│  Component (Auto-updates UI)                                         │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

## Backend Architecture (Firebase Functions)

```
┌─────────────────────────────────────────────────────────────────────┐
│                   apps/kujali-functions/                             │
│                  (Firebase Cloud Functions)                          │
│                                                                       │
│  src/main.ts (Entry Point)                                           │
│     │                                                                 │
│     ├── Finance Functions                                            │
│     │   ├── promoteBudget                                            │
│     │   └── calculateBudgetHeaders                                   │
│     │                                                                 │
│     ├── Banking API Functions                                        │
│     │   ├── fetchPontoUserBankAccess                                 │
│     │   ├── fetchPontoUserBankTrs                                    │
│     │   ├── createPontoOnboardingDetails                             │
│     │   ├── disconnectPonto                                          │
│     │   ├── getPontoOrgDetails                                       │
│     │   ├── pontoReauthRequest                                       │
│     │   ├── setSelectedBankAccount                                   │
│     │   └── updatePontoConnection                                    │
│     │                                                                 │
│     ├── Data Functions                                               │
│     │   └── createSurrealDbPayments                                  │
│     │                                                                 │
│     └── Management Functions                                         │
│         ├── allocateExpenses                                         │
│         ├── allocation                                               │
│         ├── deallocation                                             │
│         ├── allocatePaymentsToInvoice                                │
│         └── allocateInvoicesToPayment                                │
│                                                                       │
│  Uses libs/functions/ for implementation logic                       │
└─────────────────────────────────────────────────────────────────────┘
```

## Domain Model Relationships

```
┌─────────────────────────────────────────────────────────────────────┐
│                      DOMAIN MODEL DIAGRAM                            │
│                                                                       │
│  ┌──────────────┐                                                    │
│  │     User     │                                                    │
│  │  (KuUser)    │                                                    │
│  └──────┬───────┘                                                    │
│         │ belongs to                                                 │
│         ▼                                                             │
│  ┌──────────────┐                                                    │
│  │Organisation  │                                                    │
│  │              │                                                    │
│  └──────┬───────┘                                                    │
│         │ owns                                                       │
│         ├─────────────────┬─────────────────┬──────────────┐        │
│         ▼                 ▼                 ▼              ▼        │
│  ┌──────────┐      ┌──────────┐     ┌──────────┐   ┌──────────┐   │
│  │  Budget  │      │ Company  │     │ Contact  │   │ Invoice  │   │
│  └────┬─────┘      └────┬─────┘     └────┬─────┘   └────┬─────┘   │
│       │                 │                 │              │          │
│       │ contains        │ has             │ has          │ has      │
│       ▼                 ▼                 ▼              ▼          │
│  ┌──────────┐      ┌──────────┐     ┌──────────┐   ┌──────────┐   │
│  │BudgetLine│      │Opportunity│    │ Activity │   │ Payment  │   │
│  └──────────┘      └──────────┘     └──────────┘   └──────────┘   │
│       │                                                  │          │
│       │ allocated to                                     │          │
│       ▼                                                  │          │
│  ┌──────────┐                                            │          │
│  │ Expense  │◄───────────────────────────────────────────┘          │
│  └──────────┘              allocated from                           │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      SECURITY LAYERS                                 │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                   AUTHENTICATION                            │    │
│  │  - Firebase Authentication                                  │    │
│  │  - JWT Tokens                                               │    │
│  │  - Email/Password, Social Login                             │    │
│  └────────────────────────────────────────────────────────────┘    │
│                              │                                       │
│                              ▼                                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                   AUTHORIZATION                             │    │
│  │  - Route Guards (IsLoggedInGuard)                           │    │
│  │  - Role-Based Access Control (RBAC)                         │    │
│  │  - Organisation-Based Permissions                           │    │
│  └────────────────────────────────────────────────────────────┘    │
│                              │                                       │
│                              ▼                                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                   DATA SECURITY                             │    │
│  │  - Firestore Security Rules                                 │    │
│  │  - Storage Security Rules                                   │    │
│  │  - Organisation-Based Data Isolation                        │    │
│  └────────────────────────────────────────────────────────────┘    │
│                              │                                       │
│                              ▼                                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                   SECRETS MANAGEMENT                        │    │
│  │  - Google Cloud Secret Manager                              │    │
│  │  - Environment Variables (gitignored)                       │    │
│  │  - No Hardcoded Credentials                                 │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

## Development vs Production Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        DEVELOPMENT                                   │
│                                                                       │
│  Angular Dev Server                                                  │
│  (localhost:4200)                                                    │
│         │                                                             │
│         ▼                                                             │
│  Firebase Emulators                                                  │
│  (localhost:4000)                                                    │
│  ├── Auth Emulator                                                   │
│  ├── Firestore Emulator                                              │
│  ├── Functions Emulator                                              │
│  └── Storage Emulator                                                │
│         │                                                             │
│         ▼                                                             │
│  Demo Data (demo-data/)                                              │
│  - Pre-populated test data                                           │
│  - Demo user account                                                 │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        PRODUCTION                                    │
│                                                                       │
│  Firebase Hosting                                                    │
│  (your-app.web.app)                                                  │
│         │                                                             │
│         ▼                                                             │
│  Firebase Services                                                   │
│  ├── Firebase Auth                                                   │
│  ├── Cloud Firestore                                                 │
│  ├── Cloud Functions                                                 │
│  ├── Cloud Storage                                                   │
│  └── Analytics                                                       │
│         │                                                             │
│         ▼                                                             │
│  External Services                                                   │
│  ├── Ponto Banking API                                               │
│  ├── Google Cloud Secret Manager                                    │
│  └── SurrealDB (optional)                                            │
└─────────────────────────────────────────────────────────────────────┘
```

## Build & Deployment Pipeline

```
┌─────────────────────────────────────────────────────────────────────┐
│                    BUILD & DEPLOYMENT FLOW                           │
│                                                                       │
│  1. Source Code                                                      │
│     (TypeScript, SCSS, HTML)                                         │
│         │                                                             │
│         ▼                                                             │
│  2. TypeScript Compilation                                           │
│     (tsc → JavaScript)                                               │
│         │                                                             │
│         ▼                                                             │
│  3. Angular Build                                                    │
│     (nx build --prod)                                                │
│     - AOT Compilation                                                │
│     - Tree Shaking                                                   │
│     - Minification                                                   │
│     - Bundling                                                       │
│         │                                                             │
│         ▼                                                             │
│  4. Secret Management                                                │
│     (Google Cloud Secret Manager)                                    │
│         │                                                             │
│         ▼                                                             │
│  5. Environment Configuration                                        │
│     (dotenv2json)                                                    │
│         │                                                             │
│         ▼                                                             │
│  6. Firebase Deploy                                                  │
│     - Hosting (Static files)                                         │
│     - Functions (Backend)                                            │
│     - Firestore Rules                                                │
│     - Storage Rules                                                  │
│         │                                                             │
│         ▼                                                             │
│  7. Production                                                       │
│     (Live Application)                                               │
└─────────────────────────────────────────────────────────────────────┘
```

## Technology Stack Layers

```
┌─────────────────────────────────────────────────────────────────────┐
│                      TECHNOLOGY STACK                                │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                   FRONTEND LAYER                            │    │
│  │  Angular 15 │ TypeScript 4.8 │ RxJS 7.5                    │    │
│  │  Angular Material 15 │ Chart.js 3.9 │ Moment.js 2.29       │    │
│  └────────────────────────────────────────────────────────────┘    │
│                              │                                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                   FRAMEWORK LAYER                           │    │
│  │  @iote (Custom State, CQRS, Bricks)                         │    │
│  │  @ngfi (Firebase Utils, Multi-lang)                         │    │
│  └────────────────────────────────────────────────────────────┘    │
│                              │                                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                   BACKEND LAYER                             │    │
│  │  Firebase Functions │ Node.js 14+ │ Firebase Admin 11      │    │
│  └────────────────────────────────────────────────────────────┘    │
│                              │                                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                   DATA LAYER                                │    │
│  │  Cloud Firestore │ Firebase Auth │ Cloud Storage           │    │
│  └────────────────────────────────────────────────────────────┘    │
│                              │                                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                   BUILD LAYER                               │    │
│  │  Nx 15.4 │ Jest 28 │ Cypress 11 │ ESLint │ Prettier        │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Key Architectural Principles

### 1. **Separation of Concerns**
- Presentation (features, elements)
- Business Logic (state, functions)
- Data (models)
- Infrastructure (util)

### 2. **Modularity**
- Each library is independent
- Clear public APIs (index.ts)
- Minimal coupling

### 3. **Lazy Loading**
- Feature modules loaded on-demand
- Reduces initial bundle size
- Improves performance

### 4. **Reactive Programming**
- RxJS Observables everywhere
- Real-time data updates
- Declarative data flow

### 5. **Type Safety**
- Full TypeScript coverage
- Interfaces for all data structures
- Compile-time error checking

### 6. **Scalability**
- Nx monorepo for growth
- Firebase auto-scaling
- Modular architecture

### 7. **Security**
- Multi-layer security
- Firebase security rules
- Organisation-based isolation

---

This architecture supports:
- ✅ Rapid feature development
- ✅ Code reusability
- ✅ Easy testing
- ✅ Team collaboration
- ✅ Production scalability
- ✅ Maintainability
