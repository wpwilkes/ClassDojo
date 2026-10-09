import type { ErrorRequestHandler } from 'express';
import { HttpError } from '../utils/http-error';

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _req,
  res,
  next,
) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof HttpError) {
    res.status(error.status).json({
      message: error.message,
    });
    return;
  }

  const parserError = error as { type?: string } | null;

  if (parserError?.type === 'entity.parse.failed') {
    res.status(400).json({
      message: 'Request body must be valid JSON.',
    });
    return;
  }

  if (parserError?.type === 'entity.too.large') {
    res.status(413).json({
      message: 'Request body is too large.',
    });
    return;
  }

  res.status(500).json({
    message: 'An unexpected server error occurred.',
  });
};