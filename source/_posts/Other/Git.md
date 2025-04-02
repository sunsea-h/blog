---
title: Git
categories:
  - Other
date: 2022-09-26 09:27:58
updated: 2025-03-20 10:30:12
---
# Git

## git 仓库操作

- `git remote add upstream <url>`  
	添加上游远程仓库
- `git remote -v`  
	显示远程仓库链接
- `git fetch upstream`  
	拉取上游远程仓库

```bash
# 查看文件跟踪状态 h为跳过跟踪
git ls-files -v | Select-String '^[s]'
git ls-files -v | grep '^[s]'

# 忽略某个文件的更改
git update-index --skip-worktree <file>
# 取消忽略
git update-index --no-skip-worktree <file>
```

## git 分支操作

- `git fetch origin <branch>`  
	拉取远程分支
- `git merge <branch>`  
	将 branch 分支合并到当前分支
- `git branch -a`  
	显示分支 (含远程分支)
- `git checkout -b <branch>`  
	创建并切换分支
- `git branch <branch>`  
	创建分支
- `git checkout <branch>`  
	切换分支
- `git branch -d <branch>`  
	删除分支
- `git branch -u origin/<branch>`  
	将当前分支与远程分支映射
- `git push origin <本地分支名>:<远程分支名>`
- `git pull origin <远程分支名>:<本地分支名>`
- `git clone -b <branch> <url>`  
	拉去指定分支
- `git rebase`  
  变基  
![](../Other/Git.assets/image-20240607161155576.png)

 - `git log --oneline --graph --decorate ---all`  
   显示图形化提交记录  
   简化，别名 `alias graph="git log --oneline --graph --decorate ---all"` 

## 配置项目仓库的用户和邮箱

```shell
git config --local user.name "xiaohai.han@hand-china.com"
git config --local user.email "xiaohai.han@hand-china.com"
```

## 凭证

```shell
# 默认缓存（默认15分钟）
git config --global credential.helper cache

# 指定缓存时长
git config --global credential.helper 'cache --timeout=14400'

# 长期存储密码
git config --global credential.helper store

# 重置所有密码。也可以通过参数重置指定范围内的密码。具体请参照 git credential --help
git credential reject

```

## 参考

[stash,reset,cherry-pick,reflog命令](https://juejin.cn/post/7071780876501123085)
