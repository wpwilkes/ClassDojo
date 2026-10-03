import app from './app';
import { HOST, PORT } from './config/env';

app.listen(PORT, HOST, () => {
  console.log(`summit server listening on port ${HOST}:${PORT}`);
});
