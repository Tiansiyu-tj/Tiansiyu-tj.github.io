/* 自动扫描 _partial/tools/ 目录，返回工具文件名列表 */
const fs = require('fs');
const path = require('path');

hexo.extend.helper.register('toolFileList', function() {
  const toolsDir = path.join(hexo.theme_dir, 'layout/_partial/tools');
  try {
    return fs.readdirSync(toolsDir)
      .filter(f => f.endsWith('.ejs') && !f.startsWith('_'))
      .map(f => f.replace('.ejs', ''));
  } catch (e) {
    return [];
  }
});
