/**
 * Hexo 自定义标签：fragment
 * 用法：
 * {% fragment green 神清气爽 %}
 * About页焕新~
 * 第二行内容会自动换行
 * {% endfragment %}
 * 
 * 或者不带标题：
 * {% fragment red %}
 * 内容这里写
 * {% endfragment %}
 */

hexo.extend.tag.register('fragment', function(args, content) {
  // 解析参数：第一个是颜色，后面的是标题（可选）
  const color = args[0] || 'grey';
  const title = args.slice(1).join(' ');
  
  // 将 Markdown 换行转换为 <br>
  const processedContent = content
    .trim()
    .replace(/\n/g, '<br>\n');
  
  let html = `<div class="fragment ${color}">`;
  if (title) {
    html += `<div class="fragment-title">${title}</div>`;
  }
  html += processedContent;
  html += '</div>';
  
  return html;
}, { ends: true });

/**
 * Hexo 自定义标签：circle
 * 用法：
 * {% circle blue %}
 * 内容在这里
 * 第二行会自动换行
 * {% endcircle %}
 */

hexo.extend.tag.register('circle', function(args, content) {
  const color = args[0] || 'blue';
  
  const processedContent = content
    .trim()
    .replace(/\n/g, '<br>\n');
  
  return `<div class="circle-${color}">${processedContent}</div>`;
}, { ends: true });
