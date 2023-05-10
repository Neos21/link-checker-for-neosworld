import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

import { constants } from '../lib/constants.js';
import { logger } from '../lib/logger.js';

(async () => {
  logger.info('[Create Table]', 'Start');  // DB ファイルを初期化する
  
  const db = await open({
    filename: constants.dbFilePath,
    driver: sqlite3.cached.Database
  });
  
  await db.exec('DROP TABLE IF EXISTS htmls');
  await db.exec('DROP TABLE IF EXISTS assets');
  await db.exec('DROP TABLE IF EXISTS link_anchors');
  
  await db.exec(`CREATE TABLE IF NOT EXISTS htmls (
    url        TEXT     NOT NULL  PRIMARY KEY,
    file_path  TEXT     NOT NULL,
    is_linked  INTEGER  NOT NULL  DEFAULT 0
  )`);
  await db.exec(`CREATE TABLE IF NOT EXISTS assets (
    url        TEXT     NOT NULL  PRIMARY KEY,
    file_path  TEXT     NOT NULL,
    is_linked  INTEGER  NOT NULL  DEFAULT 0
  )`);
  
  await db.exec(`CREATE TABLE IF NOT EXISTS link_anchors (
    target_url        TEXT     NOT NULL,
    raw_href          TEXT     NOT NULL,
    source_url        TEXT     NOT NULL,
    source_file_path  TEXT     NOT NULL,
    is_exist          INTEGER  NOT NULL  DEFAULT 0
  )`);
  
  await db.close()
  logger.info('[Create Table]', 'Finished');
})();
