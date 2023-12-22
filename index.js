import { readFile, writeFile } from 'fs/promises';
import readline from 'readline';

import dotenv from 'dotenv';
import express from 'express';
import { google } from 'googleapis';

dotenv.config();

const app = express();

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/contacts'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = './tokens/token.json';

// Load client secrets from a local file.
async function loadClientSecrets() {
  try {
    const credentials = {
      installed: {
        client_id: process.env.CLIENT_ID,
        project_id: process.env.PROJECT_ID,
        auth_uri: process.env.AUTH_URI,
        token_uri: process.env.TOKEN_URI,
        auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uris: [process.env.REDIRECT_URI],
      },
    };
    const oAuth2Client = await authorize(credentials);
    // createNewContact(oAuth2Client);
    listConnectionNames(oAuth2Client);
    // listEmailsAndPhones(oAuth2Client);
  } catch (err) {
    console.log('Error loading client secret file:', err);
  }
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
export async function authorize(credentials) {
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

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
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

/**
 * Print the display name if available for 10 connections.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listConnectionNames(auth) {
  const service = google.people({ version: 'v1', auth });
  const res = await service.people.connections.list({
    resourceName: 'people/me',
    pageSize: 2,
    personFields: 'names,emailAddresses',
  });

  const { connections } = res.data;
  console.log(res.data);
  if (connections) {
    // console.log('Connections:');
    connections.forEach((person) => {
      if (person.names && person.names.length > 0) {
        console.log(person.names[0].displayName);
      } else {
        console.log('No display name found for connection.');
      }
    });
  } else {
    console.log('No connections found.');
  }
}

async function listEmailsAndPhones(auth) {
  const service = google.people({ version: 'v1', auth });
  const { data } = await service.people.connections.list({
    resourceName: 'people/me',
    pageSize: 100,
    personFields: 'names,emailAddresses,phoneNumbers',
  });

  const { connections } = data;

  if (connections) {
    connections.forEach((person) => {
      if (person.names && person.names.length > 0) {
        console.log(person.names[0].displayName);
      } else {
        console.log('No display name found for connection.');
      }
      if (person.emailAddresses && person.emailAddresses.length > 0) {
        console.log(person.emailAddresses[0].value);
      } else {
        console.log('No email found for connection.');
      }
      if (person.phoneNumbers && person.phoneNumbers.length > 0) {
        console.log(person.phoneNumbers[0].value);
      } else {
        console.log('No phone number found for connection.');
      }
    });
  }
}

async function createNewContact(auth) {
  const service = google.people({ version: 'v1', auth });
  const { data } = await service.people.createContact({
    requestBody: {
      names: [
        {
          displayName: 'John Doe',
          givenName: 'John',
          familyName: 'Doe',
        },
      ],
      emailAddresses: [
        {
          value: 'test@pakcon.de',
        },
      ],
      phoneNumbers: [
        {
          value: '+55 (11) 99999-9999',
        },
      ],
      addresses: [
        {
          streetAddress: 'Av. Paulista, 1234',
          city: 'São Paulo',
          state: 'São Paulo',
          country: 'Brazil',
          postalCode: '01310-100',
          type: 'home',
        },
      ],
      a,
    },
  });

  console.log(data);
}

app.get('/oauth2callback', async (req, res) => {
  try {
    const { code } = req.query;
    const oAuth2Client = await authorize(JSON.parse(await readFile('credentials.json')));
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    await writeFile(TOKEN_PATH, JSON.stringify(tokens));
    res.send('Authentication successful');
  } catch (err) {
    console.error('Error during authentication:', err);
    res.status(500).send('Authentication failed');
  }
});

loadClientSecrets();

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
