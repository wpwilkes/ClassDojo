import type { Request, RequestHandler, Response } from 'express';
import type { User } from '../types/posts.types';
import { HttpError } from '../utils/http-error';

// Replace the demo resolver with the team's authenticated session later.
export type UserResolver = (
  req: Request,
) => User | undefined | Promise<User | undefined>;

export const demoHeaderUser: UserResolver = (req) => {
  const id = req.header('x-user-id')?.trim();

  if (!id) return undefined;

  return {
    id,
    name: req.header('x-user-name')?.trim() || 'Summit User',
  };
};

export function identifyUser(resolveUser: UserResolver): RequestHandler {
  return async (req, res, next) => {
    res.locals.user = await resolveUser(req);
    next();
  };
}

export function currentUser(res: Response): User | undefined {
  return res.locals.user as User | undefined;
}

export function requireCurrentUser(res: Response): User {
  const user = currentUser(res);

  if (!user) {
    throw new HttpError(401, 'You must be signed in.');
  }

  return user;
}

export const requireUser: RequestHandler = (_req, res, next) => {
  requireCurrentUser(res);
  next();
};