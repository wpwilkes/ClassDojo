import app from './app';
import { SERVER_HOST, SERVER_PORT } from './config/env';

app.listen(SERVER_PORT, SERVER_HOST, () => {
  console.log(
    `summit server listening on port ${SERVER_HOST}:${SERVER_PORT}`
  );
});
