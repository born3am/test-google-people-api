import { google } from 'googleapis';

export async function createNewContact(auth) {
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

/**
 * Print the display name if available for 10 connections.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
export async function listConnectionNames(auth) {
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

export async function listEmailsAndPhones(auth) {
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
