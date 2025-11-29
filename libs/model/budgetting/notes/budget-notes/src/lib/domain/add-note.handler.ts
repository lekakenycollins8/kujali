import { HandlerTools } from '@iote/cqrs';
import { FunctionContext, FunctionHandler } from '@ngfi/functions';

import { BudgetNote } from '../budget-note.interface';
import { AddNoteToBudgetCommand, AddNoteToBudgetResult } from './add-note.command';

/**
 * Generic Command Handler Interface
 * 
 * Defines the contract for all command handlers in the system.
 * This ensures consistency across different command implementations.
 * 
 * @template TCommand - The type of command this handler processes
 * @template TResult - The type of result returned by the handler
 */
export interface ICommandHandler<TCommand, TResult> {
  /**
   * Executes the command
   * 
   * @param command - The command to execute
   * @param context - Function execution context
   * @param tools - Handler tools for logging and data access
   * @returns Promise that resolves to the command result
   */
  execute(command: TCommand, context: FunctionContext, tools: HandlerTools): Promise<TResult>;
}

/**
 * Handler for AddNoteToBudgetCommand
 * 
 * This handler processes requests to add notes to budgets.
 * It validates the command data, creates the note object,
 * and persists it to the database using the repository pattern.
 * 
 * Extends FunctionHandler to integrate with Firebase Cloud Functions
 * and implements ICommandHandler for consistency.
 */
export class AddNoteToBudgetHandler 
  extends FunctionHandler<AddNoteToBudgetCommand, AddNoteToBudgetResult>
  implements ICommandHandler<AddNoteToBudgetCommand, AddNoteToBudgetResult> {
  
  /**
   * Executes the AddNoteToBudgetCommand
   * 
   * @param command - The command containing note data
   * @param context - Function execution context (contains orgId, user info, etc.)
   * @param tools - Handler tools (Logger, getRepository, etc.)
   * @returns Promise resolving to AddNoteToBudgetResult
   */
  public async execute(
    command: AddNoteToBudgetCommand,
    context: FunctionContext,
    tools: HandlerTools
  ): Promise<AddNoteToBudgetResult> {
    try {
      // Step 1: Log the operation start
      tools.Logger.log(() => 
        `[AddNoteToBudgetHandler].execute: Adding note to budget ${command.budgetId}`
      );

      // Step 2: Validate the command data
      this.validateCommand(command);
      tools.Logger.log(() => '[AddNoteToBudgetHandler].execute: Command validation passed');

      // Step 3: Get the repository for budget notes
      // Repository path follows pattern: orgs/{orgId}/budget-notes
      const orgId = this.getOrgIdFromContext(context);
      const repository = tools.getRepository<BudgetNote>(`orgs/${orgId}/budget-notes`);
      
      tools.Logger.log(() => 
        `[AddNoteToBudgetHandler].execute: Repository initialized for org ${orgId}`
      );

      // Step 4: Generate a unique ID for the note
      const noteId = this.generateNoteId();

      // Step 5: Create the BudgetNote object
      const note: BudgetNote = {
        id: noteId,
        budgetId: command.budgetId,
        content: command.content,
        authorId: command.authorId,
        createdAt: command.timestamp || new Date(),
        tags: command.tags,
        isPinned: command.isPinned || false
      };

      tools.Logger.log(() => 
        `[AddNoteToBudgetHandler].execute: Created note object with ID ${noteId}`
      );

      // Step 6: Save the note to the repository
      await repository.create(note, noteId);
      
      tools.Logger.log(() => 
        `[AddNoteToBudgetHandler].execute: Successfully saved note ${noteId} to database`
      );

      // Step 7: Return success result
      return {
        success: true,
        noteId: noteId
      };

    } catch (error) {
      // Log the error
      tools.Logger.log(() => 
        `[AddNoteToBudgetHandler].execute: Error occurred - ${error}`
      );

      // Return error result
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: error instanceof Error ? { stack: error.stack } : { error }
      };
    }
  }

  /**
   * Validates the command data
   * 
   * Ensures all required fields are present and valid.
   * Throws an error if validation fails.
   * 
   * @param command - The command to validate
   * @throws Error if validation fails
   */
  private validateCommand(command: AddNoteToBudgetCommand): void {
    // Validate budgetId
    if (!command.budgetId || command.budgetId.trim() === '') {
      throw new Error('Budget ID is required and cannot be empty');
    }

    // Validate content
    if (!command.content || command.content.trim() === '') {
      throw new Error('Note content is required and cannot be empty');
    }

    // Validate content length (optional business rule)
    if (command.content.length > 5000) {
      throw new Error('Note content cannot exceed 5000 characters');
    }

    // Validate authorId
    if (!command.authorId || command.authorId.trim() === '') {
      throw new Error('Author ID is required and cannot be empty');
    }

    // Validate tags if provided
    if (command.tags && command.tags.length > 10) {
      throw new Error('Cannot add more than 10 tags to a note');
    }
  }

  /**
   * Generates a unique ID for the note
   * 
   * Uses timestamp and random string for uniqueness
   * 
   * @returns A unique note ID
   */
  private generateNoteId(): string {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 11);
    return `note_${timestamp}_${randomStr}`;
  }

  /**
   * Extracts organization ID from the function context
   * 
   * @param context - Function execution context
   * @returns Organization ID
   * @throws Error if orgId is not found in context
   */
  private getOrgIdFromContext(context: FunctionContext): string {
    // In a real implementation, orgId would come from context
    // For now, we'll use a placeholder approach
    const orgId = (context as unknown as Record<string, unknown>).orgId as string;
    
    if (!orgId) {
      throw new Error('Organization ID not found in context');
    }
    
    return orgId;
  }
}
