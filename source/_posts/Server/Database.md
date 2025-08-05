---
title: Database
categories:
  - Server
date: 2024-12-24 14:23:18
updated: 2025-07-26 10:58:08
---
# Database

## MySQL

```shell
// 安装
apt install mysql-server

// 连接client
mysql -u root -p

// 设置密码
USE mysql;
ALTER USER 'root'@'localhost' IDENTIFIED BY 'root';

// 创建用户
CREATE USER 'hxh'@'%' IDENTIFIED BY 'hxh';
GRANT ALL PRIVILEGES ON *.* TO 'hxh'@'%';

FLUSH PRIVILEGES;

// 重启服务
service mysql restart
```

## 好用软件

[HexHub \| 先进的数据库、SSH、SFTP桌面GUI工具](https://www.hexhub.cn/)

## 查询

分页查询数据量越大性能越慢，可以将上一页最大数据当做查询条件。
