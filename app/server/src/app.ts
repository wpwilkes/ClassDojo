import path from 'node:path';
import express from 'express';
import { ALLOW_DEV_USER_HEADERS } from './config/env';
import type { PostsRepository } from './db/posts.repository';
import { errorHandler } from './middleware/error-handler';
import { demoHeaderUser, type UserResolver } from './middleware/posts-user';
import { createApiRouter } from './routes';

type AppOptions = {
  repository?: PostsRepository;
  resolveUser?: UserResolver;
  allowDevUserHeaders?: boolean;
};

export function createApp(options: AppOptions = {}) {
  const app = express();
  app.use(express.json());

  const allowDemo = options.allowDevUserHeaders ?? ALLOW_DEV_USER_HEADERS;
  const resolveUser =
    options.resolveUser ?? (allowDemo ? demoHeaderUser : () => undefined);

  app.use('/api', createApiRouter(options.repository, resolveUser));

  // The frontend files are stored separately in app/client/src.
  const clientSource = path.resolve(__dirname, '../../client/src');

  app.use('/posts-assets', express.static(clientSource));

  app.get(['/posts', '/api/posts-page'], (_req, res) => {
    res.sendFile(path.join(clientSource, 'pages/posts.html'));
  });

  app.use((_req, res) => {
    res.status(404).json({ message: 'Route not found.' });
  });

  app.use(errorHandler);

  return app;
}

export default createApp();