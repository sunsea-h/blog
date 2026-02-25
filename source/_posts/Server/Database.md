---
title: Database
categories:
  - Server
date: 2024-12-24 14:23:18
updated: 2025-09-26 15:01:16
---
# Database

## SQL

### NOT IN 和 IN

`not in` 和 `in` 无法命中索引。  
一旦子查询中有 `NULL`，就会“失效”。  
在筛选不存在于表 2 的表 1 中的字段时，如果表 2 中存在 NULL，在比较时会返回未知 UNKNOWN，sql 只会保留 TRUE，所以会导致结果错误。  
可用于**确定**但**有限**的集合。

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
