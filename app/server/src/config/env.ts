import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '../../../../.env'),
});

export const HOST = process.env.HOST ?? '127.0.0.1';
export const PORT = Number(process.env.PORT ?? 3000);
