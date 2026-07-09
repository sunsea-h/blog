---
title: Windows
categories:
  - System
date: 2024-07-31 15:58:54
updated: 2026-06-12 09:52:20
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

## 配置 WSL

```powershell
bcdedit /set hypervisorlaunchtype auto

dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart 
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

## 好用软件

[GitHub - BluePointLilac/ContextMenuManager: 🖱️ 纯粹的Windows右键菜单管理程序 · GitHub](https://github.com/BluePointLilac/ContextMenuManager)  
[GitHub - ChrisTitusTech/winutil: Chris Titus Tech's Windows Utility - Install Programs, Tweaks, Fixes, and Updates · GitHub](https://github.com/ChrisTitusTech/winutil)  
[GitHub - zbezj/HEU\_KMS\_Activator · GitHub](https://github.com/zbezj/HEU_KMS_Activator)  
[GitHub - moudey/Shell: Powerful context menu manager for Windows File Explorer · GitHub](https://github.com/moudey/Shell)  
[GitHub - ysc3839/AudioPlaybackConnector: Bluetooth audio playback (A2DP Sink) connector for Windows 10 2004+ · GitHub](https://github.com/ysc3839/AudioPlaybackConnector)
