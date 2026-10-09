import type { RequestHandler } from 'express';
import { requireCurrentUser } from '../middleware/posts-user';
import type { CommentsService } from '../services/comments.service';

type CommentHandler = RequestHandler<{ postId: string }>;

export function createCommentsController(service: CommentsService) {
  const list: CommentHandler = async (req, res) => {
    res.json(await service.list(req.params.postId));
  };

  const create: CommentHandler = async (req, res) => {
    res.status(201).json(
      await service.create(
        req.params.postId,
        requireCurrentUser(res),
        req.body,
      ),
    );
  };

  return { list, create };
}