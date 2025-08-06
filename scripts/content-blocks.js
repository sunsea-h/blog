
hexo.extend.filter.register('before_post_render', function (data) {
  const regex = /```ad-([a-z]{2,8})((?:(?!```)[\s\S])*)```/;
  let dataContent = data.content;
  let match = dataContent.match(regex);
  while (match) {
    const index = match.index;
    const [result = '', type = '', content = ''] = match || [];
    let title = type;
    let list = content.split('\n').filter((v) => {
      v = v.trim();
      if (v && !v.startsWith('title:')) return v;

      if (v.startsWith('title:')) {
        title = v.replace('title:', '');
      }
    });

    const newBlock = `{% contentblock ${title.trim()} type:${type.trim()} %}\n${list.join('\n')}\n{% endcontentblock %}`;
    dataContent = `${dataContent.slice(0, index)}${newBlock}${dataContent.slice(index + result.length)}`;
    match = dataContent.match(regex);
  }
  data.content = dataContent;
  return data;
}, 1);