import {
  createPingDatabaseController,
  pingServerController,
} from '../controllers/ping.controller.js';
import { pingDatabaseService } from '../services/ping.service.js';
import { pingDatabaseRepository } from '../repositories/ping.repository.js';
import { Router } from 'express';

const pingRouter: Router = Router();

const databaseService = () => pingDatabaseService(pingDatabaseRepository);

const databaseController = createPingDatabaseController(databaseService);

pingRouter.get('/database', databaseController);
pingRouter.get('/server', pingServerController);

export default pingRouter;
