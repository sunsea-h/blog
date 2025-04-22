---
title: Webpack实践
date: 2025-04-14 14:27:03
updated: 2025-04-16 17:13:31
---
# Webpack 实践

## 生成 HTML

```js
// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ]
}
```

## 接入 Babel - 处理高级语言特性兼容

```json
// .babelrc
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage", // 按需加载polyfill
        "corejs": "3.32",      // 指定core-js版本
        "targets": "> 0.25%, not dead" // 自动读取.browserslistrc
      }
    ]
  ]
}
```

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
}
```

## 性能优化

- 构建速度性能优化
- 打包结果页面性能优化
	- 提出无用代码，减少构建体积
	- 提取公共依赖，多脚本复用
	- 首屏静态资源分离，异步加载
	- 文件添加哈希，浏览器缓存复用

### Tree Shaking

ES6 模块静态分析，标记未使用代码，进行删除。  
`mode:production` 自动开启。  
通过 sideEffects 标记有副作用代码，不进行删除。

```json
{
  "name": "your-project",
  "version": "1.0.0",
  "sideEffects": [
    "./src/some-side-effectful-file.js"
  ]
}
```

使用 `@babel/preset-env` 时，需要配置关闭 ES 转换 CommonJS。

```json
{
  "presets": [
    ["@babel/preset-env", {
      "modules": false
    }]
  ]
}
```

### 移除未使用的 CSS（类 Tree Shaking）

使用 Postcss 插件 `@fullhuman/postcss-purgecss`。

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  require('autoprefixer'),
                  require('@fullhuman/postcss-purgecss').default({
                    content: ['./src/**/*.html', './src/**/*.js'],
                    defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
                  }),
                ]
              }
            }
          },
          "less-loader"
        ]
      },
    ]
  }
}

```

### Code Splitting

#### Entry Points 分割

```js
const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    main: './src/index.js',
    vendor: './src/vendor.js'
  },
  output: {
    filename: '[name].bundle.js', // 生成 main.bundle.js 和 vendor.bundle.js
    path: path.resolve(__dirname, 'dist')
  }
};

```

#### splitChunks

对代码进行分割，生成 chunk。

```js
module.exports = {
  mode: 'production',
  optimization: {
    splitChunks: {
      chunks: 'all', // 选择哪些 chunk 进行分割，默认值是 'async'
      minSize: 20000, // 生成 chunk 的最小体积，单位是字节
      maxSize: 0, // 生成 chunk 的最大体积，单位是字节，不限制大小
      minChunks: 1, // 模块被引用的最少次数才会被分割
      maxAsyncRequests: 30, // 按需加载时最大的并行请求数
      maxInitialRequests: 30, // 入口点的最大并行请求数
      automaticNameDelimiter: '~', // 文件名的连接符
      cacheGroups: {
        defaultVendors: {
          test: /[\/]node_modules[\/]/, // 匹配哪些模块被分组到这个 cache group
          priority: -10, // 缓存组的优先级
          reuseExistingChunk: true, // 如果当前 chunk 包含已从主 bundle 分离出的模块，则重用它
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
};

```

#### Dynamic Imports

使用 `import()` 动态导入，使 Webpack 自动处理按需加载的 chunk，如：非首屏内容，路由懒加载等。  
利用 **[Magic Comments](http://webpack.docschina.org/api/module-methods/#magic-comments)** 提高动态加载性能。

```js
// 在浏览器空闲时加载
import(
	/* webpackPrefetch: true */ 
	'./moduleA'
);

// 在父 chunk 加载时加载
import(
	/* webpackPreload: true */ 
	'./moduleB'
);
```

#### 首屏 CSS 提取

### 图片优化

简单优化，小图片转化为 base64 等。
> 通常应使用专业工具进行处理，或使用 CDN，页面自负责使用。

### CDN 处理

1.第三方库，排除构建，使用 CDN 引入。

```js
module.exports = {
  externals: {
    jquery: 'jQuery', // 全局变量 jQuery，来自于 CDN
    lodash: '_',     // 全局变量 Lodash，来自于 CDN
  },
};

```

2.通过 public path 指定静态资源 CDN 地址  
也可以在运行时通过 `__webpack_public_path__` 属性设置。

```js
module.exports = {
	output: {
		publicPath: 'auto', // It automatically determines the public path from either `import.meta.url`, `document.currentScript`, `<script />` or `self.location`.
		publicPath: '' // 相对于页面
	}
}
```
