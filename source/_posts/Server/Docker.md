---
title: Docker
date: 2022-09-26 09:27:58
updated: 2025-02-25 14:41:24
---
# Docker

```shell
# 查看所有容器
docker ps -a

# 删除所有已停止的容器
docker container prune
```

## 安装

1. unload 原的 docker  
   sudo apt-get remove docker docker-engine docker-ce docker.io  
   sudo apt-get update

2. apt-get 可以使用 https 库  
   sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common

3. 添加 docker 的使用的公钥  
   curl -fsSL https://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | sudo apt-key add -

4. 添加 docker 的远程库  
   add-apt-repository "deb [arch=amd64] https://mirrors.aliyun.com/docker-ce/linux/ubuntu $(lsb_release -cs) stable"  
   apt-get update

5. 安装 docker-ce  
   sudo apt-get install -y docker-ce

6. 启动 docker  
   systemctl status docker

7. 以终端形式运行  
   sudo docker run -it xxx

## 使用

### 三要素

1. 镜像（模板 -> 源码）

   ```shell

docker images # 列出本地镜像  
docker search ubuntu # 搜索 ubuntu 镜像  
docker pull ubuntu # 下载 ubuntu 镜像

   ```

2. 容器（实例 -> 运行吗）  
   容器由镜像创建而来

   ```shell
docker run -it ubuntu        	# 以伪终端交互方式创建一个ubuntu容器
docker run -d tomcat        	# 后台运行tomcat容器
exit                        	# 彻底退出
ctrl + p + q                	# 暂时退出
docker attach                	# 进入容器
docker ps                    	# 查看docker进程
docker exec -it xxxID 			# 在运行的容器中执行命令
docker cp 源路径 xxxID:目的路径	# 将源路径文件拷贝到指定容器的目的路径下
docker commit 					# 从容器创建一个新的镜像
docker kill xxxID		    	# 退出容器
   ```

3. 仓库（存储镜像的地方 -> gitee/github）

### docker 工作流

- 开发后端接口（Java）4 套 jar
- 基础镜像（ubuntu）
  - 搭建环境（jdK、mysql、apache2、nodejs、tomcat、...）
  - 部署代码  
    jar/war  
    数据库  
    前端
  - 提交镜像 ubuntu-briup-webui
- 发布镜像（阿里云）
