/**
 * Hexo Filter：自动处理 fragment/circle 内的换行
 * 仅在两行纯文本之间添加 <br>，title 后第一行不加
 */

hexo.extend.filter.register('before_post_render', function(data) {
  if (!data.content) return data;
  
  const blockRegex = /(<div class="(?:fragment|circle-)[^"]*">)([\s\S]*?)(<\/div>)(?=\s*(?:<|\n#|$))/g;
  
  data.content = data.content.replace(blockRegex, function(match, openTag, content, closeTag) {
    if (/<br\s*\/?>/i.test(content)) return match;
    
    const lines = content.split('\n');
    const result = [];
    let textCount = 0; // 计数纯文本行
    
    for (const line of lines) {
      const t = line.trim();
      if (!t || t.startsWith('<') || t.endsWith('>')) {
        result.push(line);
        continue;
      }
      // 纯文本行：第二行及之后加 <br>
      textCount++;
      result.push(textCount > 1 ? '<br>' + line : line);
    }
    
    return openTag + result.join('\n') + closeTag;
  });
  
  return data;
});
