---
title: Vue-cli
date: 2022-09-26 09:27:58
updated: 2023-03-22 18:24:00
---

# Vue-cli

一个基于 Vue.js 进行快速开发的完整系统。  
**功能：**
- 通过 @vue/cli 实现的交互式的项目脚手架。
- 通过 @vue/cli + @vue/cli-service-global 实现的零配置原型开发。
- 一个丰富的官方插件集合，集成了前端生态中最好的工具。
- 一套完全图形化的创建和管理 Vue.js 项目的用户界面

## 安装

```shell
$ npm install -g @vue/cli
## OR
$ yarn global add @vue/cli

## 检查版本
$ vue --version

## 升级
$ npm update -g @vue/cli
## 或者
$ yarn global upgrade --latest @vue/cli
```

## 使用

```shell
##创建项目
$ vue create demo

## 启动项目
$ cd demo
$ npm run serve
```

查看项目：浏览器打开页面访问 localhost:8080。

## 项目结构

- node_modules 项目的所有依赖，使用 cnpm insatll 安装的依赖包
- public 静态资源目录
- src
- assets 用来存放静态文件
- components 存放自定义组件
- router  路由
- store 状态机
- views vue 页面
- App.vue 首页，也是一个组件
- main.js 程序入口文件（根组件的注册）
- babel.config.js babel 配置文件
- package.json 定义了项目的所有依赖