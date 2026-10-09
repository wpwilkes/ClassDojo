import { POST_LIMITS } from '../config/posts';
import type { ValidationResult } from '../types/posts.types';
import { isObject } from './posts.validation';

export function validateCommentInput(input: unknown): ValidationResult {
  const errors: string[] = [];
  const body = isObject(input) ? input : {};

  const comment = typeof body.body === 'string' ? body.body.trim() : '';

  if (!comment) {
    errors.push('Comment is required.');
  }

  if (comment.length > POST_LIMITS.comment) {
    errors.push('Comment must be 2,000 characters or fewer.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}