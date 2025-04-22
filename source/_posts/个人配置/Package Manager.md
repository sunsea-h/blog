---
title: Package Manager
date: 2022-09-26 09:27:58
updated: 2024-08-12 11:58:16
---

# Package Manager

### npm

1. 设置为淘宝镜像

```shell
npm config set registry https://registry.npm.taobao.org
```

2. 设置回原本的源，用来发布 npm 包

```shell
npm config set registry https://registry.npmjs.org
```

3. 查看 npm 当前设置的源 

```shell
npm config get registry 或者 npm config list
```

4. 查询包的版本并下载

```shell
## 所有版本
npm view element-ui versions
## 最新版本
npm view element-ui version
## 下载指定大版本
npm install react@16.x
```

5. 配置  

```shell
npm config set prefix "C:\Users\xiaohai.han\software\nvm\v14.21.0\node_global"

npm config set cache "C:\Users\xiaohai.han\software\nvm\v14.21.0\node_cache"
```

## pnpm

下载依赖

```shell
# 从其他包锁文件生成`pnpm-lock.yaml`
pnpm import
# 根据锁文件下载依赖
pnpm install --frozen-lockfile
```

管理 Node.js 版本

```shell

# 安装 LTS 版本的 Node.js 
pnpm env use --global lts
pnpm env use --global argon


# 全局安装v16
pnpm env use --global 16


# 安装最新版本的node js
pnpm env use --global latest


# 移除指定版本的nodejs
pnpm env remove --global 14.0.0
```