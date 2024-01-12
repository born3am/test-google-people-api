import { readFile } from 'fs/promises';

import { PORT, CREDENTIALS_PATH } from '../config.js';

async function getCredentials() {
  const data = await readFile(CREDENTIALS_PATH, 'utf-8');
  const credentials = JSON.parse(data);

  // Replace the placeholder with the actual value
  credentials.installed.redirect_uris = credentials.installed.redirect_uris.map((uri) => uri.replace('localhost:000', `localhost:${PORT}`));

  return credentials;
}

export default getCredentials;
