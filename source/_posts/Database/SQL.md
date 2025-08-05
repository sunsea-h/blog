---
title: SQL
categories:
  - Database
date: 2025-04-18 17:08:56
updated: 2025-08-01 16:42:03
---
# SQL

## 关键字优先级

```
from > where > group by > having > order by
```

## partition by 和 group by

`group by`  
分组函数  
保留全部数据的基础上，只对其中某些字段做分组排序  
常配合聚合函数使用（`SUM()`, `AVG()`, `COUNT()`, `MAX()`, `MIN()`）

`partition by`  
分析函数  
只保留参与分组的字段和聚合函数的结果  
常与 `ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`, `NTILE()` 一同使用
