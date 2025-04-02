hexo.extend.filter.register('theme_inject', function(injects) {
  injects.head.file('content_blocks', 'source/_inject/head.ejs');
});