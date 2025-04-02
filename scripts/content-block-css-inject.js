hexo.extend.injector.register('head_end', function() {
  if (hexo.config.theme !== 'butterfly') return ``;
  
  const h = hexo.extend.helper.get('content_blocks_css').bind(hexo);
  return `<style type="text/css">${h()}</style>`;
});
