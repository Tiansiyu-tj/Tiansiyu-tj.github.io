/**
 * 注册全局 HashMap / List 工具类
 * 供 tags.ejs, categories.ejs, recent-updates.ejs, tags-list.ejs, categories-list.ejs 共用
 */

'use strict';

class HashMap {
  constructor() {
    this.map = {};
  }
  put(key, value) {
    this.map[key] = value;
  }
  get(key) {
    return this.map[key];
  }
  containsKey(key) {
    return key in this.map;
  }
  remove(key) {
    delete this.map[key];
  }
  size() {
    return Object.keys(this.map).length;
  }
  isEmpty() {
    return this.size() === 0;
  }
  clear() {
    this.map = {};
  }
}

class List {
  constructor() {
    this.items = [];
  }
  add(item) {
    this.items.push(item);
  }
  remove(item) {
    const index = this.items.indexOf(item);
    if (index > -1) {
      this.items.splice(index, 1);
    }
  }
  get(index) {
    return this.items[index];
  }
  size() {
    return this.items.length;
  }
}

// 注入到 EJS 模板作用域
hexo.extend.filter.register('template_locals', function(locals) {
  locals.HashMap = HashMap;
  locals.List = List;
  return locals;
});

// 公共 Helper: 检查文章是否手动设置了 updated
hexo.extend.helper.register('hasManualUpdated', function(post) {
  var raw = post.raw || '';
  return /^\s*updated:/m.test(raw.substring(0, 1000));
});
