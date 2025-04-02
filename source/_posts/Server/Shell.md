---
title: Shell
categories:
  - Server
date: 2024-10-07 18:20:13
updated: 2025-03-28 17:04:23
---
# Shell

## 变量

**变量名** 和 **等号** 之间不能有空格  
使用大写字母且多个单词下划线连接  
变量值尽量使用双引号包裹  
使用 `{}` 表明引用其他变量时的边界

```shell
#!/bin/bash

LOG_PATH="/var/log/mytest"
NOW_TIME="$(date +%Y%m%d_%H%M%S)"
LOG_FILE="${LOG_PATH}/start_${NOW_TIME}.log"

# 引用
echo "My name is $LOG_PATH"
```

### 位置参数

使用 `$1`, `$2`, ...获取位置参数  
`$0`: 脚本名称  
`$#`: 位置参数个数  
`$@` 或 `$*`: 引用所有参数  
使用双引号时, `$*` 将所有参数视为一个整体, `$@` 依然将每个参数视为独立单元

```shell
#!/bin/bash
echo "如下为 \$*"
for i in "$*" ; do
    echo $i
done
```

### 特殊变量

1. `$?` 获取上一个命令的退出状态码
2. `$$` 获取当前脚本的进程 ID（PID）
3. `$!` 获取最后一个后台运行进程的 ID（PID）
4. `$-` 获取当前 shell 选项

### 默认值

当变量为空或未定义时:  
`:-`: 返回默认值, 不会修改变量  
`:=`: 返回默认值, 同时修改变量

```shell
#!/bin/bash

unset STR
RESULT=${STR:-"haha"}
echo "$STR" # 空
echo "$RESULT" # haha

STR1="hello"
RESULT=${STR1:="heihei"}
echo "$STR1" # heihei
echo "$RESULT" # heihei
```

### 截取操作

```shell
#!/bin/bash

VAR="hello,world"

echo "length:${#VAR}"
# length:11

RESULT=${VAR:2:5}
echo $RESULT
# llo,w

RESULT=${VAR:0-4:3}
echo $RESULT
# orl
```

#### 截取变量值保留右边字符串

最长匹配 `##`  
最短匹配 `#`

```shell
#!/bin/bash
VAR="https://www.example.com/index.html"
RESULT1=${VAR#*//}
RESULT2=${VAR##*/}

echo $RESULT1 # www.example.com/index.html
echo $RESULT2 # index.html
```

#### 截取变量值保留左边字符串

最长匹配 `%%`  
最短匹配 `%`

```shell
#!/bin/bash

VAR="https://www.example.com/index.html"
RESULT1=${VAR%/*}
RESULT2=${VAR%%/*}

echo $RESULT1 # https://www.example.com
echo $RESULT2 # https:
```

### 替换操作

| 操作符 | 作用               | 举例                   |
| ------ | ------------------ | ---------------------- |
| ,,     | 所有大写转小写     | `${VAR,,}`             |
| ,      | 首字母大写转小写   | `${VAR,}`              |
| ^^     | 所有大写转小写     | `${VAR^^}`             |
| ^      | 首字母小写转大写   | `${VAR^}`              |
| //     | 替换所有匹配字符   | `${VAR//hello/buxing}` |
| /      | 替换第一个匹配字符 | `${VAR/hello/buxing}`  | 

## awk

处理文本工具, 逐行处理文本内容  
例: 使用逗号作为分隔符, `{ print }` 执行打印操作, 打印每一行的第一个分割内容

```shell
awk -F, "{ print $1 }" /usr/log/app.log
```

## read

获取用户输入的内容, 默认空格分割按顺序获取

```shell
#!/bin/bash\
echo "输入内容,空格分割:"
read -p "输入名字:" NAME
```
