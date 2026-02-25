---
title: System Commands
categories:
  - System
date: 2023-12-03 15:46:11
updated: 2025-10-15 16:27:24
---
# System Commands

## Bash

### 变量子串

1. `${var}` 返回变量 var 的内容，单独使用时有没有 {} 一样，混合多个变量和常量时，用 {} 界定变量名
2. `${#var}` 返回变量 var 内容的长度
3. `${var:offset}` 从变量 var 中的偏移量 offset 开始截取到字符串结尾的子字符串，offset 从 0 开始
4. `${var:offset:length}` 从变量 var 中的偏移量 offset 开始截取长度为 length 的子字符串
5. `${var#*.}` 从变量 var 中删除第一个匹配的点（.）及其左边的所有字符
6. `${var##*.}` 从变量 var 中删除最后一个匹配的点（.）及其左边的所有字符
7. `${var%.*}` 从变量 var 中删除最后一个匹配的点（.）及其右边的所有字符
8. `${var%%.*}` 从变量 var 中删除第一个匹配的点（.）及其右边的所有字符
9. `${var/pattern/string}` 使用 string 代替第一个匹配的 pattern
10. `${var//pattern/string}` 使用 string 代替所有匹配的 pattern
11. `${var,}` 首字母转小写
12. `${var,,}` 全部转小写
13. `${var^}` 首字母转大写
14. `${var^^}` 全部转大写

### 特殊扩展变量

1. `${var-word}` 如果变量 var 未赋值，则返回字符串 word
2. `${var:-word}` 如果变量 var 未赋值或者值为空，则返回字符串 word
3. `${var+word}` 如果变量 var 有值（包括空串 ""），则返回字符串 word  
4. `${var:+word}` 如果变量 var 有值且不为空，则返回字符串 word
5. `${var=word}` 如果变量 var 未赋值，则返回字符串 word，并为 var 赋值为字符串 word
6. `${var:=word}` 如果变量 var 未赋值或者值为空串，则返回字符串 word，并为 var 赋值为字符串 word
7. `${var?word}` 如果变量 var 未赋值，将字符串 word 作为标准错误输出，否则返回变量 var 的值  
8. `${var:?word}` 如果变量 var 未赋值或者值为空串，将字符串 word 作为标准错误输出，否则返回变量 var 的值

### 数组

array=(1 2 3 a b c) 定义一个名为 array 的数组，包含了 6 个元素，元素字段类型不需要统一
1. `${array[index]}` 访问数组中的元素，index 从 0 开始，如果为负表示从数组的末尾开始的偏移量
2. `${array[*]}` 获取数组中所有元素
3. `${array[@]}` 获取数组中所有元素
4. `${#array[*]}` 获取数组的长度
5. `${#array[@]}` 获取数组的长度
6. `${!array[@]}` 获取数组索引列表，返回 0 1 2 3 4 5
7. `array+=(4 d)` 向数组中添加元素，数组内容为 1 2 3 a b c 4 d
8. `unset array[6]` 删除第 7 个元素，数组内容为 1 2 3 a b c d
9. `unset array[-1]` 删除倒数第 1 个元素，数组内容为 1 2 3 a b c

### 多行字符串变量

> 单引号中 `${}` 和 `$()` 等都不会取表达式的值，双引号中才会

```bash
var=$( cat <<- 'EOF'
	line1
	line2
	...
	EOF
)

var='line1
line2
...'
```

### Shell 系统变量

```bash
$1 表示第一个参数，$2 表示第二个参数 ...

$# 命令行参数的个数

$0 当前Shell脚本程序的名称

$? 前一个命令或函数的返回码

$* 以 "参数1 参数2 ... " 形式获取所有参数

$@ 以 "参数1" "参数2" ... 形式获取所有参数

$$ 本程序的进程ID，即PID

$! 上一个命令的PID

$PPID 父进程的PID

$UID 执行这个脚本的当前用户ID
```
