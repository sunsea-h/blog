---
title: Mac
categories:
  - System
date: 2025-06-19 16:04:58
updated: 2026-03-29 19:21:15
---
# Mac

## 终端命令

查看全部电池信息

```sh
system_profiler SPPowerDataType
```

实时查看最耗资源的进程

```sh
top -o cpu
```

取消 Dock 自动隐藏的动画

```sh
defaults write com.apple.dock autohide-delay -float 0; killall Dock
```

恢复默认动画

```sh
defaults delete com.apple.dock autohide-delay; killall Dock
```

统计文件夹大小

```sh
du -sh *
```

取消打开软件时的第三方下载提示

```sh
defaults write com.apple.LaunchServices LSQuarantine -bool false
```
