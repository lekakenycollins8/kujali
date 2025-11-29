# Research Findings - Kujali Assessment

## ✅ PHASE 1 COMPLETE - Research & Discovery

**Time**: 11:20 AM - 11:35 AM (15 min)

---

## Part 1: CQRS Pattern Understanding

### Key Findings

#### 1. **Handler Base Classes**

**@iote/cqrs - Handler**
```typescript
export abstract class Handler<T> {
  public abstract execute(data: T, context: HandlerContext, tools: HandlerTools): Promise<any>;
}
```

**@ngfi/functions - FunctionHandler**
```typescript
export abstract class FunctionHandler<T, R> extends Handler<T> {
  public abstract execute(data: T, context: FunctionContext, tools: HandlerTools): Promise<R>;
}
```

#### 2. **HandlerTools Interface**
```typescript
export interface HandlerTools {
  Logger: Logger;
  getRepository: <T extends IObject>(documentPath: string) => Repository<T>;
}
```

#### 3. **Repository Interface**
```typescript
export interface Repository<T extends IObject> {
  getDocumentById(id: string): Promise<T>;
  getDocuments(query: Query): Promise<T[]>;
  create(data: T, id?: string, extendId?: boolean): Promise<T>;
  update(t: T): Promise<T>;
  write(t: T, id: string): Promise<T>;
  delete(id: string): Promise<boolean>;
  getUserDocuments(query: Query, uid: string): Promise<T[]>;
  performTransaction(trFn: (tr: Transaction, _db: FirebaseFirestore) => Promise<any>): Promise<any>;
}
```

#### 4. **Existing Handler Example** - PromoteBudgetHandler

**Key Patterns Observed**:
```typescript
export class PromoteBudgetHandler extends FunctionHandler<any, any> {
  public async execute(budgetData: {...}, context: FunctionContext, tools: HandlerTools) {
    // 1. Use tools.Logger for logging
    tools.Logger.log(() => `[PromoteBudgetHandler].execute: starting...`);
    
    // 2. Get repository using tools.getRepository
    const linesRepo = tools.getRepository<any>(ALL_BUDGET_LINES_REPO(budget.orgId));
    
    // 3. Perform operations
    await linesRepo.write(data, id);
    
    // 4. Return result (no explicit return in this example)
  }
}
```

**Repository Path Pattern**: `orgs/${orgId}/collection-name`

---

## Part 2: Component Structure Understanding

### SelectBudgetPageComponent (Parent)

**Current Implementation**:
```typescript
export class SelectBudgetPageComponent implements OnInit {
  // Observables
  overview$!: Observable<OrgBudgetsOverview>;
  sharedBudgets$: Observable<any[]>;
  allBudgets$: Observable<{overview: BudgetRecord[], budgets: any[]}>;
  
  // Constructor DI
  constructor(
    private _orgBudgets$$: OrgBudgetsStore,
    private _budgets$$: BudgetsStore,
    private _dialog: MatDialog,
    private _logger: Logger
  ) { }
  
  // ngOnInit with subscriptions
  ngOnInit() {
    this.overview$ = this._orgBudgets$$.get();
    this.sharedBudgets$ = this._budgets$$.get();
    
    this.allBudgets$ = combineLatest([this.overview$, this._budgets$$.get()])
      .pipe(
        map(([overview, budgets]) => {...}),
        map((overview) => {...})
      );
  }
  
  // Method with subscription
  setActive(record: BudgetRecord) {
    this._budgets$$.update(toSave)
      .subscribe(() => {
        (<any> record).updating = false;
        this._logger.log(() => `Updated Budget...`) 
      });
  }
}
```

**What Needs to Change**:
1. ✅ Replace constructor DI with `inject()`
2. ✅ Convert `Observable<T>` to `Signal<T>` using `toSignal()`
3. ✅ Replace `combineLatest` + `map` with `computed()`
4. ✅ Replace `.subscribe()` with `effect()`
5. ✅ Update template to use signals

