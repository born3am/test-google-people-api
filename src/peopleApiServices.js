import { google } from 'googleapis';

import { newContactData } from '../config.js';

export async function createNewContact(auth, newData = newContactData) {
  const service = google.people({ version: 'v1', auth });

  // Fetch existing contacts
  const { data: existingContacts } = await service.people.connections.list({
    resourceName: 'people/me',
    pageSize: 100,
    personFields: 'emailAddresses',
  });

  // Check if a contact with the same email already exists
  const isDuplicate = existingContacts.connections.some((contact) => {
    const emailMatch = contact.emailAddresses?.some((email) => email.value.trim().toLowerCase() === newData.emailAddresses[0].value.trim().toLowerCase());
    return emailMatch;
  });

  // If a duplicate exists, don't create a new contact
  if (isDuplicate) {
    console.log('A contact with the same email already exists.');
    return false;
  }

  // Create a new contact
  const { data } = await service.people.createContact({
    requestBody: newData,
  });

  console.log(data);

  return data;
}

export async function listConnectionNames(auth) {
  const service = google.people({ version: 'v1', auth });
  const res = await service.people.connections.list({
    resourceName: 'people/me',
    personFields: 'names',
  });

  const { connections } = res.data;
  const names = [];
  if (connections) {
    connections.forEach((person) => {
      if (person.names && person.names.length > 0) {
        console.log(person.names[0].displayName);
        names.push(person.names[0].displayName);
      } else {
        console.log('No display name found for connection.');
      }
    });
  } else {
    console.log('No connections found.');
  }
  return names;
}

export async function listEmailsAndPhones(auth) {
  const service = google.people({ version: 'v1', auth });
  const { data } = await service.people.connections.list({
    resourceName: 'people/me',
    pageSize: 100,
    personFields: 'names,emailAddresses,phoneNumbers',
  });

  const { connections } = data;

  const contacts = [];

  if (connections) {
    connections.forEach((person) => {
      let name = '';
      let email = '';
      let phone = '';

      if (person.names && person.names.length > 0) {
        console.log(person.names[0].displayName);
        name = person.names[0].displayName;
      } else {
        console.log('No display name found for connection.');
      }
      if (person.emailAddresses && person.emailAddresses.length > 0) {
        console.log(person.emailAddresses[0].value);
        email = person.emailAddresses[0].value;
      } else {
        console.log('No email found for connection.');
      }
      if (person.phoneNumbers && person.phoneNumbers.length > 0) {
        console.log(person.phoneNumbers[0].value);
        phone = person.phoneNumbers[0].value;
      } else {
        console.log('No phone number found for connection.');
      }

      contacts.push({ name, email, phone });
    });
  }

  return contacts;
}
