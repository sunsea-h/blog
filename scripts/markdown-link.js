hexo.extend.filter.register('before_post_render', function (data) {
  if (data.layout !== 'post') return data;
  data.content = data.content.replace(/\[([^\[\]]*)\]\((\S*)\s?(?:".*")?\)/g,
    function (match_str, label, path) {
      if (!path.startsWith('http') && (path.endsWith('.md') || path.includes('.md#'))) {
        let newPath = path
          .split('/')
          .filter((v) => !['.', '..'].includes(v))
          .map((v) => v.replace(/\.md/g, '/'))
          .join('/');
        if (path.startsWith('../')) {
          newPath = `/blog/${newPath}`;
        } else {
          newPath = `../${newPath}`;
        }
        return `[${label}](${newPath})`;
      }
      return match_str;
    });
  return data;
});
