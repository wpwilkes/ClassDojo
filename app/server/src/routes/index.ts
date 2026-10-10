import pingRouter from './ping.route.js';
import { Router } from 'express';

const apiRouter: Router = Router();

apiRouter.use('/ping', pingRouter);

export default apiRouter;
