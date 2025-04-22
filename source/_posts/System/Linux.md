---
title: Linux
date: 2022-09-26 09:27:58
updated: 2024-08624-00025 1413:46:32
---

# Linux

## 文件系统

```txt
/
/root           超级管理员的家目录
/home/charles   charles用户的家目录
/home/jacky     jacky用户的家目录
/etc            配置文件目录
	 group         组信息
	 passwd        账号信息
	 shadow        账号敏感信息(普通账号无法查看)
/var            可变目录
/opt            第三方软件安装目录 jdk,nodejs
/usr/local      默认软件安装目录 apt install
```

| 命令  | 作用                                                                                               |
| ----- | -------------------------------------------------------------------------------------------------- |
| cd    | 切换目录，.当前，..上层目录，~当前用户家目录                                                       |
| pwd   | 当前路径                                                                                           |
| ls    | 查看目录内容，-a 查看所有（包含隐藏文件），-l 长文件格式（详细信息），-r 逆序，- d 目录自身，-R 递归 |
| touch | 创建空文件，更新时间戳                                                                             |
| mkdir | 创建目录，-p 创建目录及其父目录                                                                     |
| rmdir | 删除空目录                                                                                         |
| rm    | 删除，-f 强制，-r 递归                                                                               |
| cp    | 拷贝，-r 递归                                                                                       |
| mv    | 移动，重命名                                                                                       |
| file  | 查看文件类型                                                                                       |
| cat   | 只读方式查看文件内容                                                                               |
| head  | 查看文件前十行，-n 指定行数                                                                         |
| tail  | 查看文件后十行，-n 指定行数                                                                         |
| wc    | 统计 -l 行数 -w 单词数 -c 字节数                                                                      |
| grep  | 行查找，-i 忽略大小写，-n 显示行号，-v 反选                                                        |
| find  | 查找文件，-name 文件名，-user 所有者，-group 所属组，-perm 权限                                    | 

```shell
#将date函数的输出重定向到a文件中，a如果不存在，创建。会覆盖
date > a

#（重定向）将date函数的输出重定向到a文件中，a如果不存在，创建。不会覆盖
date >> a

#输入内容到文件，直到遇见EOF('<<'后的内容)结束
tee ./aa.json <<EOF
{
  "xxxxx": "xxxxxxxxxxxxxxxxxxxxxxxx",
  "zzzzzzz": "zzzzzzzzzzzzzzzzzzzzzzzzzzzz"
}
EOF
```

### 文件权限

普通用户拥有自己家目录中所有的权限。  
**权限说明**：
- 文件  
d 目录  
rw-r--r--  
角色：拥有者 u、同组人 g、其他人 o  
权限：读 r、写 w、执行 x  
修改权限 chmod  
一个文件的权限拥有者可以修改、超级管理员、普通管理员也可以修改。

rw-rw-r--  
110 110 100  
6 6 4

```shell
# 为hello.js添加同组人编写的权限
chmod g+w hello.js 

# 修改world.js文件的权限
chmod 664 world.js
```

## 获取帮助

| 命令 | 作用                                                                             |
| ---- | -------------------------------------------------------------------------------- |
| man  | 查看帮助，g 文档开头，G 文档结尾，/string 查找 string 字符串，n 下一个，N 上一个 |
| help | 查看帮助，-h --help                                                              | 

## 压缩归档

| 命令 | 作用 |
| ---- | ---- |
| tar  |  归档，-c 打包，-x 解包，-v 显示过程，-f 文件名，-t 查看包内容，-z gzip，-j bzip2，-Jxz    |

## 用户管理

| 命令     | 作用                                                                                                                 |
| -------- | -------------------------------------------------------------------------------------------------------------------- |
| useradd  | 创建用户，-u 指定 uid，-g 指定基本组，-G 指定扩展组，-s 指定默认 shell，-N 不创建同名基本组，-d 指定家目录            |
| groupadd | 创建组，-g 指定 gid                                                                                                  |
| usermod  | 修改用户，-s 修改 shell，-u 修改 uid，-g 修改基本组，-G 修改扩展组，-L 锁定，-U 解锁，-m -d 指定新家目录并转移用户数据 |
| groupmod | 修改组，-g 修改 gid，-n 修改组名                                                                                     |
| chown    | 修改文件或目录所有者，-R 递归                                                                                        |
| chgrp    | 修改文件或目录所属组，-R 递归                                                                                        |

