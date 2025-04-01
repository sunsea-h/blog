hexo.extend.filter.register('before_post_render', function(data) {
  if (data.layout !== 'post') return data
  const { config } = this;
  const asset_folder = data.slug;
  data.content = data.content.replace(/!{1}\[([^\[\]]*)\]\((\S*)\s?(?:".*")?\)/g,
    function (match_str, label, path) {
      const parts = path.split('/');
      const new_assets = asset_folder.split('/').pop();
      if (parts.length === 2) {
        const url = config.relative_link ? parts[1] : `${asset_folder}/${parts[1]}`;
        return `![${label}](${url})`;
      }
      return match_str;
    });
  return data;
});
