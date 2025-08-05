---
title: Windows
categories:
  - System
date: 2024-07-31 15:58:54
updated: 2025-07-21 14:05:41
---
# Windows

## 命令行设置环境变量

```PowerShell
# PowerShell
$env:NODE_ENV="production"

$env:NODE_ENV

# cmd
set NODE_ENV=production

echo %NODE_ENV%
```

## 默认打开方式管理

注册表：\HKEY_CLASSES_ROOT\Applications

## 进程管理

**查看所有活动端口及进程 ID**

```PowerShell
netstat -ano
```

**查看指定端口详情**

```PowerShell
netstat -ano | findstr :8080
```

**杀死进程**

```PowerShell
taskkill /F /PID 1234
```
