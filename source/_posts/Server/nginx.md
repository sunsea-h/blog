---
title: nginx
date: 2024-07-28 23:50:53
updated: 2025-03-07 18:11:43
---
# nginx

![Master-Worker模式](nginx.assets/image-20240803180207587.png)

## 命令

```shell
# 启动命令：
nginx

# 重启命令：
nginx -s reload

# 快速关闭命令
nginx -s stop

# 有序地停止，需要进程完成当前工作后再停止
nginx -s quit

# 直接杀死nginx进程
killall nginx
```

## 目录

```csharp
├── client_body_temp                 # POST 大文件暂存目录
├── conf                             # Nginx所有配置文件的目录
│   ├── fastcgi.conf                 # fastcgi相关参数的配置文件
│   ├── fastcgi.conf.default         # fastcgi.conf的原始备份文件
│   ├── fastcgi_params               # fastcgi的参数文件
│   ├── fastcgi_params.default      
│   ├── koi-utf
│   ├── koi-win
│   ├── mime.types                   # 媒体类型
│   ├── mime.types.default
│   ├── nginx.conf                   #这是Nginx默认的主配置文件，日常使用和修改的文件
│   ├── nginx.conf.default
│   ├── scgi_params                 # scgi相关参数文件
│   ├── scgi_params.default  
│   ├── uwsgi_params                 # uwsgi相关参数文件
│   ├── uwsgi_params.default
│   └── win-utf
├── fastcgi_temp                     # fastcgi临时数据目录
├── html                             # Nginx默认站点目录
│   ├── 50x.html                     # 错误页面优雅替代显示文件，例如出现502错误时会调用此页面
│   └── index.html                   # 默认的首页文件
├── logs                             # Nginx日志目录
│   ├── access.log                   # 访问日志文件
│   ├── error.log                   # 错误日志文件
│   └── nginx.pid                   # pid文件，Nginx进程启动后，会把所有进程的ID号写到此文件
├── proxy_temp                       # 临时目录
├── sbin                             # Nginx 可执行文件目录
│   └── nginx                       # Nginx 二进制可执行程序
├── scgi_temp                       # 临时目录
└── uwsgi_temp                       # 临时目录
```

## 配置文件

*config.conf*  
![](nginx.assets/image-20240812233121008.png)

```nginx
# 启动进程,通常设置成和cpu的数量相等
worker_processes  1;

# 全局错误日志定义类型，[debug | info | notice | warn | error | crit]
error_log  logs/error.log;
error_log  logs/error.log  notice;
error_log  logs/error.log  info;

# 进程pid文件
pid        /var/run/nginx.pid;

# 工作模式及连接数上限
events {
    # 仅用于linux2.6以上内核,可以大大提高nginx的性能
    use   epoll;

    # 单个后台worker process进程的最大并发链接数
    worker_connections  1024;

    # 客户端请求头部的缓冲区大小
    client_header_buffer_size 4k;

    # keepalive 超时时间
    keepalive_timeout 60;

    # 告诉nginx收到一个新连接通知后接受尽可能多的连接
    # multi_accept on;
}

# 设定http服务器，利用它的反向代理功能提供负载均衡支持
http {
    # 文件扩展名与文件类型映射表义
    include       /etc/nginx/mime.types;

    # 默认文件类型
    default_type  application/octet-stream;

    # 默认编码
    charset utf-8;

    # 服务器名字的hash表大小
    server_names_hash_bucket_size 128;

    # 客户端请求头部的缓冲区大小
    client_header_buffer_size 32k;

    # 客户请求头缓冲大小
    large_client_header_buffers 4 64k;

    # 设定通过nginx上传文件的大小
    client_max_body_size 8m;

    # 开启目录列表访问，合适下载服务器，默认关闭。
    autoindex on;

    # sendfile 指令指定 nginx 是否调用 sendfile 函数（zero copy 方式）来输出文件，对于普通应用，
    # 必须设为 on,如果用来进行下载等应用磁盘IO重负载应用，可设置为 off，以平衡磁盘与网络I/O处理速度
    sendfile        on;

    # 此选项允许或禁止使用socke的TCP_CORK的选项，此选项仅在使用sendfile的时候使用
    #tcp_nopush     on;

    # 连接超时时间（单秒为秒）
    keepalive_timeout  65;


    # gzip模块设置
    gzip on;               #开启gzip压缩输出
    gzip_min_length 1k;    #最小压缩文件大小
    gzip_buffers 4 16k;    #压缩缓冲区
    gzip_http_version 1.0; #压缩版本（默认1.1，前端如果是squid2.5请使用1.0）
    gzip_comp_level 2;     #压缩等级
    gzip_types text/plain application/x-javascript text/css application/xml;
    gzip_vary on;

    # 开启限制IP连接数的时候需要使用
    #limit_zone crawler $binary_remote_addr 10m;

    # 指定虚拟主机的配置文件，方便管理
    include /etc/nginx/conf.d/*.conf;


    # 负载均衡配置
    upstream aaa {
        # 请见上文中的五种配置
    }


		# 虚拟主机的配置
    server {

        # 监听端口
        listen 80;

        # 域名可以有多个，用空格隔开
        server_name www.aaa.com aaa.com;

        # 默认入口文件名称
        index index.html index.htm index.php;
        root /data/www/sk;

        # 图片缓存时间设置
        location ~ .*.(gif|jpg|jpeg|png|bmp|swf)${
            expires 10d;
        }

        #JS和CSS缓存时间设置
        location ~ .*.(js|css)?${
            expires 1h;
        }

        # 日志格式设定
        #$remote_addr与 $http_x_forwarded_for用以记录客户端的ip地址；
        #$remote_user：用来记录客户端用户名称；
        #$time_local：用来记录访问时间与时区；
        #$request：用来记录请求的url与http协议；
        #$status：用来记录请求状态；成功是200，
        #$body_bytes_sent ：记录发送给客户端文件主体内容大小；
        #$http_referer：用来记录从那个页面链接访问过来的；
        log_format access '$remote_addr - $remote_user [$time_local] "$request" '
        '$status $body_bytes_sent "$http_referer" '
        '"$http_user_agent" $http_x_forwarded_for';

        # 定义本虚拟主机的访问日志
        access_log  /usr/local/nginx/logs/host.access.log  main;
        access_log  /usr/local/nginx/logs/host.access.404.log  log404;

        # 对具体路由进行反向代理
        location /connect-controller {

            proxy_pass http://127.0.0.1:88;
            proxy_redirect off;
            proxy_set_header X-Real-IP $remote_addr;

            # 后端的Web服务器可以通过X-Forwarded-For获取用户真实IP
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header Host $host;

            # 允许客户端请求的最大单文件字节数
            client_max_body_size 10m;

            # 缓冲区代理缓冲用户端请求的最大字节数，
            client_body_buffer_size 128k;

            # 表示使nginx阻止HTTP应答代码为400或者更高的应答。
            proxy_intercept_errors on;

            # nginx跟后端服务器连接超时时间(代理连接超时)
            proxy_connect_timeout 90;

            # 后端服务器数据回传时间_就是在规定时间之内后端服务器必须传完所有的数据
            proxy_send_timeout 90;

            # 连接成功后，后端服务器响应的超时时间
            proxy_read_timeout 90;

            # 设置代理服务器（nginx）保存用户头信息的缓冲区大小
            proxy_buffer_size 4k;

            # 设置用于读取应答的缓冲区数目和大小，默认情况也为分页大小，根据操作系统的不同可能是4k或者8k
            proxy_buffers 4 32k;

            # 高负荷下缓冲大小（proxy_buffers*2）
            proxy_busy_buffers_size 64k;

            # 设置在写入proxy_temp_path时数据的大小，预防一个工作进程在传递文件时阻塞太长
            # 设定缓存文件夹大小，大于这个值，将从upstream服务器传
            proxy_temp_file_write_size 64k;
        }

        # 动静分离反向代理配置（多路由指向不同的服务端或界面）
        location ~ .(jsp|jspx|do)?$ {
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_pass http://127.0.0.1:8080;
        }
    }
}
```

