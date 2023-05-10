import fs from 'node:fs';
import path from 'node:path';

/**
 * 指定のディレクトリパス配下のファイルを全て列挙する
 * 
 * @param {string} targetDirectoryPath ディレクトリパス・末尾スラッシュなし
 * @return {Array<string>} ファイルパスの配列
 */
export const listFiles = targetDirectoryPath => fs.readdirSync(targetDirectoryPath, { withFileTypes: true }).flatMap(dirent => {
  const name = `${targetDirectoryPath}${path.sep}${dirent.name}`;
  return dirent.isFile() ? [name] : listFiles(name);
});
