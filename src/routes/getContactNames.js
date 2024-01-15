import express from 'express';

import { loadClientSecrets } from '../googleAuth.js';
import { getContactNames } from '../peopleApiServices.js';

const router = express.Router();

router.get('/getContactNames', async (req, res) => {
  try {
    const oAuth2Client = await loadClientSecrets(credentials);
    const connectionNames = await getContactNames(oAuth2Client);

    if (connectionNames.length === 0) {
      res.status(404).send('No contacts found');
    } else {
      res.render('getContactNames.html', { connectionNames });
    }
  } catch (err) {
    console.error('Error listing connection names:', err);
    res.status(500).send('Error listing connection names');
  }
});

export default router;
