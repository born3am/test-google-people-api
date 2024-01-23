/* eslint-disable promise/prefer-await-to-callbacks */
import { google } from 'googleapis';

async function getContactNames(auth) {
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

async function getEmailsAndPhones(auth) {
  const service = google.people({ version: 'v1', auth });
  const { data } = await service.people.connections.list({
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

const buildRequestBody = (contactObj, etag) => {
  // Etag is Optional, only needed for updateContact
  // namePartThree is Optional, only needed for Pup contacts
  const { email, phone, namePartOne, namePartTwo, namePartThree } = contactObj; // if namePartThree not provided, it will be undefined

  // For "recipientContact" use: "nameFirst" as "namePartOne"; "recipientToken" as "namePartTwo" --> example of contactDisplay: "Simba (PC-SIMBAEG)"
  // For "pupContact" use: "idPartner" as "namePartOne"; "owner" as "namePartTwo"; "name" as "pupName" --> example of contactDisplay: "DE20405-KOL021 (Josef) - Kollwitz Spätkauf"

  const payload = {
    requestBody: {
      names: [{ givenName: namePartOne, middleName: `(${namePartTwo})`, familyName: namePartThree ? `- ${namePartThree}` : '' }],
      emailAddresses: [{ value: email }],
      phoneNumbers: [{ value: phone }],
      etag,
    },
  };

  return payload;
};

const getEtag = async (auth, resourceName) => {
  const service = google.people({ version: 'v1', auth });

  const requestOptions = {
    resourceName,
    personFields: 'names,emailAddresses,phoneNumbers',
  };

  return await service.people
    .get(requestOptions)
    .then((response) => {
      const { etag } = response.data;
      return etag;
    })
    .catch((error) => {
      console.log(`Error getting etag for resourceName "${resourceName}" on account`);
      throw error;
    });
};

const createSingleContact = async (auth, contactObj) => {
  const service = google.people({ version: 'v1', auth });

  const requestOptions = buildRequestBody(contactObj);
  const { namePartOne, namePartTwo } = contactObj;
  const contactDisplay = `${namePartOne} (${namePartTwo})`;

  return await service.people
    .createContact(requestOptions)
    .then((response) => {
      const { resourceName } = response.data;
      console.log(`Contact "${contactDisplay}" created successfully on account with resource name ${resourceName}`);

      if (!resourceName) {
        console.log(`Error creating contact "${contactDisplay}" on account`);
        throw new Error(`Error creating contact "${contactDisplay}" on account`);
      }

      return {
        contactDisplay,
        resourceName,
      };
    })
    .catch((error) => {
      console.log(`Error creating contact "${contactDisplay}" on account`);
      throw error;
    });
};

const deleteSingleContact = async (auth, resourceName) => {
  const service = google.people({ version: 'v1', auth });

  return await service.people
    .deleteContact({ resourceName })
    .then(() => {
      console.log(`Contact with resourceName "${resourceName}" deleted successfully on account`);

      return { resourceName };
    })
    .catch((error) => {
      console.log(`Error deleting contact with resourceName "${resourceName}" on account`);
      throw error;
    });
};

const updateSingleContact = async (auth, contactObj) => {
  const service = google.people({ version: 'v1', auth });

  const { namePartOne, namePartTwo, resourceName } = contactObj;
  const contactDisplay = `${namePartOne} (${namePartTwo})`;

  if (!resourceName) {
    console.log(`Contact "${contactDisplay}" on account do not have a resourceName. Not possible to retrieve etag`);

    throw new Error(`Contact "${contactDisplay}" on account do not have a resourceName. Not possible to retrieve etag`);
  }

  const retrievedEtag = await getEtag(auth, resourceName);

  if (!retrievedEtag) {
    console.log(`Contact "${contactDisplay}" with resourceName "${resourceName}" on account did not retrieve an etag`);

    throw new Error(`Contact "${contactDisplay}" with resourceName "${resourceName}" on account did not retrieve an etag`);
  }

  const requestOptions = buildRequestBody(contactObj, retrievedEtag);

  const updateOptions = {
    ...requestOptions,
    resourceName,
    updatePersonFields: 'names,emailAddresses,phoneNumbers',
  };

  return await service.people
    .updateContact(updateOptions)
    .then(() => {
      console.log(`Contact "${contactDisplay}" with resourceName "${resourceName}" and etag "${retrievedEtag}" updated successfully on account`);

      return {
        contactDisplay,
        resourceName,
        retrievedEtag,
      };
    })
    .catch((error) => {
      console.log(`Error updating contact "${contactDisplay}" with resourceName "${resourceName}" and etag "${retrievedEtag}" on account`);
      throw error;
    });
};

// Batch functions: intended to be used for first time setup, and/or only when config parameter is enabled

const batchFetchContactsFindIdentifiers = async (auth, namePartOne, namePartTwo) => {
  const service = google.people({ version: 'v1', auth });

  // https://developers.google.com/people/api/rest/v1/people.connections/list#query-parameters
  const queryParams = {
    resourceName: 'people/me',
    pageSize: 500, // Amount of contacts retrieved per page (max is 2000)
    sortOrder: 'LAST_MODIFIED_DESCENDING', // Newer entries first: https://developers.google.com/people/api/rest/v1/people.connections/list#sortorder
    personFields: 'names',
  };

  let nextPageToken; // Page token to retrieve next page when amount of contacts is greater than pageSize (needs to be redefined in each iteration)
  try {
    do {
      const response = await service.people.connections.list({
        ...queryParams,
        pageToken: nextPageToken,
      });

      const { connections, nextPageToken: nextPage } = response.data;

      // eslint-disable-next-line camelcase
      const contactFound = connections?.find((connection) => {
        const { givenName, middleName } = connection.names?.[0] || { givenName: '', middleName: '' };

        const contactNames = `${givenName} ${middleName}`.toLowerCase();
        const inputNames = `${namePartOne} (${namePartTwo})`.toLowerCase();

        return contactNames === inputNames;
      });

      // "ResourceName" is needed to delete or update a contact
      // "Etags" are needed to update a contact
      if (contactFound?.resourceName && contactFound?.etag) {
        const etagResourceObj = { etag: contactFound.etag, resourceName: contactFound.resourceName };
        return etagResourceObj;
      }

      // If contact still not found and nextPage in response.data still has a value, set nextPageToken to retrieve next page, otherwise set it to undefined and exit loop
      nextPageToken = nextPage || undefined;
    } while (nextPageToken);
  } catch (error) {
    console.log(`Error listing contacts for ${namePartOne} (${namePartTwo}): ${error}`);
    throw error;
  }

  console.log(`Contact not found for ${namePartOne} (${namePartTwo})`);
  return undefined;
};

const batchSearchContactFindIdentifiers = async (auth, namePartOne, namePartTwo) => {
  const service = google.people({ version: 'v1', auth });

  const queryParams = {
    readMask: 'names', // required: restricts the fields retrieved in the response
    pageSize: 10, // Amount of results to return. Max is 30.
    query: `${namePartOne} (${namePartTwo})`, // required: query string to search for
  };

  return await service.people
    .searchContacts(queryParams)
    .then((response) => {
      const { results } = response.data;

      // eslint-disable-next-line camelcase
      const contactFound = results?.find((result) => {
        const { givenName, middleName } = result.person?.names?.[0] || { givenName: '', middleName: '' };

        const contactNames = `${givenName} ${middleName}`.toLowerCase();
        const inputNames = `${namePartOne} (${namePartTwo})`.toLowerCase();

        return contactNames === inputNames;
      });

      if (!contactFound?.person?.resourceName || !contactFound?.person?.etag) {
        console.log(`Contact not found for ${namePartOne} (${namePartTwo})`);
        return undefined;
      }

      // "ResourceName" is needed to delete or update a contact
      // "Etags" are needed to update a contact
      const { resourceName, etag } = contactFound.person;
      const etagResourceObj = { etag, resourceName };

      return etagResourceObj;
    })
    .catch((error) => {
      console.log(`Error searching contacts for ${namePartOne} (${namePartTwo}): ${error}`);
      throw error;
    });
};

const batchCreateContacts = async (auth, contactsObjArray) => {
  const createContactPromises = contactsObjArray.map((contactObj) => createSingleContact(auth, contactObj));

  return Promise.all(createContactPromises)
    .then((namesResourceArray) => {
      console.log(`Batch of contacts created successfully on account`);

      return namesResourceArray;
    })
    .catch((error) => {
      console.log(`Error creating batch of contacts on account`);
      throw error;
    });
};

const batchDeleteContacts = async (auth, resourceNameArray) => {
  const deleteContactPromises = resourceNameArray.map((resourceName) => deleteSingleContact(auth, resourceName));

  return Promise.all(deleteContactPromises)
    .then((deletedContactsArray) => {
      const validDeletedContactsArray = deletedContactsArray.filter((contact) => contact?.resourceName !== null);

      if (validDeletedContactsArray.length === 0) {
        console.log(`No contacts deleted on account `);
        return; // Return undefined if no contacts were deleted
      }

      console.log(`Batch of contacts deleted successfully on account`);
      console.log(`Deleted contacts were: ${JSON.stringify(deletedContactsArray)}`);

      return deletedContactsArray;
    })
    .catch((error) => {
      console.log(`Error deleting batch of contacts on account`);
      throw error;
    });
};

const batchUpdateContacts = async (auth, contactsObjArray) => {
  const updateContactPromises = contactsObjArray.map((contactObj) => updateSingleContact(auth, contactObj));

  return Promise.all(updateContactPromises)
    .then((updatedContactsArray) => {
      const validUpdatedContactsArray = updatedContactsArray.filter((contact) => contact?.resourceName !== null && contact?.retrievedEtag !== null);

      if (validUpdatedContactsArray.length === 0) {
        console.log(`No contacts updated on account `);
        return; // Return undefined if no contacts were updated
      }

      console.log(`Batch of contacts updated successfully on account`);
      console.log(`Updated contacts were: ${JSON.stringify(updatedContactsArray)}`);

      return updatedContactsArray;
    })
    .catch((error) => {
      console.log(`Error updating batch of contacts on account`);
      throw error;
    });
};

// Regular functions: intended to be used for ongoing operations
const createContact = async (auth, contact) => {
  if (Array.isArray(contact)) {
    return await batchCreateContacts(auth, contact);
  }

  return await createSingleContact(auth, contact);
};

const deleteContact = async (auth, resourceName) => {
  if (Array.isArray(resourceName)) {
    return await batchDeleteContacts(auth, resourceName);
  }

  return await deleteSingleContact(auth, resourceName);
};

const updateContact = async (auth, contact) => {
  if (Array.isArray(contact)) {
    return await batchUpdateContacts(auth, contact);
  }

  return await updateSingleContact(auth, contact);
};

export {
  batchCreateContacts,
  batchDeleteContacts,
  batchFetchContactsFindIdentifiers,
  batchUpdateContacts,
  createContact,
  deleteContact,
  getContactNames,
  getEmailsAndPhones,
  updateContact,
};
