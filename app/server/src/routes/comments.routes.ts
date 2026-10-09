import { Router } from 'express';
import { createCommentsController } from '../controllers/comments.controller';
import { requireUser } from '../middleware/posts-user';
import type { CommentsService } from '../services/comments.service';

export function createCommentsRouter(service: CommentsService): Router {
  // Receive :postId from /posts/:postId/comments.
  const router = Router({ mergeParams: true });
  const controller = createCommentsController(service);

  router.get('/', controller.list);
  router.post('/', requireUser, controller.create);

  return router;
}