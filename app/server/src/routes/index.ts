import { Router } from 'express';
import pingRouter from './ping';

const apiRouter = Router();

apiRouter.use('/ping', pingRouter);

export default apiRouter;