### 用户、权限

普通用户只能在自己的家目录中创建文件、删除文件、修改文件。  
用户组

```shell
# 增加一个web-ui组
groupadd web-ui

#1.创建用户 vicky
#2.创建组  vicky
#3.将vicky添加到 vicky组中
#4.建一个加目录 /home/vicky
#5.将家目录的默认文件/etc/skel进行拷贝->/home/vicky
adduser vicky

#1.创建用户 vicky
#2.将vicky添加到 1019组中
#3.创建一个加目录 /home/vicky
#4.将家目录的默认文件/etc/skel进行拷贝->/home/vicky
adduser --gid 1019 vicky

#将zhangnn彻底删除
userdel -r zhangnn

#id [用户名]
#查看账号信息

#将larry的组id更换为1009
usermod --gid=1009 larry

#切换到指定账号下，账号如果缺省，表示切换到超级管理员下
#su - 账号
```

## 远程登录、远程文件传输

```shell
#使用root账号，登录ip为121.199.29.84的主机
ssh root@121.199.29.84 

#退出登录
exit

#将当前目录下的app.zip上传到ip为121.199.29.84 /var/www/html
#(使用root账号登录，如果使用普通账号登录，只能将文件传输到家目录中)
#scp 本地文件地址 用户名@ip:远程文件地址
scp ./app.zip root@121.199.29.84:/var/www/html
```

## 进程监控、端口号查询、磁盘查询...

```shell
#查看当前系统进程状态
ps    
ps -aux
ps -ef

#控制系统服务
service 服务名 status/restart/start/stop    

#查看网络配置
netstat -tlp    

#列出打开文件，可用于查看端口号被占用的情况
lsof -i    
```

## 软件

```shell
#查看安装的所有软件  
dpkg -l  
dpkg -l | grep ftp

#查看软件安装的路径  
dpkg -L | grep ftp  
whereis ftp

#搜索所有列表  
sudo apt-cache search all

#搜索所有软件并去掉重复  
sudo apt-cache search all | wc

#检索指定软件  
sudo apt-cache search all | grep gcc
```

### 解压缩安装

```shell
 jdk、nodejs
 1) 下载 wget ; 本地下载，上传阿里云 （.tar.gz , .tar.xz , ...）
 2) 解压
/opt $ sudo tar -xvf node-v14.17.5-linux-x64.tar.xz
/opt/node-v14.17.5      # nodejs的家目录

 3) 环境变量配置
 全局
/etc/profile
 本地
~/.bashrc

 添加内容：
 export NODE_HOME=/opt/node-v14.17.5
 export PATH=$NODE_HOME/bin:$PATH

 4) 生效
source .bashrc
```

3. 编译安装  
	 nginx、fastdfs  
	 c 开发 -> 编译 -> 运行

4. 实例安装 nodejs

```shell
 1) 下载压缩包
/opt $ sudo wget https://nodejs.org/dist/v14.17.5/node-v14.17.5-linux-x64.tar.xz

 2) 解压
/opt $ sudo tar -xvf node-v14.17.5-linux-x64.tar.xz

 3) 环境变量配置
 用户环境变量配置
~/.bashrc
~/.profile

 系统环境变量配置
/etc/profile

 添加内容：
 export NODE_HOME=/opt/node-v14.17.5-linux-x64
 export PATH=$NODE_HOME/bin:$PATH

 4) 使生效
source .bashrc
node --version
```

## 终端会话

[Tmux 入门指南](https://linux.cn/article-5800-weibo.html)

## 其他命令

| 命令     | 作用     |
| -------- | -------- |
| poweroff | 关机     |
| reboot   | 重启     |
| echo     | 输出内容 |
| wget     | 下载     |

## 帮助

[GitHub - jaywcjlove/linux-command: Linux命令大全搜索工具，内容包含Linux命令手册、详解、学习、搜集。https://git.io/linux](https://github.com/jaywcjlove/linux-command)