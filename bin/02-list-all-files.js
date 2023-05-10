import path from 'node:path';

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

import { constants } from '../lib/constants.js';
import { logger } from '../lib/logger.js';
import { listFiles } from '../lib/list-files.js';

(async () => {
  logger.info('[List All Files]', 'Start');  // 全ファイルのリストを DB に投入する
  
  const allFiles = listFiles(constants.rootDirectoryPath).filter(filePath => !filePath.includes('/.git/'));  // `.git/` ディレクトリを除く
  const htmls  = allFiles.filter(filePath =>  ['.html', '.htm'].includes(path.extname(filePath)));
  const assets = allFiles.filter(filePath => !['.html', '.htm'].includes(path.extname(filePath)));
  logger.info(`All [${allFiles.length}] : HTML [${htmls.length}] : Assets [${assets.length}] : Total [${htmls.length + assets.length}]`);
  
  const db = await open({
    filename: constants.dbFilePath,
    driver: sqlite3.cached.Database
  });

  for(const filePath of htmls) {
    const pathName = filePath.replace(constants.rootDirectoryPath, '');  // スラッシュ始まりのルート相対パス
    const url      = new URL(pathName, constants.baseDomainName).href;   // URL
    await db.run('INSERT INTO htmls (url, file_path) VALUES (?, ?)', url, filePath);
  }
  
  for(const filePath of assets) {
    const pathName = filePath.replace(constants.rootDirectoryPath, '');  // スラッシュ始まりのルート相対パス
    const url      = new URL(pathName, constants.baseDomainName).href;   // URL
    await db.run('INSERT INTO assets (url, file_path) VALUES (?, ?)', url, filePath);
  }
  
  await db.close();
  logger.info('[List All Files]', 'Finished');
})();
