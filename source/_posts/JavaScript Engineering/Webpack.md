---
title: Webpack
categories:
  - JavaScript Engineering
date: 2022-09-26 09:27:58
updated: 2025-04-14 18:16:06
---
# webpack

## 介绍

webpack 是一个静态模块打包器（module bundler）。  
webpack 视 HTML，JS，CSS，图片等文件都是一种 **资源**，每个资源文件都是一个模块（module）文件。  
webpack 就是根据每个模块文件之间的依赖关系将所有的模块打包（bundle）起来，然后输出可以正常运行的文件。
- 多份资源文件打包成一个 Bundle
- 支持 Babel，Eslint，TS，[CoffeSccript](http://coffeescript.cn/)，Less，Sass
- 支持模块化处理 css，图片等资源文件
- 支持 HMR + 开发服务器
- 支持持续监听，持续构建
- 支持代码分离
- 支持 Tree-shaking
- 支持 Sourcemap

![webpack整合](Webpack.assets/Webpack_image_1.jpeg)

webpack 默认可以处理 js 文件、json 文件。  
生产环境下比开发环境多了压缩代码和代码混淆。

## 工作模式

想要修改 Webpack 工作模式的方式有两种：
- 通过 CLI--mode 参数传入
- 通过配置文件设置 mode 属性

## Hello World

1. 基本安装

先创建一个目录，初始化 npm，然后 在本地安装 webpack，接着安装 webpack-cli :

```shell
# 创建项目目录并进入项目目录
$ mkdir webpack-demo && cd webpack-demo
# 初始化项目
$ npm init -y
# 安装webpack和webpack-cli插件
$ npm install webpack webpack-cli --save-dev
```

2. 创建 bundle 文件

创建以下目录结构、文件、内容 :（**+ 代表手动创建**）

**project**

```txt
webpack-demo
  |- package.json
+ |- /dist
+   |- index.html
+ |- /src
+   |- index.js
```

安装第三方的 lodash 依赖，安装到生产阶段

```shell
$ npm install --save lodash
```

>Tip: 在安装一个 package，而此 package 要打包到生产环境 bundle 中时，你应该使用 npm install --save。如果你在安装一个用于开发环境的 package 时（例如，linter, 测试库等），使用 npm install --save-dev

**src/index.js**

```js
import _ from 'lodash';
function component() {
    var element = document.createElement('div');
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    return element;
}
document.body.appendChild(component());
```

**dist/index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello webpack</title>
</head>
<body>
    <!-- 引入构建好的main.js文件 -->
    <script src="./main.js"></script>
</body>
</html>
```

3. 打包

```shell
$ npx webpack
```

在项目根目录下执行 ```npx webpack``` 命令，会将我们的脚本 ```src/index.js``` 作为 **入口起点** ，也会生成 ```dist/main.js``` 作为 **输出** 。
>Node 8.2+ 版本提供的 npx 命令，可以运行在初始安装的 webpack 包 (package) 的 webpack 二进制文件。

在浏览器中打开 index.html ，如果一切访问都正常，可以看到以下文本：```Hello webpack```。

每次更改文件内容时，都需要重新执行 npx webpack 命令重新打包。

注意：如果不使用 webpack 打包，则格式如下 :

**src/index.js**

```js
function component() {
    var element = document.createElement('div');
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    return element;
}
document.body.appendChild(component());
```

**dist/index.html**

```html
<!doctype html>
<html>
  <head>
    <title>webpack起步</title>
    <script src="https://unpkg.com/lodash@4.16.6"></script>
  </head>
  <body>
    <script src="./src/index.js"></script>
  </body>
</html>
```

**这样会有很大的问题 : script 标签之间存在隐式依赖关系，即 index.js 文件并未显式声明需要引入 lodash，并且需要在 index.js 文件执行之前引入 lodash。**  
**因此使用 webpack 来管理这些脚本。**

4. NPM 脚本

考虑到用 CLI 这种方式来运行本地的 webpack 不是特别方便，我们可以设置一个快捷方式。在 *package.json* 添加一个 npm 脚本 :

**package.json**

```json
  {
    "name": "webpack-demo",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
+     "build": "webpack"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "devDependencies": {
      "webpack": "^4.0.1",
      "webpack-cli": "^2.0.9",
      "lodash": "^4.17.5"
    }
  }
```

现在就可以使用 ```npn run build``` 命令来替换之前的 ```npx``` 命令。

## 配置文件

在 webpack 4 中，可以无须任何配置使用，然而大多数项目会需要很复杂的设置，这就是为什么 webpack 仍然要支持 **配置文件**。下面在原有的文件基础之上再做配置 :

**project**

```js
webpack-demo
	|- package.json
+  |- webpack.config.js
  |- /dist
    |- index.html
  |- /src
    |- index.js
```

**webpack.config.js**

```js
const path = require('path');
module.exports = {
  // 入口
  entry: './src/index.js',
  // 出口
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```

现在通过新的配置文件再次执行构建 :

```shell
$ npx webpack --config webpack.config.js
```

构建完成后，会在 dist 文件夹下生成 bundle.js 文件 :

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>webpack配置文件使用</title>
</head>
<body>
    // 引入bundle.js文件
    <script src="./bundle.js"></script>
</body>
</html>
```

## 资源管理

在 webpack 出现之前，前端开发人员会使用 grunt 和 gulp 等工具来处理资源，并将它们从 /src 文件夹移动到 /dist 或 /build 目录中。同样方式也被用于 JavaScript 模块，但是，像 webpack 这样的工具，将 **动态打包 (dynamically bundle)** 所有依赖项（创建所谓的依赖图）。这是极好的创举，因为现在每个模块都可以 *明确表述它自身的依赖* ，我们将避免打包未使用的模块。

## CSS 加载器

为了从 JavaScript 模块中 import 一个 CSS 文件，需要在 module 配置中 安装并添加 style-loader 和 css-loader :

```shell
$ npm install --save-dev style-loader css-loader
```

**webpack.config.js**

```js
  const path = require('path');
  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
+   module: {
+     rules: [
+       {
+         test: /\.css$/,
+         use: [// loader 从下至上的顺序执行
+           'style-loader',
+           'css-loader'
+         ]
+       }
+     ]
+   }
  };
```

>在这种情况下，以 .css 结尾的全部文件，都将被提供给 style-loader 和 css-loader。

通过在项目中添加一个新的 style.css 文件，并将其导入到 index.js 中：

**project**

```js
webpack-demo
  |- package.json
  |- webpack.config.js
  |- /dist
    |- bundle.js
    |- index.html
  |- /src
+   |- style.css
    |- index.js
  |- /node_modules
```

**src/style.css**

```css
.hello {
  color: blue;
}
```

**src/index.js**

```js
  import _ from 'lodash';
+ import './style.css';
  function component() {
    var element = document.createElement('div');
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
+   element.classList.add('hello');
    return element;
  }
  document.body.appendChild(component());
```

现在运行构建命令：

```shell
$ npm run build
```

再次在浏览器中打开 index.html，你应该看到 Hello Webpack 现在的样式是蓝色。

## 图片加载器

使用 file-loader 可以将图片和图标混合到 CSS 中 :

```shell
$ npm install --save-dev file-loader
```

**webpack.config.js**

```js
  const path = require('path');
  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader'
          ]
        },
+       {
+         test: /\.(png|svg|jpg|gif)$/,
+         use: [
+           'file-loader'
+         ]
+       }
      ]
    }
  };
```

**project**

```js
  webpack-demo
  |- package.json
  |- webpack.config.js
  |- /dist
    |- bundle.js
    |- index.html
  |- /src
+   |- icon.png
    |- style.css
    |- index.js
  |- /node_modules
```

**src/index.js**

```js
  import _ from 'lodash';
  import './style.css';
+ import Icon from './icon.png';
  function component() {
    var element = document.createElement('div');
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
    element.classList.add('hello');
+   var myIcon = new Image();
+   myIcon.src = Icon;
+   element.appendChild(myIcon);
    return element;
  }
  document.body.appendChild(component());
```

重新构建，再次打开 index.html 文件，可以看见图片。

## 管理输出

到目前为止，我们在 index.html 文件中手动引入所有资源，然而随着应用程序增长，并且一旦输出多个 bundle，手动地对 index.html 文件进行管理，一切就会变得困难起来。然而，可以通过一些插件，会使这个过程更容易操控。

首先，调整一下的项目：

**project**

```js
  webpack-demo
  |- package.json
  |- webpack.config.js
  |- /dist
  |- /src
    |- index.js
+   |- print.js
  |- /node_modules
```

在 src/print.js 文件中添加一些逻辑：

**src/print.js**

```js
export default function printMe() {
  console.log('I get called from print.js!');
}
```

并且在 src/index.js 文件中使用这个函数：

**src/index.js**

```js
  import _ from 'lodash';
+ import printMe from './print.js';
  function component() {
    var element = document.createElement('div');
+   var btn = document.createElement('button');
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
+   btn.innerHTML = 'Click me and check the console!';
+   btn.onclick = printMe;
+   element.appendChild(btn);
    return element;
  }
  document.body.appendChild(component());
```

更新 dist/index.html 文件，来为 webpack 分离入口做好准备：

**dist/index.html**

```html
  <!doctype html>
  <html>
    <head>
+     <title>管理输出</title>
+     <script src="./print.bundle.js"></script>
    </head>
    <body>
-     <script src="./bundle.js"></script>
+     <script src="./app.bundle.js"></script>
    </body>
  </html>
```

将在 entry 添加 src/print.js 作为新的入口起点（print），然后修改 output，以便根据入口起点名称动态生成 bundle 名称：

**webpack.config.js**

```js
  const path = require('path');
  module.exports = {
-   entry: './src/index.js',
+   entry: {
+     app: './src/index.js',
+     print: './src/print.js'
+   },
    output: {
-     filename: 'bundle.js',
+     filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
```

执行 ` npm run build`，点击页面中的按钮。

## 插件

根据上面的管理输出，可以看到现在生成了两个 bundle 文件，需要手动的将这两个 bundle 文件引入到 html 中使用。这个手动操作有点繁琐，可以使用一些插件帮咱们完成这个功能。在重新打包生成之后 bundle 文件之后，自动修改在 html 中的使用。```HtmlWebpackPlugin``` 插件就是提供这个功能的。

### 设置 HtmlWebpackPlugin

首先安装插件，并且调整 webpack.config.js 文件：

```shell
$ npm install --save-dev html-webpack-plugin
```

**webpack.config.js**

```js
 const path = require('path');
+const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.js',
    print: './src/print.js',
  },
+ plugins: [
+   new HtmlWebpackPlugin({
+     title: '管理输出',
+   }),
+ ],
  //或者如下
  /* plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ], */
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
```

在我们构建之前，你应该了解，虽然在 dist/ 文件夹我们已经有了 index.html 这个文件，然而 HtmlWebpackPlugin 还是会默认生成它自己的 index.html 文件。也就是说，它会用新生成的 index.html 文件，替换我们的原有文件。如果在代码编辑器中打开 index.html，你会看到 **HtmlWebpackPlugin** 创建了一个全新的文件，所有的 bundle 会自动添加到 html 中。

### 清理 /dist 文件夹

你可能已经注意到，由于遗留了之前的指南和代码示例，我们的 /dist 文件夹显得相当杂乱。webpack 将生成文件并放置在 /dist 文件夹中，但是它不会追踪哪些文件是实际在项目中用到的。  
通常比较推荐的做法是，在每次构建前清理 /dist 文件夹，这样只会生成用到的文件。让我们实现这个需求。

clean-webpack-plugin 是一个流行的清理插件，安装和配置它。
+ 安装

```shell
$ npm install --save-dev clean-webpack-plugin
```

+ 配置  
  **webpack.config.js**

  ```js
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  +const { CleanWebpackPlugin } = require('clean-webpack-plugin');

  module.exports = {
    entry: {
      index: './src/index.js',
      print: './src/print.js',
    },
    plugins: [
  +   new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: 'Output Management',
      }),
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
  };
  ```

  现在，执行 ```npm run build``` 命令，检查 /dist 文件夹。如果一切顺利，现在只会看到构建后生成的文件，而没有旧文件！

## 动态编程

**安装**

```shell
$ npm install --save-dev webpack-dev-serve
```

## 模块热替换 (HMR)

模块热替换 (hot module replacement 或 HMR) 是 webpack 提供的最有用的功能之一。它允许在运行时更新所有类型的模块，而无需完全刷新。本页面重点介绍其实现，而 概念 页面提供了更多关于它的工作原理以及为什么它有用的细节。
>Tip: HMR 不适用于生产环境，这意味着它应当用于开发环境。

+ 启用 HMR

更新 webpack-dev-server 配置， 然后使用 webpack 内置的 HMR 插件。我们还要删除掉 print.js 的入口起点， 因为现在已经在 index.js 模块中引用了它。

**webpack.config.js**

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    app: './src/index.js',
-   print: './src/print.js',
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
+   hot: true,
  },
  /*devServer: {
    // 运行的构建后的目录，如果用resolve方法，需要在上方引入const { resolve } = require('path');
    contentBase: resolve(__dirname, 'build'),
    // 启动gzip压缩
    compress: true,
    // 端口号，默认是8080
    port: 3000,
    // 是否自动打开浏览器
    open: true
  },*/
  plugins: [
    // new CleanWebpackPlugin(['dist/*']) for < v2 versions of CleanWebpackPlugin
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Hot Module Replacement',
    }),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
