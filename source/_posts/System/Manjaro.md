---
title: Manjaro
categories:
  - System
date: 2024-08-05 21:57:52
updated: 2024-08-25 14:29:51
---

# Manjaro

版本: Plasma KDE 24.0.5  
Linux: 69

## 共享文件夹

```shell

# 优化固态硬盘的SSD块, 延长寿命
sudo systemctl enable fstrim.timer

# 创建共享文件夹位置
mkdir /mnt/hgfs
# 挂载共享文件夹
sudo mount -t fuse.vmhgfs-fuse .host:/ /mnt/hgfs -o allow_other
```

## 中文输入法

ManjaroHello ==> Application ==> Extended Language Support

## 包管理器

```bash
# 选择中国地区, 选择最快的镜像服务器
sudo pacman-mirrors -i -c China -m rank

# 更新选件源
sudo pacman -Syy
```

### pacman 常用命令

```shell

# 更新已安装的软件
pacman -Syu

# 查看不需要的包
pacman -Qtd

# 安装软件
pacman -S 软件名

# 搜索软件
pacman -Ss 软件名

# 搜索安装的所有软件包，grep只显示指定软件名
pacman -Q | grep 软件名

# 卸载软件包并删除配置文件
pacman -Rsunc 软件名
```

## Homebrew

```bash
# 需要的工具
sudo pacman -S curl git gcc

# 安装 大概率失败
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
# 国内下载方式
/bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"


# 设置环境变量
echo 'export PATH="/home/linuxbrew/.linuxbrew/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

echo 'export PATH="/home/linuxbrew/.linuxbrew/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

[技术|在 Linux 上安装和使用 Homebrew 包管理器](https://linux.cn/article-14065-1.html)

## 访问 github 下载内容

[raw.githubusercontent.com服务器iP raw.githubusercontent.com域名解析 raw.githubusercontent.comiP查询 raw.githubusercontent.com域名iP查询](https://site.ip138.com/raw.githubusercontent.com/)  
通过解析获取 ip, 修改 `/etc/hosts`

## 安装代理 (失败)

> 普通用户配置无效, 直接使用主机代理

### clash

```bash
# 需要用到fakerbook
sudo pacman -S fakeroot

yay -S clash-verge-rev-bin
```

### v2ray

```zsh
brew install v2raya
```

## 字体

将 `.ttf` 文件放到 `/home/hxh/.fonts` 或 `/usr/share/fonts`

```bash
# 中文字体
yay -S wqy-zenhei

# 刷新字体缓存
fc-cache -f -v
```

## 全局 shell 配置文件

```shell
# root用户 .bashrc
# 普通用户 .zshrc
source /etc/profile.d/hxh.sh
```

*hxh.sh*

```shell
#!/bin/bash

alias ll="ls -al"

export PATH="/home/linuxbrew/.linuxbrew/bin:$PATH"
```

## 常用工具

### 软件商店

### 命令行

```shell
sudo pacman -S neovim
sudo pacman -S neovide


```

### oh my zsh

1. 安装 oh my zsh  
   `sh -c "$(wget https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh -O -)"`
2. 获取主题文件, 导入 `.oh-my-zsh/theme/`  
   [GitHub - NOname-awa/gxy-theme](https://github.com/NOname-awa/gxy-theme)
3. 修改 `.zshrc` 文件中的 `ZSH_THEME`

## Virtualbox 安装强化

```bash
# Please install the gcc make perl packages from your distribution.
sudo pacman -S gcc make perl


# Please install the Linux kernel "header" files matching the current kernel

# 查找可用内核
pacman -Ss linux-headers
# XY为对应内核版本
pacman -S linuxXY linuxXY-headers
```

## 参考

[Manjaro安装、配置、调试超详细攻略\_皛心的博客-CSDN博客](https://blog.csdn.net/m0_47670683/article/details/113793200)