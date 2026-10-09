import { randomUUID } from 'node:crypto';
import type { PostsRepository } from './posts.repository';
import type {
  CommentRecord,
  PostCategory,
  PostInput,
  PostRecord,
  User,
  VoteValue,
} from '../types/posts.types';

// Temporary development/test storage.
// Nothing is written to disk or PostgreSQL.
// Restarting the server removes all records.
export class InMemoryPostsRepository implements PostsRepository {
  private readonly posts = new Map<string, PostRecord>();
  private readonly comments = new Map<string, CommentRecord>();

  async listPosts(category?: PostCategory): Promise<PostRecord[]> {
    return [...this.posts.values()]
      .reverse()
      .filter((post) => !category || post.category === category)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map((post) => structuredClone(post));
  }

  async getPost(id: string): Promise<PostRecord | undefined> {
    const post = this.posts.get(id);
    return post ? structuredClone(post) : undefined;
  }

  async createPost(user: User, input: PostInput): Promise<PostRecord> {
    const now = new Date().toISOString();

    const post: PostRecord = {
      ...input,
      id: randomUUID(),
      authorId: user.id,
      authorName: user.name,
      votes: {},
      createdAt: now,
      updatedAt: now,
    };

    this.posts.set(post.id, post);

    return structuredClone(post);
  }

  async updatePost(
    id: string,
    input: PostInput,
  ): Promise<PostRecord | undefined> {
    const post = this.posts.get(id);

    if (!post) return undefined;

    Object.assign(post, input, {
      updatedAt: new Date().toISOString(),
    });

    return structuredClone(post);
  }

  async deletePost(id: string): Promise<boolean> {
    if (!this.posts.delete(id)) return false;

    for (const [commentId, comment] of this.comments) {
      if (comment.postId === id) {
        this.comments.delete(commentId);
      }
    }

    return true;
  }

  async vote(
    id: string,
    userId: string,
    value: VoteValue,
  ): Promise<PostRecord | undefined> {
    const post = this.posts.get(id);

    if (!post) return undefined;

    if (
      Object.hasOwn(post.votes, userId) &&
      post.votes[userId] === value
    ) {
      delete post.votes[userId];
    } else {
      post.votes = {
        ...post.votes,
        [userId]: value,
      };
    }

    post.updatedAt = new Date().toISOString();

    return structuredClone(post);
  }

  async listComments(postId: string): Promise<CommentRecord[]> {
    return [...this.comments.values()]
      .filter((comment) => comment.postId === postId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      .map((comment) => structuredClone(comment));
  }

  async createComment(
    postId: string,
    user: User,
    body: string,
  ): Promise<CommentRecord | undefined> {
    if (!this.posts.has(postId)) return undefined;

    const now = new Date().toISOString();

    const comment: CommentRecord = {
      id: randomUUID(),
      postId,
      authorId: user.id,
      authorName: user.name,
      body,
      createdAt: now,
      updatedAt: now,
    };

    this.comments.set(comment.id, comment);

    return structuredClone(comment);
  }

  async commentCount(postId: string): Promise<number> {
    return [...this.comments.values()].filter(
      (comment) => comment.postId === postId,
    ).length;
  }
}