### BudgetTableComponent (Child)

**Current Implementation**:
```typescript
export class BudgetTableComponent {
  private _sbS = new SubSink();
  
  // Observable input
  @Input() budgets$: Observable<{overview: BudgetRecord[], budgets: any[]}>;
  @Input() canPromote = false;
  
  dataSource = new MatTableDataSource();
  overviewBudgets: BudgetRecord[] = [];
  
  constructor(private _router$$: Router, private _dialog: MatDialog) { }
  
  // Subscription in ngOnInit
  ngOnInit(): void {
    this._sbS.sink = this.budgets$.pipe(
      tap((o) => {
        this.overviewBudgets = o.overview;
        this.dataSource.data = o.budgets;
      })
    ).subscribe();
  }
}
```

**What Needs to Change**:
1. ✅ Replace `@Input()` with signal `input()`
2. ✅ Remove SubSink and subscriptions
3. ✅ Use `effect()` or `computed()` for reactive updates
4. ✅ Update template to use signal values
5. ✅ Bonus: Remove CommonModule, use control flow

---

## Implementation Plan

### Part 1: Add Note to Budget Command

**File Structure**:
```
libs/model/budgetting/budget-notes/
├── src/
│   ├── lib/
│   │   ├── budget-note.interface.ts          # NEW
│   │   └── domain/
│   │       ├── add-note.command.ts           # NEW
│   │       └── add-note.handler.ts           # NEW
│   └── index.ts                               # UPDATE
```

**Implementation Steps**:

1. **Generate Library** ✅
   ```bash
   nx generate @nrwl/node:library budget-notes --directory=model/budgetting/notes
   ```

2. **Create BudgetNote Interface**
   ```typescript
   export interface BudgetNote extends IObject {
     budgetId: string;
     content: string;
     authorId: string;
     createdAt: Date;
     updatedAt?: Date;
   }
   ```

3. **Create Command**
   ```typescript
   export class AddNoteToBudgetCommand {
     constructor(
       public readonly budgetId: string,
       public readonly content: string,
       public readonly authorId: string,
       public readonly timestamp?: Date
     ) {
       this.timestamp = timestamp || new Date();
     }
   }
   
   export interface AddNoteToBudgetResult {
     success: boolean;
     noteId?: string;
     error?: string;
   }
   ```

4. **Create Handler**
   ```typescript
   export interface ICommandHandler<TCommand> {
     execute(command: TCommand): Promise<void>;
   }
   
   export class AddNoteToBudgetHandler 
     extends FunctionHandler<AddNoteToBudgetCommand, AddNoteToBudgetResult>
     implements ICommandHandler<AddNoteToBudgetCommand> {
     
     async execute(
       command: AddNoteToBudgetCommand, 
       context: FunctionContext, 
       tools: HandlerTools
     ): Promise<AddNoteToBudgetResult> {
       // 1. Validate
       this.validateCommand(command);
       
       // 2. Get repository
       const repository = tools.getRepository<BudgetNote>(
         `orgs/${context.orgId}/budget-notes`
       );
       
       // 3. Create note
       const note: BudgetNote = {
         id: this.generateId(),
         budgetId: command.budgetId,
         content: command.content,
         authorId: command.authorId,
         createdAt: command.timestamp || new Date()
       };
       
       // 4. Save
       await repository.create(note, note.id);
       
       return { success: true, noteId: note.id };
     }
     
     private validateCommand(command: AddNoteToBudgetCommand): void {
       if (!command.budgetId?.trim()) throw new Error('Budget ID required');
       if (!command.content?.trim()) throw new Error('Content required');
       if (!command.authorId?.trim()) throw new Error('Author ID required');
     }
     
     private generateId(): string {
       return `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
     }
   }
   ```

---

### Part 2: Refactor to Signals

**SelectBudgetPageComponent Refactor**:

```typescript
import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

