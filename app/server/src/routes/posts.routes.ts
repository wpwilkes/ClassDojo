import { Router } from 'express';
import { createPostsController } from '../controllers/posts.controller';
import { requireUser } from '../middleware/posts-user';
import type { PostsService } from '../services/posts.service';

export function createPostsRouter(service: PostsService): Router {
  const router = Router();
  const controller = createPostsController(service);

  router.get('/', controller.list);
  router.get('/categories', controller.categories);
  router.post('/', requireUser, controller.create);
  router.get('/:postId', controller.get);
  router.patch('/:postId', requireUser, controller.update);
  router.delete('/:postId', requireUser, controller.remove);
  router.post('/:postId/vote', requireUser, controller.vote);

  return router;
}