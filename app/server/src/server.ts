import app from './app.js';
import { SERVER_HOST, SERVER_PORT } from './config/env.js';

app.listen(SERVER_PORT, SERVER_HOST, () => {
  console.log(`summit server listening on ${SERVER_HOST}:${SERVER_PORT}`);
});
