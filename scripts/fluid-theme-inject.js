hexo.extend.filter.register('theme_inject', function(injects) {
  if (hexo.config.theme !== 'fluid') return;

  injects.head.file('content_blocks', 'source/_inject/head.ejs');
});