import type { POST_CATEGORIES } from '../config/posts';

export type PostCategory = (typeof POST_CATEGORIES)[number];

export type VoteValue = 1 | -1;

export type User = {
  id: string;
  name: string;
};

export type ValidationResult = {
  valid: boolean;
  errors: string[];
};

export type PostInput = {
  title: string;
  description: string;
  category: PostCategory;
  anonymous: boolean;
};

export type PostRecord = PostInput & {
  id: string;
  authorId: string;
  authorName: string;
  votes: Record<string, VoteValue>;
  createdAt: string;
  updatedAt: string;
};

export type PublicPost = PostInput & {
  id: string;
  author: string;
  voteCount: number;
  commentCount: number;
  isOwner: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CommentRecord = {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
  updatedAt: string;
};

export type PublicComment = {
  id: string;
  postId: string;
  body: string;
  author: string;
  createdAt: string;
  updatedAt: string;
};