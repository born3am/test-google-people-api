import express from 'express';

import routes from './routes.js';
import { PORT, SCOPES } from '../config.js';

const app = express();

app.use(routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  console.log(`Open http://localhost:${PORT}/oauth2 in your browser to:
  1. Authenticate with Google
  2. Allow app access to these google APIs scopes: ${SCOPES}
  3. Copy code at URL pasting into terminal in order to save locally the token.json file
  4. With the token.json file saved locally, you can now use the google APIs options in the routes:
  `);
});
