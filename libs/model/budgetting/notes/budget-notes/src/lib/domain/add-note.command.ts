/**
 * Command for adding a note to a budget
 * 
 * Encapsulates all the data required to add a new note to a budget.
 * This follows the Command pattern from CQRS architecture.
 */
export class AddNoteToBudgetCommand {
  /**
   * Creates a new AddNoteToBudgetCommand
   * 
   * @param budgetId - The ID of the budget to add the note to
   * @param content - The text content of the note
   * @param authorId - The ID of the user creating the note
   * @param timestamp - Optional timestamp (defaults to current time)
   * @param tags - Optional tags for categorizing the note
   * @param isPinned - Optional flag to mark note as important
   */
  constructor(
    public readonly budgetId: string,
    public readonly content: string,
    public readonly authorId: string,
    public readonly timestamp?: Date,
    public readonly tags?: string[],
    public readonly isPinned?: boolean
  ) {
    // Set default timestamp if not provided
    if (!this.timestamp) {
      (this as { timestamp?: Date }).timestamp = new Date();
    }
  }
}

/**
 * Result returned after executing AddNoteToBudgetCommand
 */
export interface AddNoteToBudgetResult {
  /** Whether the operation was successful */
  success: boolean;

  /** The ID of the created note (if successful) */
  noteId?: string;

  /** Error message (if operation failed) */
  error?: string;

  /** Additional error details for debugging */
  details?: Record<string, unknown>;
}
