import { IObject } from '@iote/bricks';

/**
 * Budget Note - Represents a note attached to a budget
 * 
 * Notes allow users to add comments, observations, or important
 * information related to a specific budget for collaboration and tracking.
 */
export interface BudgetNote extends IObject {
  /** Foreign key to the budget this note belongs to */
  budgetId: string;

  /** The actual content/text of the note */
  content: string;

  /** ID of the user who created this note */
  authorId: string;

  /** Timestamp when the note was created */
  createdAt: Date;

  /** Timestamp when the note was last updated (optional) */
  updatedAt?: Date;

  /** Optional: Tags or categories for the note */
  tags?: string[];

  /** Optional: Whether this note is pinned/important */
  isPinned?: boolean;
}
