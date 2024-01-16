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
    const parsedToken = JSON.parse(token);

    // Check if the token is expired
    if (isTokenExpired(parsedToken)) {
      console.log('Token expired. Refreshing...');
      await refreshAccessToken(oAuth2Client, parsedToken);
    } else {
      oAuth2Client.setCredentials(parsedToken);
      console.log('Token loaded from', TOKEN_PATH);
    }
  } catch (err) {
    console.log('Token not found. Generating new token...');
    await getNewToken(oAuth2Client);
  }

  return oAuth2Client;
}

function isTokenExpired(token) {
  // Check if the token has an expiry_date property
  if (token.expiry_date) {
    const expirationTime = token.expiry_date;
    // Compare with the current Unix timestamp (in seconds)
    return expirationTime < Date.now() / 1000;
  }
  // If the expiry_date property is not present, consider the token as expired
  return true;
}
async function refreshAccessToken(oAuth2Client, oldToken) {
  try {
    const newToken = await oAuth2Client.refreshToken(oldToken.refresh_token);
    oAuth2Client.setCredentials(newToken.credentials);
    await writeFile(TOKEN_PATH, JSON.stringify(newToken.credentials));
    console.log('Token refreshed and stored to', TOKEN_PATH);
  } catch (err) {
    console.error('Error refreshing token:', err);
    throw err;
  }
}

async function getNewToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',
    /** Pass in the scopes array defined above.
     * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
    scope: SCOPES,
    // Enable incremental authorization. Recommended as a best practice.
    include_granted_scopes: true,
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
