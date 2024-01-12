import express from 'express';

import getCredentials from './getCredentials.js';
import { loadClientSecrets } from './googleAuth.js';
import { createNewContact, listConnectionNames, listEmailsAndPhones } from './googlePeopleApi.js';
import { authenticate } from './oauthMiddleware.js';
const router = express.Router();

router.get('/oauth2', authenticate, (req, res) => {
  if (req.query.code) {
    res.send('Authentication successful');
    res.redirect(authUrl);
  } else {
    res.send('No authorization code found in request');
  }
});

// use authenticate middleware to check if user is authenticated

router.get('/listConnectionNames', async (req, res) => {
  try {
    getCredentials();
    const oAuth2Client = await loadClientSecrets();
    await listConnectionNames(oAuth2Client);
    res.send('List Connection Names successful');
  } catch (err) {
    console.error('Error listing connection names:', err);
    res.status(500).send('Error listing connection names');
  }
});

router.get('/listEmailsAndPhones', async (req, res) => {
  try {
    const oAuth2Client = await loadClientSecrets();
    await listEmailsAndPhones(oAuth2Client);
    res.send('List Emails and Phones successful');
  } catch (err) {
    console.error('Error listing emails and phones:', err);
    res.status(500).send('Error listing emails and phones');
  }
});

router.get('/createNewContact', async (req, res) => {
  try {
    const oAuth2Client = await loadClientSecrets();
    await createNewContact(oAuth2Client);
    res.send('Create New Contact successful');
  } catch (err) {
    console.error('Error creating new contact:', err);
    res.status(500).send('Error creating new contact');
  }
});

export default router;
