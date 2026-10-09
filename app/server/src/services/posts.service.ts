import type { PostsRepository } from '../db/posts.repository';
import type {
  PostInput,
  PostRecord,
  PublicPost,
  User,
} from '../types/posts.types';
import { HttpError } from '../utils/http-error';
import {
  isObject,
  isPostCategory,
  validatePostInput,
} from '../utils/posts.validation';

export class PostsService {
  private readonly repository: PostsRepository;

  constructor(repository: PostsRepository) {
    this.repository = repository;
  }

  private normalize(input: unknown): PostInput {
    const validation = validatePostInput(input);

    if (!validation.valid) {
      throw new HttpError(400, validation.errors.join(' '));
    }

    const value = input as PostInput;

    // Select allowed fields explicitly.
    return {
      title: value.title.trim(),
      description: value.description.trim(),
      category: value.category,
      anonymous: value.anonymous,
    };
  }

  private async requirePost(id: string): Promise<PostRecord> {
    const post = await this.repository.getPost(id);

    if (!post) {
      throw new HttpError(404, 'Post not found.');
    }

    return post;
  }

  private async toPublic(
    post: PostRecord,
    userId?: string,
  ): Promise<PublicPost> {
    return {
      id: post.id,
      title: post.title,
      description: post.description,
      category: post.category,
      anonymous: post.anonymous,
      author: post.anonymous ? 'Anonymous' : post.authorName,
      voteCount: Object.values(post.votes).reduce<number>(
        (sum, value) => sum + value,
        0,
      ),
      commentCount: await this.repository.commentCount(post.id),
      isOwner: userId === post.authorId,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }

  async list(category: unknown, userId?: string): Promise<PublicPost[]> {
    if (category !== undefined && !isPostCategory(category)) {
      throw new HttpError(400, 'Category is invalid.');
    }

    const posts = await this.repository.listPosts(category);

    return Promise.all(
      posts.map((post) => this.toPublic(post, userId)),
    );
  }

  async get(id: string, userId?: string): Promise<PublicPost> {
    return this.toPublic(await this.requirePost(id), userId);
  }

  async create(user: User, input: unknown): Promise<PublicPost> {
    const post = await this.repository.createPost(
      user,
      this.normalize(input),
    );

    return this.toPublic(post, user.id);
  }

  async update(
    id: string,
    user: User,
    input: unknown,
  ): Promise<PublicPost> {
    const post = await this.requirePost(id);

    if (post.authorId !== user.id) {
      throw new HttpError(403, 'You can only edit your own posts.');
    }

    if (!isObject(input) || Object.keys(input).length === 0) {
      throw new HttpError(
        400,
        'Provide at least one post field to update.',
      );
    }

    const allowed = [
      'title',
      'description',
      'category',
      'anonymous',
    ];

    if (Object.keys(input).some((key) => !allowed.includes(key))) {
      throw new HttpError(
        400,
        'Only title, description, category, and anonymous can be updated.',
      );
    }

    const fields = this.normalize({
      title: post.title,
      description: post.description,
      category: post.category,
      anonymous: post.anonymous,
      ...input,
    });

    const updated = await this.repository.updatePost(id, fields);

    if (!updated) {
      throw new HttpError(404, 'Post not found.');
    }

    return this.toPublic(updated, user.id);
  }

  async delete(id: string, user: User): Promise<{ deleted: true }> {
    const post = await this.requirePost(id);

    if (post.authorId !== user.id) {
      throw new HttpError(403, 'You can only delete your own posts.');
    }

    if (!(await this.repository.deletePost(id))) {
      throw new HttpError(404, 'Post not found.');
    }

    return { deleted: true };
  }

  async vote(
    id: string,
    user: User,
    input: unknown,
  ): Promise<PublicPost> {
    const value = isObject(input) ? input.value : undefined;

    if (value !== 1 && value !== -1) {
      throw new HttpError(400, 'Vote value must be 1 or -1.');
    }

    const post = await this.repository.vote(id, user.id, value);

    if (!post) {
      throw new HttpError(404, 'Post not found.');
    }

    return this.toPublic(post, user.id);
  }
}