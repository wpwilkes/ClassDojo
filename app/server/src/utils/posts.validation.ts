import { POST_CATEGORIES, POST_LIMITS } from '../config/posts';
import type { PostCategory, ValidationResult } from '../types/posts.types';

export function isObject(input: unknown): input is Record<string, unknown> {
  return input !== null && typeof input === 'object' && !Array.isArray(input);
}

export function isPostCategory(value: unknown): value is PostCategory {
  return typeof value === 'string' && POST_CATEGORIES.some((c) => c === value);
}

export function validatePostInput(input: unknown): ValidationResult {
  const errors: string[] = [];
  const body = isObject(input) ? input : {};

  const title = typeof body.title === 'string' ? body.title.trim() : '';

  const description =
    typeof body.description === 'string' ? body.description.trim() : '';

  if (!title) {
    errors.push('Title is required.');
  }

  if (title.length > POST_LIMITS.title) {
    errors.push('Title must be 160 characters or fewer.');
  }

  if (!description) {
    errors.push('Post content is required.');
  }

  if (description.length > POST_LIMITS.description) {
    errors.push('Post content must be 10,000 characters or fewer.');
  }

  if (!isPostCategory(body.category)) {
    errors.push('A valid category is required.');
  }

  if (typeof body.anonymous !== 'boolean') {
    errors.push('Anonymous must be true or false.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}