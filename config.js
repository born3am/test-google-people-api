// If modifying these scopes, delete token.json.
export const SCOPES = ['https://www.googleapis.com/auth/contacts'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
export const TOKEN_PATH = './secret/token.json';
export const CREDENTIALS_PATH = './secret/credentials.json';

export const PORT = 4001;

export const contactTestData = {
  namePartOne: 'Peter',
  email: 'user@user.com',
  phone: '2222222',
  namePartTwo: 'PC-NETFLIX',
  resourceName: 'people/c443589039318347139',
};

export const resourceNameTestData = "people/c443589039318347139"


export const contactBatchTestData = [
  {
    namePartOne: 'John',
    email: 'john@test.de',
    phone: '222222',
    namePartTwo: 'PC-DISNEY',
    resourceName: 'people/c8610505935101117100'
  },
  {
    namePartOne: 'Jack',
    email: 'jack@test.de',
    phone: '222222',
    namePartTwo: 'PC-APPLE',
    resourceName: 'people/c8540850829724236721'
  },
  {
    namePartOne: 'Jane',
    email: 'jane@test.de',
    phone: '22222222',
    namePartTwo: 'PC-AMAZON',
    resourceName: 'people/c9172963066780866448'
  },
];

export  const resourceNameBatchTestData = [
  'people/c8610505935101117100',
  'people/c8540850829724236721',
  'people/c9172963066780866448',
];