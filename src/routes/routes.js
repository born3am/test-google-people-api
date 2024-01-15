import express from 'express';

import codeRetrievedRouter from './codeRetrieved.js';
import getContactNamesRouter from './getContactNames.js';
import getEmailsAndPhonesRouter from './getEmailsAndPhones.js';
import { loadClientSecrets } from '../googleAuth.js';
import { createNewContact } from '../peopleApiServices.js';

const router = express.Router();

router.use(codeRetrievedRouter);
router.use(getContactNamesRouter);
router.use(getEmailsAndPhonesRouter);

// TBD: move this to a separate file
router.get('/createNewContact', async (req, res) => {
  try {
    const oAuth2Client = await loadClientSecrets();
    const newContactData = await createNewContact(oAuth2Client);

    if (!newContactData) {
      res.send('Contact already exists. Duplicate not created.');
      return;
    }

    const contactDataStr = JSON.stringify(newContactData, null, 2); // 2 spaces of indentation
    const formattedContactData = contactDataStr.replace(/ /g, '&nbsp;').replace(/\n/g, '<br>');

    res.send(`
      <pre>
        New Contact added successfully!
        <br>
        <br>
        ${formattedContactData}
      </pre>
    `);
  } catch (err) {
    console.error('Error creating new contact:', err);
    res.status(500).send('Error creating new contact');
  }
});

export default router;
