import express from 'express';

import { loadClientSecrets } from '../googleAuth.js';
import { getEmailsAndPhones } from '../peopleApiServices.js';

const router = express.Router();

router.get('/getEmailsAndPhones', async (req, res) => {
  try {
    const oAuth2Client = await loadClientSecrets();
    const contacts = await getEmailsAndPhones(oAuth2Client);

    if (!contacts || contacts.length === 0) {
      res.status(404).send('No contacts found.');
      return;
    }

    res.render('getEmailsAndPhones.html', { contacts });
  } catch (err) {
    console.error('Error listing emails and phones:', err);
    res.status(500).send(`Error listing emails and phones: ${err.message}`);
  }
});

export default router;