```

现在，我们来修改 index.js 文件，以便当 print.js 内部发生变更时可以告诉 webpack 接受更新的模块。

**index.js**

```js
import _ from 'lodash';
import printMe from './print.js';
function component() {
	const element = document.createElement('div');
	const btn = document.createElement('button');
	element.innerHTML = _.join(['Hello', 'webpack'], ' ');
	btn.innerHTML = 'Click me and check the console!';
	btn.onclick = printMe;
	element.appendChild(btn);
	return element;
}

document.body.appendChild(component());
+ if (module.hot) {
+   module.hot.accept('./print.js', function() {
+     console.log('Accepting the updated printMe module!');
+     printMe();
+   })
+ }
```

更改 print.js 中 console.log 的输出内容，你将会在浏览器中看到如下的输出 （不要担心现在 button.onclick = printMe() 的输出，我们稍后也会更新该部分）。

**print.js**

```js
export default function printMe() {
	console.log('I get called from print.js!');// -
	console.log('Updating print.js...'); // +
}
```

## CSS 处理

### style-resources-loader（在 style 资源中注入内容）

**options:**   
- patterns：字符串或数组，表示导入资源的路径，绝对路径
- injector：‘prepend’ 或者 ‘append’， 表示资源导入的位置，在之前还是之后，样式后导入的会覆盖前面导入的
- resolveUrl： 是否允许@import 形式导入，默认 true

```js
module.exports = {
    // ...
    module: {
        rules: [{
            test: /\.scss$/,
            use: ['style-loader', 'css-loader', 'sass-loader', {
                loader: 'style-resources-loader',
                options: {
                    patterns: [
                        path.resolve(__dirname, 'path/to/scss/variables/*.scss'),
                        path.resolve(__dirname, 'path/to/scss/mixins/*.scss'),
                    ]
                }
            }]
        }]
    },
    // ...
}

