import apiRouter from './routes/index.js';
import express, { Application } from 'express';

const app: Application = express();

app.use(express.json());

app.use('/api', apiRouter);

export default app;
