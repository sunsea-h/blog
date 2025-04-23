---
title: Server Commands
categories:
  - Server
date: 2024-08-25 14:02:19
updated: 2024-08-25 14:19:15
---

# Server Commands

## SSH

### 秘钥

> 秘钥文件的权限设置应为 600, 否则可能会被 ssh 忽略

```shell
# 生成秘钥
ssh-keygen -t rsa -b 4096 -C "sunsea_h@163.com"
ssh-keygen -t ed25519 -C "sunsea_h@163.com"

# 查看使用秘钥
ssh -vT git@github.com

# 添加秘钥到 ssh agent
ssh-add ~/.ssh/id_rsa
```