###### location

优先级：精确匹配 (`=`) > 优先前缀匹配 (`^~`) > 正则匹配 (`~`， `~*`) > 普通前缀匹配 (`/api/`) > 通用匹配 (`/`)

```plaintext
        请求 URI
           │
           ▼
    精确匹配（=）? → 匹配 → 使用
           │
           ▼
    优先前缀（^~）? → 最长匹配 → 使用
           │
           ▼
    正则匹配（~或~*）? → 第一个匹配的正则 → 使用
           │
           ▼
    普通前缀匹配 → 最长匹配 → 使用
           │
           ▼
    通用匹配（/） → 使用
```

- `=` 开头表示**精确匹配**
- `^~` 开头表示 uri 以某个常规字符串开头，不是正则匹配
- `~` 开头表示**区分大小写**的正则匹配;
- `~*` 开头表示**不区分大小写**的正则匹配
- `/` **通用匹配**, 如果没有其它匹配,任何请求都会匹配到

## 进程模式 Master-Worker 

**Master 进程**  
读取并验证配置文件 nginx.conf；管理 worker 进程  
**Worker 进程**  
每一个 Worker 进程都维护一个线程（避免线程切换），处理连接和请求；注意 Worker 进程的个数由配置文件决定，一般和 CPU 个数相关（有利于进程切换），配置几个就有几个 Worker 进程

```ad-note
正向代理: 代理的是客户端, VPN

反向代理: 代理的是服务器
```

## 热部署

修改配置文件 nginx.conf 后，重新生成新的 worker 进程  
新的请求交给新 worker 进程, 等待旧 worker 进程处理完所有任务后 kill

```shell
# 启动
nginx

# 重启
nginx -s reload

# 配置
nginx -t

# 查看进程
ps -ef | grep nginx
```

## 负载均衡

## 跨域请求

```nginx
server {
    listen   80;
    location / {
        # 服务器默认是不被允许跨域的。
        # 配置`*`后，表示服务器可以接受所有的请求源（Origin）,即接受所有跨域的请求
        add_header Access-Control-Allow-Origin *;
        
        add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
        add_header Access-Control-Allow-Headers 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization';
        
        # 发送"预检请求"时，需要用到方法 OPTIONS ,所以服务器需要允许该方法
        # 给OPTIONS 添加 204的返回，是为了处理在发送POST请求时Nginx依然拒绝访问的错误
        if ($request_method = 'OPTIONS') {
            return 204;
        }
    }
}
```

## 开启 Gzip 压缩

```nginx
# gzip模块设置
gzip on;               #开启gzip压缩输出
gzip_min_length 1k;    #最小压缩文件大小
gzip_buffers 4 16k;    #压缩缓冲区
gzip_http_version 1.0; #压缩版本（默认1.1，前端如果是squid2.5请使用1.0）
gzip_comp_level 2;     #压缩等级

# 设置什么类型的文件需要压缩
gzip_types text/plain application/x-javascript text/css application/xml;

# 用于设置使用Gzip进行压缩发送是否携带“Vary:Accept-Encoding”头域的响应头部
# 主要是告诉接收方，所发送的数据经过了Gzip压缩处理
gzip_vary on;
```
