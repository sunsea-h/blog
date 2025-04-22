---
date: 2024-12-24 14:23:18
updated: 2025-03-28 10:35:35
title: Database
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
