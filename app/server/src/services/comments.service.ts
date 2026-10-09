import type { PostsRepository } from '../db/posts.repository';
import type {
  CommentRecord,
  PublicComment,
  User,
} from '../types/posts.types';
import { validateCommentInput } from '../utils/comments.validation';
import { HttpError } from '../utils/http-error';

function toPublic(comment: CommentRecord): PublicComment {
  return {
    id: comment.id,
    postId: comment.postId,
    body: comment.body,
    author: comment.authorName,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
  };
}

export class CommentsService {
  private readonly repository: PostsRepository;

  constructor(repository: PostsRepository) {
    this.repository = repository;
  }

  private async requirePost(postId: string): Promise<void> {
    if (!(await this.repository.getPost(postId))) {
      throw new HttpError(404, 'Post not found.');
    }
  }

  async list(postId: string): Promise<PublicComment[]> {
    await this.requirePost(postId);

    return (await this.repository.listComments(postId)).map(toPublic);
  }

  async create(
    postId: string,
    user: User,
    input: unknown,
  ): Promise<PublicComment> {
    await this.requirePost(postId);

    const validation = validateCommentInput(input);

    if (!validation.valid) {
      throw new HttpError(400, validation.errors.join(' '));
    }

    const body = (input as { body: string }).body.trim();

    const comment = await this.repository.createComment(
      postId,
      user,
      body,
    );

    if (!comment) {
      throw new HttpError(404, 'Post not found.');
    }

    return toPublic(comment);
  }
}