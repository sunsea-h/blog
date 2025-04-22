---
title: VSCode
date: 2024-07-22 17:46:07
updated: 2025-04-03 17:30:23
---
# VSCode

## Debug 配置

```json5
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug via NPM",
      "skipFiles": [
        "<node_internals>/**"
      ],
      "outFiles": [
        "${workspaceFolder}/**/*.js"
      ],
      "runtimeExecutable": "npm",
      "runtimeArgs": [
        "run-script",
        // package scripts中的node命令
        "debug"
      ],
    },
    {
      "type": "chrome",
      "request": "launch",
      "name": "NTC Launch Chrome",
      "url": "http://localhost:9000/notice/fr/jp/webview/home-page.html",
      "webRoot": "${workspaceFolder}",
      "runtimeArgs": ["--disable-web-security", "--user-data-dir=C:/Users/xiaohai.han/11111111/cors_data_debug"]
    },
    // 需要安装 Debug for firefox 插件
    {
      "type": "firefox",
      "request": "launch",
      "name": "NTC Launch Firefox",
      "url": "http://localhost:9000/notice/fr/jp/webview/home-page.html",
      "webRoot": "${workspaceFolder}/src",
      "pathMappings": [{ "url": "webpack:///src/", "path": "${webRoot}/" }],
      // 在浏览器中输入 about:profiles 获取配置文件名称
      "profile": "dev-edition-default"
    }
  ]
}
```

## [VSCode 插件](VSCode%20插件.md)
