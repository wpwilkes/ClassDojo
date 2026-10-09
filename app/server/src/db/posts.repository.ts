import type {
  CommentRecord,
  PostCategory,
  PostInput,
  PostRecord,
  User,
  VoteValue,
} from '../types/posts.types';

// Wesley's Prisma adapter can implement this interface later.
// Routes and services do not need to know where records are stored.
export interface PostsRepository {
  listPosts(category?: PostCategory): Promise<PostRecord[]>;

  getPost(id: string): Promise<PostRecord | undefined>;

  createPost(user: User, input: PostInput): Promise<PostRecord>;

  updatePost(
    id: string,
    input: PostInput,
  ): Promise<PostRecord | undefined>;

  deletePost(id: string): Promise<boolean>;

  vote(
    id: string,
    userId: string,
    value: VoteValue,
  ): Promise<PostRecord | undefined>;

  listComments(postId: string): Promise<CommentRecord[]>;

  createComment(
    postId: string,
    user: User,
    body: string,
  ): Promise<CommentRecord | undefined>;

  commentCount(postId: string): Promise<number>;
}