export class SelectBudgetPageComponent {
  // Replace constructor DI with inject()
  private _orgBudgets$$ = inject(OrgBudgetsStore);
  private _budgets$$ = inject(BudgetsStore);
  private _dialog = inject(MatDialog);
  private _logger = inject(Logger);
  
  // Convert observables to signals
  overview = toSignal(this._orgBudgets$$.get());
  sharedBudgets = toSignal(this._budgets$$.get());
  
  // Use computed for derived state
  allBudgets = computed(() => {
    const overview = this.overview();
    const budgets = this.sharedBudgets();
    
    if (!overview || !budgets) return { overview: [], budgets: [] };
    
    const flatOverview = __flatMap(overview);
    const flatBudgets = __flatMap(budgets);
    const trBudgets = flatBudgets.map((budget: any) => {
      budget['endYear'] = budget.startYear + budget.duration - 1;
      return budget;
    });
    
    return { overview: flatOverview, budgets: trBudgets };
  });
  
  // Use effect for side effects (if needed)
  constructor() {
    effect(() => {
      const budgets = this.allBudgets();
      // Any side effects here
    });
  }
  
  // Update methods to use signals
  setActive(record: BudgetRecord) {
    const toSave = ___cloneDeep(record.budget);
    delete (toSave as any).canBeActivated;
    delete (toSave as any).access;
    toSave.status = BudgetStatus.InUse;
    
    (<any> record).updating = true;
    
    // Use effect or convert to signal-based approach
    this._budgets$$.update(toSave).subscribe(() => {
      (<any> record).updating = false;
      this._logger.log(() => `Updated Budget with id ${toSave.id}`);
    });
  }
}
```

**Template Update**:
```html
<!-- BEFORE -->
<app-budget-table [budgets$]="allBudgets$"></app-budget-table>

<!-- AFTER -->
<app-budget-table [budgets]="allBudgets()"></app-budget-table>
```

**BudgetTableComponent Refactor**:

```typescript
import { Component, input, effect, inject } from '@angular/core';

export class BudgetTableComponent {
  // Signal inputs
  budgets = input.required<{overview: BudgetRecord[], budgets: any[]}>();
  canPromote = input(false);
  
  // Regular properties
  dataSource = new MatTableDataSource();
  overviewBudgets: BudgetRecord[] = [];
  
  // inject() for DI
  private _router$$ = inject(Router);
  private _dialog = inject(MatDialog);
  
  // Use effect for reactive updates
  constructor() {
    effect(() => {
      const budgetData = this.budgets();
      this.overviewBudgets = budgetData.overview;
      this.dataSource.data = budgetData.budgets;
    });
  }
  
  // Remove ngOnInit - no longer needed
  // Remove SubSink - no longer needed
}
```

**Template Update**:
```html
<!-- BEFORE -->
{{ budgets$ | async }}

<!-- AFTER -->
{{ budgets() }}
```

---

## Key Takeaways

### Part 1 - CQRS
✅ Handlers extend `FunctionHandler<T, R>`
✅ Use `tools.getRepository()` for data access
✅ Repository path: `orgs/${orgId}/collection-name`
✅ Use `tools.Logger` for logging
✅ Return typed results

### Part 2 - Signals
✅ `inject()` replaces constructor DI
✅ `toSignal()` converts Observable to Signal
✅ `computed()` replaces `map()` and `combineLatest()`
✅ `effect()` replaces `.subscribe()`
✅ `input()` replaces `@Input()`
✅ Signals are accessed with `()`

---

## Next Steps

1. ✅ Switch to `feat/add-budget-note-command` branch
2. ✅ Generate library
3. ✅ Implement Part 1
4. ✅ Switch to `feat/refactor-signals-state` branch
5. ✅ Implement Part 2
6. ✅ Create PRs
7. ✅ Submit form

**Current Time**: 11:35 AM
**Deadline**: 7:59 PM
**Time Remaining**: 8+ hours

Ready to implement! 🚀
