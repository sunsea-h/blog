---
title: vue-element-admin
date: 2022-09-26 09:27:58
updated: 2023-03-22 18:24:10
---

# vue-element-admin

## 介绍

> vue-element-admin 是一个后台前端解决方案，它基于 vue 和 element-ui 实现。它使用了最新的前端技术栈，内置了 i18 国际化解决方案，动态路由，权限验证，提炼了典型的业务模型，提供了丰富的功能组件，它可以帮助你快速搭建企业级中后台产品原型。

### 安装

```shell
## 克隆项目
$ git clone https://github.com/PanJiaChen/vue-element-admin.git
## 进入项目目录
$ cd vue-element-admin
## 安装依赖
$ npm install
## 建议不要用 cnpm 安装 会有各种诡异的bug 可以通过如下操作解决 npm 下载速度慢的问题
$ npm install --registry=https://registry.npm.taobao.org
## 本地开发 启动项目
$ npm run dev
```

运行效果 : 启动完成后会自动打开浏览器访问 [http://localhost:9527](http://localhost:9527)

![项目首页](vue-element-admin.assets/vue-element-admin_image_1.png)

### 目录结构

```html
├── build                      ## 构建相关
├── mock                       ## 项目mock 模拟数据
├── plop-templates             ## 基本模板
├── public                     ## 静态资源
│   │── favicon.ico            ## favicon图标
│   └── index.html             ## html模板
├── src                        ## 源代码
│   ├── api                    ## 所有请求
│   ├── assets                 ## 主题 字体等静态资源
│   ├── components             ## 全局公用组件
│   ├── directive              ## 全局指令
│   ├── filters                ## 全局 filter
│   ├── icons                  ## 项目所有 svg icons
│   ├── lang                   ## 国际化 language
│   ├── layout                 ## 全局 layout
│   ├── router                 ## 路由
│   ├── store                  ## 全局 store管理
│   ├── styles                 ## 全局样式
│   ├── utils                  ## 全局公用方法
│   ├── vendor                 ## 公用vendor
│   ├── views                  ## views 所有页面
│   ├── App.vue                ## 入口页面
│   ├── main.js                ## 入口文件 加载组件 初始化等
│   └── permission.js          ## 权限管理
├── tests                      ## 测试
├── .env.xxx                   ## 环境变量配置
├── .eslintrc.js               ## eslint 配置项
├── .babelrc                   ## babel-loader 配置
├── .travis.yml                ## 自动化CI配置
├── vue.config.js              ## vue-cli 配置
├── postcss.config.js          ## postcss 配置
└── package.json               ## package.json
```

教程 :

建议先看完这些文章再来实践本项目。

* [手摸手，带你用 vue 撸后台 系列一(基础篇)](https://juejin.im/post/59097cd7a22b9d0065fb61d2)
* [手摸手，带你用 vue 撸后台 系列二(登录权限篇)](https://juejin.im/post/591aa14f570c35006961acac)
* [手摸手，带你用 vue 撸后台 系列三 (实战篇)](https://juejin.im/post/593121aa0ce4630057f70d35)
* [手摸手，带你用 vue 撸后台 系列四(vueAdmin 一个极简的后台基础模板)](https://juejin.im/post/595b4d776fb9a06bbe7dba56)
* [手摸手，带你用 vue 撸后台 系列五(v4.0 新版本)](https://juejin.im/post/5c92ff94f265da6128275a85)
* [手摸手，带你封装一个 vue component](https://segmentfault.com/a/1190000009090836)
* [手摸手，带你优雅的使用 icon](https://juejin.im/post/59bb864b5188257e7a427c09)
* [手摸手，带你用合理的姿势使用 webpack4（上）](https://juejin.im/post/5b56909a518825195f499806)
* [手摸手，带你用合理的姿势使用 webpack4（下）](https://juejin.im/post/5b5d6d6f6fb9a04fea58aabc)
