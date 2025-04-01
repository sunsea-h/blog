hexo.extend.filter.register('before_post_render', data => {
  if (data.layout !== 'post') return data;

  // 替换双大括号为 HTML 实体转义
  data.content = data.content.replace(/\{\{/g, '&#123;&#123;').replace(/\}\}/g, '&#125;&#125;');

  return data;
});