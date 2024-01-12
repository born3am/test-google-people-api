// If modifying these scopes, delete token.json.
export const SCOPES = ['https://www.googleapis.com/auth/contacts'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
export const TOKEN_PATH = './secret/token.json';
export const CREDENTIALS_PATH = './secret/credentials.json';

export const PORT = 4001;

export const newContactData = {
    names: [
      {
        displayName: 'Joaozinho',
        givenName: 'Joaozinho',
        familyName: 'Joaozinho',
      },
    ],
    emailAddresses: [
      {
        value: 'pedrinho@pakcon.de',
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
        region: 'São Paulo',
        country: 'Brazil',
        postalCode: '01310-100',
        type: 'home',
      },
    ],
};
