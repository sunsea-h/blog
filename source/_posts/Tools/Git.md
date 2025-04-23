---
title: Git
categories:
  - Tools
date: 2022-09-26 09:27:58
updated: 2025-04-22 18:16:57
---
# Git

## 常用配置

```sh
# --local：仓库级，--global：全局级，--system：系统级
git config --global -l

# 查看当前生效的配置信息
git config -l

# 编辑配置文件
# --local：仓库级，--global：全局级，--system：系统级
git config --global -e

# 添加配置项
# --local：仓库级，--global：全局级，--system：系统级
git config --global --add <name> <value>

# 获取配置项
git config --global --get <name>

# 删除配置项
git config --global --unset <name>

# 配置提交记录中的用户信息
git config --global user.name <用户名>
git config --global user.email <邮箱地址>

# 更改Git缓存区的大小
# 如果提交的内容较大，默认缓存较小，提交会失败
# 缓存大小单位：B，例如：524288000（500MB）
git config --global http.postBuffer <缓存大小>

# 调用 git status/git diff 命令时以高亮或彩色方式显示改动状态
git config --global color.ui true
```

## 凭证配置

```shell
# 默认缓存（默认15分钟）
git config --global credential.helper cache

# 指定缓存时长，单位：秒
git config --global credential.helper 'cache --timeout=14400'

# 长期存储密码
git config --global credential.helper store

# 重置所有密码。也可以通过参数重置指定范围内的密码。具体请参照 git credential --help
git credential reject
```

## 克隆仓库

```sh
git clone <远程仓库的网址> -b <分支名称> <本地目录>
```

## 添加上游仓库

```sh
# 添加上游仓库
git remote add upstream <仓库地址>

# 显示远程仓库地址
git remote -v
```

## 文件跟踪

查看文件跟踪状态（h 为跳过跟踪）

```sh
git ls-files -v | Select-String '^[s]'
git ls-files -v | grep '^[s]'
```

忽略某个文件更改

```sh
git update-index --skip-worktree <file>
```

取消忽略取消忽略某个文件更改

```sh
git update-index --no-skip-worktree <file>
```

## 分支操作

```sh
# 拉取远程分支
git fetch origin <branch>

# 将 branch 分支合并到当前分支
git merge <branch>

# 显示分支 (含远程分支)
git branch -a

# 创建并切换分支
git checkout -b <branch>

# 创建分支
git branch <branch>

# 切换分支
git checkout <branch>

# 删除分支
git branch -d <branch>

# 将当前分支与远程分支映射
git branch -u origin/<branch>

#  显示图形化提交记录  
git log --oneline --graph --decorate --all
```

分支变基操作示意图  
![](Git.assets/image-20240607161155576.png)

## 删除远程文件

```sh
# 加上 -n 这个参数，执行命令时，是不会删除任何文件，而是展示此命令要删除的文件列表预览。
git rm -r -n --cached 文件/文件夹名称 
```

## 文件换行符设置

获取是否会自动转换为 crlf

```sh
git config --global --get core.autocrlf
```

关闭自动转换设置

```sh
git config --global core.autocrlf false
```

## 参考

[stash,reset,cherry-pick,reflog命令](https://juejin.cn/post/7071780876501123085)
