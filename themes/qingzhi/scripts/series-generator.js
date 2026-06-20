'use strict';

/**
 * 专栏 (Series) 生成器
 * 
 * 用法：在文章 front matter 中添加：
 *   series: 原子物理学
 *   series_slug: atomic-physics   （可选，用于生成洁净 URL）
 * 
 * 如果不写 series_slug，则自动回退到中文名（也能工作，但 URL 不够简洁）
 * 只要同一专栏中任意一篇文章写了 series_slug，整个专栏都会使用该 slug。
 * 
 * 会自动生成：
 *   /series/                     — 专栏总览页
 *   /series/{slug}/              — 单个专栏详情页
 */

hexo.extend.generator.register('series', function (locals) {
  var posts = locals.posts.toArray().filter(function (post) {
    return post.series && !post.hide;
  });

  // 按 series 字段分组
  var seriesMap = {};
  var slugMap = {};  // series名 -> slug

  posts.forEach(function (post) {
    var name = post.series;
    if (!seriesMap[name]) {
      seriesMap[name] = [];
    }
    seriesMap[name].push(post);

    // 收集 slug（任意一篇文章提供即可）
    if (post.series_slug) {
      if (!slugMap[name]) {
        slugMap[name] = post.series_slug;
      } else if (slugMap[name] !== post.series_slug) {
        // ⚠️ 检测到冲突：同一专栏有不同 slug
        hexo.log.warn('Series "' + name + '" has conflicting slugs: "' + slugMap[name] + '" and "' + post.series_slug + '" (using "' + slugMap[name] + '")');
      }
    }
  });

  // 每个专栏内部按日期排序（旧→新）
  Object.keys(seriesMap).forEach(function (name) {
    seriesMap[name].sort(function (a, b) {
      return a.date - b.date;
    });
  });

  var seriesNames = Object.keys(seriesMap);

  // 为没有 slug 的专栏生成一个简单 slug（用中文名兜底）
  seriesNames.forEach(function (name) {
    if (!slugMap[name]) {
      slugMap[name] = name;
    }
  });

  // 从名字生成稳定的柔和色相（HSL）
  function nameToColor(name) {
    var hash = 0;
    for (var i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    var hue = ((hash % 360) + 360) % 360;
    return 'hsl(' + hue + ', 50%, 62%)';
  }

  // 收集自定义颜色（从任意文章的 series_color 取）
  var colorMap = {};
  // 收集自定义图标（从任意文章的 series_icon 取，默认 📖）
  var iconMap = {};
  posts.forEach(function (post) {
    if (post.series_color && !colorMap[post.series]) {
      colorMap[post.series] = post.series_color;
    }
    if (post.series_icon && !iconMap[post.series]) {
      iconMap[post.series] = post.series_icon;
    }
  });

  // 统计信息
  var seriesInfo = {};
  seriesNames.forEach(function (name) {
    var arr = seriesMap[name];
    seriesInfo[name] = {
      count: arr.length,
      latest: arr[arr.length - 1],
      first: arr[0],
      slug: slugMap[name],
      color: colorMap[name] || nameToColor(name),
      icon: iconMap[name] || '📖',
      initial: name.charAt(0)
    };
  });

  var result = [];

  // 专栏总览页
  result.push({
    path: 'series/index.html',
    data: {
      title: '专栏',
      comment: false,
      seriesMap: seriesMap,
      seriesNames: seriesNames,
      seriesInfo: seriesInfo,
      slugMap: slugMap
    },
    layout: ['post']
  });

  // 各专栏详情页
  seriesNames.forEach(function (name) {
    var slug = slugMap[name];
    var info = seriesInfo[name];
    result.push({
      path: 'series/' + slug + '/index.html',
      data: {
        title: '专栏: ' + name,
        comment: false,
        seriesName: name,
        seriesPosts: seriesMap[name],
        seriesSlug: slug,
        seriesColor: info.color,
        seriesIcon: info.icon,
        seriesInitial: info.initial
      },
      layout: ['post']
    });
  });

  return result;
});
