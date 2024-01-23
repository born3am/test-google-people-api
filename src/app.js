import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { renderFile } from 'ejs';
import express from 'express';

import getCredentials from './getCredentials.js';
import { loadClientSecrets } from './googleAuth.js';
import routes from './routes/routes.js';
import { PORT, SCOPES } from '../config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.set('views', join(__dirname, './views'));
app.engine('html', renderFile);

app.use(routes);

const credentials = await getCredentials();

loadClientSecrets(credentials);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  console.log(`FOLLOW THESE STEPS:
  1. If Token not found, follow steps below ( when Token is available, link will not be shown ):
  2. Allow app access to these google APIs scopes: ${SCOPES}
  3. Copy code at URL pasting into terminal in order to save locally the token.json file
  4. With the token.json file saved locally, you can now use the google APIs options in the routes:
    - http://localhost:${PORT}/getContactNames
    - http://localhost:${PORT}/getEmailsAndPhones
    - http://localhost:${PORT}/createContact
    - http://localhost:${PORT}/deleteContact
    - http://localhost:${PORT}/updateContact
    - http://localhost:${PORT}/batchCreateContacts
    - http://localhost:${PORT}/batchDeleteContacts
    - http://localhost:${PORT}/batchUpdateContacts
 

  `);
});
