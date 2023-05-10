import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

import { constants } from '../lib/constants.js';
import { logger } from '../lib/logger.js';

(async () => {
  logger.info('[Check Link Anchors]', 'Start');  // `a` 要素のリンク先が存在するかチェックする
  
  const db = await open({
    filename: constants.dbFilePath,
    driver: sqlite3.cached.Database
  });
  
  const urls = (await db.all('SELECT url FROM htmls')).map(row => row.url);
  const linkAnchors = await db.all('SELECT target_url, raw_href, source_url, source_file_path FROM link_anchors');
  console.log(urls.length, linkAnchors.length);
  
  for(const linkAnchor of linkAnchors) {
    const { target_url: rawTargetUrl, source_url: sourceUrl } = linkAnchor;
    const targetUrl = rawTargetUrl.replace(/#.*/, '');  // ココではハッシュリンクは削除する
    
    if(urls.includes(targetUrl)) {
      logger.info('○ 正常リンク', targetUrl);
      await db.run('UPDATE htmls SET is_linked = ? WHERE url = ?', [1, targetUrl]);
      await db.run('UPDATE link_anchors SET is_exist = ? WHERE target_url = ? AND source_url = ?', [1, rawTargetUrl, sourceUrl]);
    }
    else {
      logger.warn('====================');
      logger.warn('× リンク切れ発見！！', targetUrl);
      logger.warn('====================');
    }
  }
  
  await db.close();
  logger.info('[Check Link Anchors]', 'Finished');
})();
