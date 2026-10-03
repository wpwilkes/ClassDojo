import { Router } from 'express';

const pingRouter = Router();

pingRouter.get('/', (_req, res) => {
  res.json({ status: 'ok' });
});

export default pingRouter;
