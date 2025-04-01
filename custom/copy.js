const fs = require('fs')
const path = require('path')

function copyFolder(src, dest) {
  fs.mkdirSync(dest, { recursive: true })

  const items = fs.readdirSync(src)

  items.forEach((item) => {
    const srcPath = path.join(src, item)
    const destPath = path.join(dest, item.endsWith('.assets') ? item.replace('.assets', '') : item )

    const stat = fs.statSync(srcPath)
    if (stat.isDirectory()) {
      copyFolder(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  })
}

const notePath = path.resolve('C:/WorkSpace/HXH/notes')
const blogPath = path.resolve(__dirname, '../source/_posts')

const folders = fs.readdirSync(notePath)

const excludes = ['.git', '.obsidian', '.trash', 'WeChat Article', 'Config']

if (fs.existsSync(blogPath)) {
  fs.rmSync(blogPath, { recursive: true })
}
fs.mkdirSync(blogPath)
folders.forEach(folder => {
  if (fs.statSync(path.resolve(notePath, folder)).isDirectory()) {
    if (excludes.includes(folder)){
      return;
    }
    copyFolder(
      path.resolve(notePath, folder),
      path.resolve(blogPath, folder),
    )
  }
});
