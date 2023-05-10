import fs from 'node:fs';

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { JSDOM } from 'jsdom';

import { constants } from '../lib/constants.js';
import { logger } from '../lib/logger.js';

/**
 * サイト内リンクを抽出する
 * 
 * @param {string} url HTML の URL
 * @param {string} htmlFilePath HTML ファイルパス
 * @return {Array<{ targetUrl: string; rawHref: string; }>} サイト内リンクの配列
 */
const crawlAnchors = (url, htmlFilePath) => {
  // HTML ファイルを読み込む
  const htmlText = fs.readFileSync(htmlFilePath, 'utf-8');
  const { document } = (new JSDOM(htmlText)).window;
  // `a` 要素を取得する
  const rawAnchorElements = document.querySelectorAll('#main a:not(.header-link)');
  const anchorElements = [...rawAnchorElements].filter(anchorElement => !(/^https?:\/\//).test(anchorElement.getAttribute('href')));
  logger.info('  Crawling', url, anchorElements.length);
  
  const anchors = anchorElements.map(anchorElement => {
    const rawHref = (anchorElement.getAttribute('href') ?? '').replace('about:blank#', '#');
    const targetUrl = new URL(rawHref, url).href;
    return { targetUrl, rawHref };
  });
  return anchors;
};

(async () => {
  logger.info('[Crawl HTMLs]', 'Start');  // HTML ファイルをクロールする
  
  const db = await open({
    filename: constants.dbFilePath,
    driver: sqlite3.cached.Database
  });
  
  /** @type {Array<{ url: string; file_path: string; }} `htmls` テーブルのデータ */
  const htmls = await db.all('SELECT url, file_path FROM htmls');
  
  for(const html of htmls) {
    const { url: sourceUrl, file_path: sourceFilePath } = html;
    const anchors = crawlAnchors(sourceUrl, sourceFilePath);
    for(const anchor of anchors) {
      await db.run('INSERT INTO link_anchors (target_url, raw_href, source_url, source_file_path) VALUES (?, ?, ?, ?)', [anchor.targetUrl, anchor.rawHref, sourceUrl, sourceFilePath]);
    }
  }
  
  await db.close();
  logger.info('[Crawl HTMLs]', 'Finished');
})();
