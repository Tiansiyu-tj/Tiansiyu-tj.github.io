/**
 * PDF 嵌入标签 - 桌面端预览，移动端下载链接
 * Syntax: {% pdfm /path/to/file.pdf %}
 */
'use strict';

hexo.extend.tag.register('pdfm', function(args) {
  const src = args[0];
  const filename = src.split('/').pop().replace('.pdf', '') || 'PDF';
  
  return `
<div class="pdf-container">
  <div class="pdf-embed-desktop">
    <embed src="${src}" type="application/pdf" width="100%" height="600px" />
  </div>
  <div class="pdf-embed-mobile">
    <a href="${src}" target="_blank" class="pdf-mobile-link">📄 ${filename}</a>
  </div>
</div>
<style>
.pdf-container { margin: 20px 0; }
.pdf-embed-desktop { display: block; }
.pdf-embed-mobile { display: none; text-align: center; padding: 20px 0; }
@media (max-width: 768px) {
  .pdf-embed-desktop { display: none; }
  .pdf-embed-mobile { display: block; }
}
.pdf-mobile-link {
  color: #666;
  text-decoration: none;
  border-bottom: 1px dashed #ccc;
  padding-bottom: 2px;
  font-size: 14px;
}
.pdf-mobile-link:hover { color: #333; border-color: #999; }
</style>
`;
});
