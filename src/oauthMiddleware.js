// import { writeFile } from 'fs/promises';

// import getCredentials from './getCredentials.js';
// import { loadClientSecrets } from './googleAuth.js';
// import { TOKEN_PATH } from '../config.js';

// export async function authenticate(req, res, next) {
//   try {
//     const credentials = await getCredentials();
//     const oAuth2Client = await loadClientSecrets(credentials);

//     const { code } = req.query;

//     if (!code) {
//       return res.status(400).send('No authorization code found in request');
//     }

//     const { tokens } = await oAuth2Client.getToken(code);
//     oAuth2Client.setCredentials(tokens);
//     await writeFile(TOKEN_PATH, JSON.stringify(tokens));
//     next();
//   } catch (err) {
//     console.error('Error during authentication:', err);
//     res.status(500).send('Error during authentication');
//   }
// }
