import express from 'express';

import codeRetrievedRouter from './codeRetrieved.js';
import getContactNamesRouter from './getContactNames.js';
import getEmailsAndPhonesRouter from './getEmailsAndPhones.js';
import { contactTestData, contactBatchTestData, resourceNameTestData, resourceNameBatchTestData } from '../../config.js';
import { loadClientSecrets } from '../googleAuth.js';
import { batchCreateContacts, batchDeleteContacts, createContact, deleteContact, updateContact, batchUpdateContacts } from '../peopleApiServices.js';

const router = express.Router();

router.use(codeRetrievedRouter);
router.use(getContactNamesRouter);
router.use(getEmailsAndPhonesRouter);

// TBD: move this to a separate file
router.get('/createContact', async (req, res) => {
  try {
    const oAuth2Client = await loadClientSecrets();
    const contactData = await createContact(oAuth2Client, contactTestData);

    if (!contactData) {
      res.send('No Contact data Provided.');
      return;
    }

    const contactDataStr = JSON.stringify(contactData, null, 2); // 2 spaces of indentation

    res.send(`
      <pre>
        New Contact added successfully!
        <br>
        <br>
        ${contactDataStr}
      </pre>
    `);
  } catch (err) {
    console.error('Error creating new contact:', err);
    res.status(500).send('Error creating new contact');
  }
});

// add a route to delete a contact
router.get('/deleteContact', async (req, res) => {
  try {
    const oAuth2Client = await loadClientSecrets();
    const contactData = await deleteContact(oAuth2Client, resourceNameTestData);

    if (!contactData) {
      res.send('No Contact data Provided.');
      return;
    }

    const contactDataStr = JSON.stringify(contactData, null, 2); // 2 spaces of indentation

    res.send(`
      <pre>
        Contact deleted successfully!
        <br>
        <br>
        ${contactDataStr}
      </pre>
    `);
  } catch (err) {
    console.error('Error deleting contact:', err);
    res.status(500).send('Error deleting contact');
  }
});

router.get('/batchCreateContacts', async (req, res) => {
  try {
    const oAuth2Client = await loadClientSecrets();
    const contactData = await batchCreateContacts(oAuth2Client, contactBatchTestData);

    if (!contactData) {
      res.send('No Contact data Provided.');
      return;
    }

    const contactDataStr = JSON.stringify(contactData, null, 2); // 2 spaces of indentation

    res.send(`
      <pre>
        New Contacts added successfully!
        <br>
        <br>
        ${contactDataStr}
      </pre>
    `);
  } catch (err) {
    console.error('Error creating new contacts:', err);
    res.status(500).send('Error creating new contacts');
  }
});

router.get('/batchDeleteContacts', async (req, res) => {
  try {
    const oAuth2Client = await loadClientSecrets();
    const contactData = await batchDeleteContacts(oAuth2Client, resourceNameBatchTestData);

    if (!contactData) {
      res.send('No Contact data Provided.');
      return;
    }

    const contactDataStr = JSON.stringify(contactData, null, 2); // 2 spaces of indentation

    res.send(`
      <pre>
        Contacts deleted successfully!
        <br>
        <br>
        ${contactDataStr}
      </pre>
    `);
  } catch (err) {
    console.error('Error deleting contacts:', err);
    res.status(500).send('Error deleting contacts');
  }
});

router.get('/updateContact', async (req, res) => {
  try {
    const oAuth2Client = await loadClientSecrets();
    const contactData = await updateContact(oAuth2Client, contactTestData);

    if (!contactData) {
      res.send('No Contact data Provided.');
      return;
    }

    const contactDataStr = JSON.stringify(contactData, null, 2); // 2 spaces of indentation

    res.send(`
      <pre>
        Contact updated successfully!
        <br>
        <br>
        ${contactDataStr}
      </pre>
    `);
  } catch (err) {
    console.error('Error updating contact:', err);
    res.status(500).send('Error updating contact');
  }
});

router.get('/batchUpdateContacts', async (req, res) => {
  try {
    const oAuth2Client = await loadClientSecrets();
    const contactData = await batchUpdateContacts(oAuth2Client, contactBatchTestData);

    if (!contactData) {
      res.send('No Contact data Provided.');
      return;
    }

    const contactDataStr = JSON.stringify(contactData, null, 2); // 2 spaces of indentation

    res.send(`
      <pre>
        Contacts updated successfully!
        <br>
        <br>
        ${contactDataStr}
      </pre>
    `);
  } catch (err) {
    console.error('Error updating contacts:', err);
    res.status(500).send('Error updating contacts');
  }
});

export default router;
