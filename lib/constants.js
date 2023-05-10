import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

/** Constants */
export const constants = {
  /** @type {string} SQLite3 DB File Path */
  dbFilePath: path.resolve(__dirname, '../tmp/db.sqlite3'),
  
  /** @type {string} Web Site Directory Path */
  rootDirectoryPath: '/PATH/TO/neos21.net/dist',
  
  /** @type {string} Base Domain Name */
  baseDomainName: 'https://neos21.net'
};
