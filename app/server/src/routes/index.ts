import { Router } from 'express';
import type { PostsRepository } from '../db/posts.repository';
import { InMemoryPostsRepository } from '../db/posts.memory';
import { identifyUser, type UserResolver } from '../middleware/posts-user';
import { CommentsService } from '../services/comments.service';
import { PostsService } from '../services/posts.service';
import { createCommentsRouter } from './comments.routes';
import { createPostsRouter } from './posts.routes';
import pingRouter from './ping.routes';

export function createApiRouter(
  repository: PostsRepository = new InMemoryPostsRepository(),
  resolveUser: UserResolver = () => undefined,
): Router {
  const apiRouter = Router();

  apiRouter.use('/ping', pingRouter);

  apiRouter.use('/posts', identifyUser(resolveUser));

  apiRouter.use(
    '/posts',
    createPostsRouter(new PostsService(repository)),
  );

  apiRouter.use(
    '/posts/:postId/comments',
    createCommentsRouter(new CommentsService(repository)),
  );

  return apiRouter;
}

export default createApiRouter();