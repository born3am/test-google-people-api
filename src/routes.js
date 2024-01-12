import express from 'express';

import getCredentials from './getCredentials.js';
import { loadClientSecrets } from './googleAuth.js';
import { createNewContact, listConnectionNames, listEmailsAndPhones } from './peopleApiServices.js';
const router = express.Router();

router.get('/codeRetrieved', (req, res) => {
  if (req.query.code) {
    // include data retrieved from google in the response
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Code Retrieved</title>
          <style>
            body {
              font-family: Arial, sans-serif;
            }
            .container {
              margin: 0 auto;
              max-width: 800px;
              padding: 20px;
            }
            .code {
              background-color: #f8f8f8;
              border: 1px solid #ccc;
              padding: 10px;
              font-family: monospace;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Code retrieved with Success!</h1>
            <p>Paste this code in the terminal:</p>
            <div class="code">${req.query.code}</div>
          </div>
        </body>
      </html>
    `);
  } else {
    res.send('No code retrieved');
  }
});

router.get('/listConnectionNames', async (req, res) => {
  try {
    getCredentials();
    const oAuth2Client = await loadClientSecrets();
    const connectionNames = await listConnectionNames(oAuth2Client);
    res.send(`List Connection Names successful!
    <br>
    <br>
    <br>
    <b>TOTAL</b>: ${connectionNames.length}
    <br>
    <br>
    <b>NAMES</b>: ${connectionNames.join(', ')}`);
  } catch (err) {
    console.error('Error listing connection names:', err);
    res.status(500).send('Error listing connection names');
  }
});

router.get('/listEmailsAndPhones', async (req, res) => {
  try {
    const oAuth2Client = await loadClientSecrets();
    const contacts = await listEmailsAndPhones(oAuth2Client);
    res.send(`List Emails and Phones successful!
    <br>
    <br>
    <br>
    <b>TOTAL</b>: ${contacts.length}
    <br>
    <br>
    <b>CONTACTS</b>:
    <br>
    ${contacts.map((contact) => JSON.stringify(contact)).join(', <br> ')}
    `);
  } catch (err) {
    console.error('Error listing emails and phones:', err);
    res.status(500).send('Error listing emails and phones');
  }
});

router.get('/createNewContact', async (req, res) => {
  try {
    const oAuth2Client = await loadClientSecrets();
    const newContactData = await createNewContact(oAuth2Client);

    if (!newContactData) {
      res.send('Contact already exists. Duplicate not created.');
      return;
    }

    const newContactDataString = JSON.stringify(newContactData, null, 2); // 2 spaces of indentation
    const spacedNewContactData = newContactDataString.replace(/ /g, '&nbsp;').replace(/\n/g, '<br>');

    res.send(`
      <pre>
        New Contact added successfully!
        <br>
        <br>
        ${spacedNewContactData}
      </pre>
    `);
  } catch (err) {
    console.error('Error creating new contact:', err);
    res.status(500).send('Error creating new contact');
  }
});

export default router;
