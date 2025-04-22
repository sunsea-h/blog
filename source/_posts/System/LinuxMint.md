---
title: LinuxMint
date: 2024-08-19 23:15:20
updated: 2024-10-09 10:55:55
---

# LinuxMint

版本: Linuxmint 22 ciannamon

## 包管理器

### 切换国内源

点击 Main 和 Base 选择测速最快的  
![](LinuxMint.assets/image-20240821231010252.png)

### 更新源

```shell
sudo apt update 
sudo apt upgrade
```

## 安装虚拟机增强工具

```shell
# 进入管理员模式
sudo su
apt-get update
apt-get install open-vm-tools open-vm-tools-desktop
# 开启服务
vmware-user
```

## 中文输入法

首选项 -> 输入法 -> 简体中文

## 全局 shell 配置文件

```shell
# 创建自定义sh脚本
touch /etc/profile.d/hxh.sh

# root 自动加载

# 普通用户 .bashrc中添加
source /etc/profile.d/hxh.sh
```

*hxh.sh*

```shell
export cvim="neovide --size=1920x1080"
```

### Bash 主题

https://github.com/NOname-awa/gxy-theme/blob/main/themes/bash-theme

## 字体

将 `.ttf` 文件放到用户目录的 `/usr/share/fonts` 文件夹中

## 系统代理

[Debian / Ubuntu - v2rayA](https://v2raya.org/docs/prologue/installation/debian/)

## 常用工具

### **软件商店**

- Kate

### **命令行**

```shell
# 可能不是最新版
sudo apt install git fzf openssh-server
```

#### Nvim  

```shell
# 最新版 neovim 
# 下载 tar.gz 压缩包 https://github.com/neovim/neovim/blob/master/INSTALL.md
# 在 /opt 中解压
sudo tar -zxvf nvim.tar.gz
# 设置全局变量, nvim 需要有执行权限
sudo ln -s /opt/nvim/bin/nvim /usr/local/bin/nvim

# 创建配置文件夹
mkdir -p ~/.config/nvim
```

#### Neovide

`maximized` 失效, 使用 `--size=1920x1080` 参数最大化  
根据官网步骤:  
https://neovide.dev/installation.html#linux-source

## Docker

```shell
# 安装必要的证书并允许 apt 包管理器使用以下命令通过 HTTPS 使用存储库
sudo apt install apt-transport-https ca-certificates curl software-properties-common gnupg lsb-release

# 添加docker官方GPG秘钥
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# 添加docker官方库
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin
systemctl status docker
```

*docker-compose*

```shell
sudo curl -L "https://github.com/docker/compose/releases/download/v2.6.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose

docker-compose version
```

### 配置代理

*/etc/systemd/system/docker.service.d*

```shell
[Service]
Environment="HTTP_PROXY=http://<user>:<password>@<domain>:<port>"
Environment="HTTPS_PROXY=http://<user>:<password>@<domain>:<port>"
```