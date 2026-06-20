/**
 * 晴纸主题公共 Helper 函数
 * 统一 CDN URL 生成、HashMap/List 数据结构、文章工具函数
 */

'use strict';

// ─── CDN URL 前缀 Helper ───
hexo.extend.helper.register('cdnPrefix', function () {
  var theme = this.theme;
  if (!theme.cdn.enable || !theme.cdn.choose) return '';
  var map = {
    aliyun:   'https://npm.elemecdn.com/hexo-theme-a4@latest/source/',
    jsdelivr: 'https://jsd.onmicrosoft.cn/npm/hexo-theme-a4@latest/source/',
    zzko:     'https://jsd.cdn.zzko.cn/npm/hexo-theme-a4@latest/source/',
    unpkg:    'https://npm.onmicrosoft.cn/hexo-theme-a4@latest/source/'
  };
  return map[theme.cdn.choose] || '';
});

// ─── 判断文章是否有手动更新时间（与文件修改时间不同） ───
hexo.extend.helper.register('hasManualUpdated', function (post) {
  if (!post || !post.updated) return false;
  var u = new Date(post.updated).getTime();
  var d = new Date(post.date).getTime();
  // 如果 updated 与 date 相差超过 60 秒，视为手动更新
  return Math.abs(u - d) > 60000;
});

// ─── 获取所有文章按年分组（供 list / recent-updates 使用） ───
hexo.extend.helper.register('postsByYear', function () {
  var posts = this.site.posts.sort('-date').data || [];
  var years = {};
  var yearOrder = [];
  posts.forEach(function (p) {
    if (p.hide) return;
    var y = new Date(p.date).getFullYear();
    if (!years[y]) {
      years[y] = [];
      yearOrder.push(y);
    }
    years[y].push(p);
  });
  return { years: years, order: yearOrder };
});

// ─── 获取最近更新的文章（按 updated 排序） ───
hexo.extend.helper.register('recentUpdatedPosts', function (count) {
  count = count || 3;
  var posts = this.site.posts.data || [];
  var sorted = posts.filter(function (p) { return !p.hide; })
    .sort(function (a, b) {
      var ua = new Date(a.updated || a.date).getTime();
      var ub = new Date(b.updated || b.date).getTime();
      return ub - ua;
    });
  return sorted.slice(0, count);
});