```

## loader

用于处理和编译 js 和 json 以外的文件。  

### postcss

具有丰富插件的用 JavaScript 工具和插件转换 css 代码的工具。  

#### autoprefixer 添加兼容性前缀

### babel

默认转换 es6+ 语法，如 let、const、class、()=>{}，不转换 es6+ 新特性，如 Iterator、Generator、Set、Map、Proxy、Reflect、Symbol、Promise。  
- **@babel/core**：核心库  
- **@babel/preset-env**：  
- **regenerator-runtime**：  
- **core-js**：js 标准库的 polyfill，可按需加载。  
- **regenerator-runtime**：generator 函数转码  

## plugin

在 webpack 构建过程中的特定时机注入扩展逻辑。  

## 补充知识

### **browserslist**

一段浏览器的集合，工具根据 browserlist 输出兼容性代码。  
被@babel/preset-env 和 Autoprefixer 用来确定需要转译的 JavaScript 特性和需要添加的 CSS 浏览器前缀。  
*.browserslistrc 单文件*

```json
[production]    
> 1%    
ie 10    
  
[development]    
last 1 chrome version    
last 1 firefox version
```

*package.json*

```json
{    
	"browserslist": {    
		"production": [    
			">0.2%",    
			"not dead",    
			"not op_mini all"    
		],    
		"development": [    
			"last 1 chrome version",    
			"last 1 firefox version",    
			"last 1 safari version"    
		]    
	}    
}
```

**含义**:  
"> 1%": 兼容市面上使用量大于 1% 的浏览器。  
"last 1 chrome version": 兼容浏览器的上一个版本。  
>使用 `npx browserslist "> 1%"` 查看包含哪些浏览器

### chunks

chunks 是一个或多个 chunk 的集合，chunk 指代码块（一个文件）。  
在 webpack 构建中入口是 chunks，出口是 chunk。  

## 搭建 Webpack 项目

1.初始化 package.json

```sh
# 默认配置创建
npm init -y
```

2.安装 webpack

```sh
yarn add webpack@4.44.2 webpack-cli@3.3.12 -D
```

3.根目录创建 src，src 下创建 index.js  
4.运行 webpack 命令

```sh
# webpack.config.js
webpack

