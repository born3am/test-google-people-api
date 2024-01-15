import { readFile, writeFile } from 'fs/promises';
import readline from 'readline';

import { google } from 'googleapis';

import getCredentials from './getCredentials.js';
import { SCOPES, TOKEN_PATH } from '../config.js';

export async function loadClientSecrets() {
  const credentials = await getCredentials();

  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  try {
    const token = await readFile(TOKEN_PATH);
    oAuth2Client.setCredentials(JSON.parse(token));
    console.log('Token loaded from', TOKEN_PATH);
  } catch (err) {
    console.log('Token not found. Generating new token...');
    await getNewToken(oAuth2Client);
  }

  return oAuth2Client;
}

async function getNewToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Get new Token to authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let code;
  try {
    code = await new Promise((resolve) => {
      // code will be show in the URL in the format "code=4/ABCD...&scope=https://www.googleapis.com/auth/contacts" The code is the part between code= and &scope
      rl.question('Enter the code from that page here: ', (userCode) => {
        resolve(userCode);
      });
    });
  } finally {
    rl.close();
  }

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    await writeFile(TOKEN_PATH, JSON.stringify(tokens));
    console.log('New Token stored to', TOKEN_PATH);
  } catch (err) {
    console.error('Error storing token:', err);
    throw err;
  }
}
