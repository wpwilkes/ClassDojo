import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '../../../../.env'),
});

export const HOST = process.env.HOST ?? '127.0.0.1';
export const PORT = Number(process.env.PORT ?? 3000);

// Local demo only. Headers are not real authentication; disabled by default.
export const ALLOW_DEV_USER_HEADERS =
  process.env.ALLOW_DEV_USER_HEADERS === 'true';