#hxhconfig.js
webpack --config hxhconfig.js
```

## 核心概念

- chunk：指代码块，一个 chunk 可能由多个模块组合而成，也用于代码合并与分割（这里的合并分割主要指指纹策略的判断），指纹策略简单来说就是文件名后的 hash
- bundle：资源经过 webpack 流程解析编译后最终输出的成果文件（一个.js 格式的文件，也就是我们的 output 文件）
- entry：文件打包的入口，webpack 会根据 entry 递归的去寻找依赖，每个依赖都将被它处理，最后打包到集合文件中
- output：配置打包输出的位置、文件名等
- loader：默认情况下，webpack 仅支持 js 和 json 文件，通过 loader，可以让它解析其他类型的文件。理论上只要有相应的 loader，webpack 可以处理任何类型的文件
- plugin：loader 主要的职责是让 webpack 认识更多的文件类型，而 plugin 的职责则是让其可以控制构建流程，从而执行一些特殊的任务。插件的功能非常强大，可以完成各种各样的任务
- mode：目标环境，不用的目标环境会影响 webpack 打包时的决策
	- production：代码进行压缩等一系列优化操作
	- development：有利于热更新的处理，识别哪个模块变化代
	- none：什么都不做，打包时会有提示警告

## 参考

[彻底解决新手对webpack的恐惧！ - 掘金](https://juejin.cn/post/6953042611963691021#heading-31)  
[二十张图片彻底讲明白Webpack设计理念，以看懂为目的Webpack 一直都是有些人的心魔，不清楚原理是什么，不知道怎 - 掘金](https://juejin.cn/post/7170852747749621791)
