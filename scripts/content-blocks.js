
hexo.extend.filter.register('before_post_render', function (data) {
  const regex = /```ad-(\S*)\s*[\n]{1,}\s*title:([^(\n)]*)[ ]*\n((?!`{3})([^`]+))```/;
  let dataContent = data.content;
  let match = dataContent.match(regex);
  while(match) {
    const index = match.index;
    const length = match[0].length;
    const type = match[1]?.trim();
    const title = match[2]?.trim();
    const content = match[3];
    const newBlock = `{% contentblock ${title} type:${type} %}\n${content}\n{% endcontentblock %}`;
    dataContent = `${dataContent.slice(0, index)}${newBlock}${dataContent.slice(index + length)}`
    match = dataContent.match(regex);
  }
  data.content = dataContent;
  return data
}, 1)