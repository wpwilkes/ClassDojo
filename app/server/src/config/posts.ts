export const POST_CATEGORIES = [
  'Politics',
  'Health',
  'Technology',
  'Sports',
  'Education',
  'Entertainment',
] as const;

export const POST_LIMITS = {
  title: 160,
  description: 10_000,
  comment: 2_000,
};