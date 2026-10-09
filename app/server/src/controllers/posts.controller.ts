import type { RequestHandler } from 'express';
import { POST_CATEGORIES } from '../config/posts';
import {
  currentUser,
  requireCurrentUser,
} from '../middleware/posts-user';
import type { PostsService } from '../services/posts.service';

type PostHandler = RequestHandler<{ postId: string }>;

export function createPostsController(service: PostsService) {
  const list: RequestHandler = async (req, res) => {
    res.json(
      await service.list(req.query.category, currentUser(res)?.id),
    );
  };

  const categories: RequestHandler = (_req, res) => {
    res.json(POST_CATEGORIES);
  };

  const create: RequestHandler = async (req, res) => {
    res.status(201).json(
      await service.create(requireCurrentUser(res), req.body),
    );
  };

  const get: PostHandler = async (req, res) => {
    res.json(
      await service.get(req.params.postId, currentUser(res)?.id),
    );
  };

  const update: PostHandler = async (req, res) => {
    res.json(
      await service.update(
        req.params.postId,
        requireCurrentUser(res),
        req.body,
      ),
    );
  };

  const remove: PostHandler = async (req, res) => {
    res.json(
      await service.delete(req.params.postId, requireCurrentUser(res)),
    );
  };

  const vote: PostHandler = async (req, res) => {
    res.json(
      await service.vote(
        req.params.postId,
        requireCurrentUser(res),
        req.body,
      ),
    );
  };

  return {
    list,
    categories,
    create,
    get,
    update,
    remove,
    vote,
  };
}