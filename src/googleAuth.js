import { readFile, writeFile } from 'fs/promises';
import readline from 'readline';

import { google } from 'googleapis';

import getCredentials from './getCredentials.js';
import { SCOPES, TOKEN_PATH } from '../config.js';

const credentialsSource = await getCredentials();

export async function loadClientSecrets(credentials = credentialsSource) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  try {
    const token = await readFile(TOKEN_PATH);
    oAuth2Client.setCredentials(JSON.parse(token));
  } catch (err) {
    await getNewToken(oAuth2Client);
  }

  return oAuth2Client;
}

async function getNewToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const code = await new Promise((resolve) => {
    // code will be show in the URL in the format "code=4/ABCD...&scope=https://www.googleapis.com/auth/contacts" The code is the part between code= and &scope
    rl.question('Enter the code from that page here: ', (userCode) => {
      rl.close();
      resolve(userCode);
    });
  });

  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  // Store the token to disk for later program executions

  await writeFile(TOKEN_PATH, JSON.stringify(tokens));
  console.log('Token stored to', TOKEN_PATH);
}
