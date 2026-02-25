---
title: PostgreSQL
categories:
  - Database
date: 2025-10-15 17:10:03
updated: 2025-10-16 11:16:47
---
# # PostgreSQL

### 环境查看命令

1. 显示服务器版本

```sql
SHOW SERVER_VERSION;
```

2. 显示所有环境变量

```sql
SHOW ALL;
```

3. 显示当前登录用户

```sql
SELECT current_user;/* 结果示例： admin */
```

4. 显示当前数据库

```sql
SELECT current_database();/* 等效快捷命令： \c */
```

### 数据库操作命令

1. 显示当前连接的数据库

```sql
SELECT current_database();/* 返回结果示例: current_database -------------------sales_db */
```

2. 创建新数据库

```sql
CREATE DATABASE <database_name> 
WITH OWNER = <username>ENCODING = 'UTF8';  /* 推荐字符编码 *//* 示例: CREATE DATABASE logistics WITH OWNER = admin; */
```

3. 删除数据库

```sql
DROP DATABASE IF EXISTS <database_name>;/* 添加 IF EXISTS 可避免删除不存在的库时报错 */
```

4. 重命名数据库

```sql
ALTER DATABASE <old_database_name>
RENAME TO <new_database_name>;/* 示例: ALTER DATABASE table_name_old RENAME TO <table_name_new> */
```

### 表管理命令集

#### 1. 列出当前数据库的表

```sql
-- 快捷命令：\dt      --\dt 默认只显示当前用户有权限的表-- 标准SQL查询：
SELECT table_schema AS "模式", table_name AS "表名"
FROM information_schema.tables 
WHERE table_catalog = current_database()
ORDER BY 1, 2;
```

#### 2. 全局表列表（所有数据库）

```sql
SELECT schemaname AS "模式",       
				tablename AS "表名",       
				tableowner AS "Owner"
FROM pg_catalog.pg_tables;
```

#### 3. 查看表结构

```sql
SELECT column_name AS "列名",       
			data_type AS "类型",       
			character_maximum_length AS "长度",       
			is_nullable AS "可空"
FROM information_schema.columns 
WHERE <table_name> = 'table_name'
ORDER BY <ordinal_position>;
```

#### 4. 创建表

```sql
-- 基础创建：
CREATE TABLE <table_name> (
    id INT,
    name VARCHAR(50),
    create_date DATE
);
-- 示例 主键自增：
CREATE TABLE departments (
    dept_id SERIAL PRIMARY KEY, -- 自动创建序列    
    dept_name VARCHAR(100) UNIQUE
);
```

#### 5. 删除表（危险操作！）

```sql
-- 安全删除：
DROP TABLE IF EXISTS temp_data CASCADE;
-- 级联删除效果：   ✓ 删除表数据   ✓ 删除相关索引/触发器   ✓ 解除依赖该表的外键约束
```

### Permissions 权限篇

#### 1. 数据库权限

- 权限层级：`CONNECT` → `TEMPORARY`→ `CREATE` → `ALL PRIVILEGES`

```sql
-- 授予数据库所有权限：
GRANT ALL PRIVILEGES ON DATABASE <db_name> TO <user_name>;
-- 授予连接权限（基础权限）：
GRANT CONNECT ON DATABASE <db_name> TO <user_name>;
```

#### 2. 模式权限

```sql
-- 授予模式使用权限：
GRANT USAGE ON SCHEMA public TO <user_name>;
-- 授予函数执行权限：
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO <user_name >;
```

#### 3. 表权限

```sql
-- 所有表授权（当前模式）：
GRANTSELECT,
INSERT
,
UPDATE,
DELETE ON ALL TABLES IN SCHEMA public TO user_name;
-- 单表授权：
GRANT SELECT, UPDATE, INSERT ON table_name TO < user_name >;
-- 只读权限：
GRANT SELECT ON ALL TABLES IN SCHEMA public TO < user_name >;
```

### 表结构变更与数据操作

#### 1. 添加新列

```sql
-- 基础语法：
ALTER TABLE <table_name> ADD <column_name> <data_type> [<constraints>];
-- 例子：
ALTER TABLE employees
ADD COLUMN birth_date DATE NOT NULL DEFAULT '2000-01-01';
```

> 注意：
> - 添加 `NOT NULL` 列时**必须**指定默认值
> - 大表操作建议在低峰期执行

#### 2. 修改列定义

```sql
-- 基础语法
ALTER TABLE <table_name>
ALTER <column_name> TYPE <data_type> [<constraints>];
-- 示例：
-- 修改数据类型：
ALTER TABLE products 
ALTER COLUMN price TYPE NUMERIC(10, 2);
-- 改为带精度的数字
-- 添加约束：
ALTER TABLE customers 
ALTER COLUMN email SET NOT NULL;
-- 移除约束：
ALTER TABLE orders 
ALTER COLUMN coupon_code DROP NOT NULL;
```

#### 3. 删除列

```sql
-- 基础语法：
ALTER TABLE <table_name> 
DROP COLUMN IF EXISTS <column_name>;
```

**温馨提示：**

- 数据立即永久删除
- 先确认无依赖关系：`SELECT * FROM information_schema.constraint_column_usage WHERE table_name = 'users' AND column_name = 'obsolete_phone';`

#### 4. 添加自增主键

```sql
-- 基础语法：
ALTER TABLE < table_name >
ADD COLUMN < column_name > SERIAL PRIMARY KEY;
-- 示例：
-- 新增自增主键列：
ALTER TABLE product ADD COLUMN product_id SERIAL PRIMARY KEY;
-- 已有列转自增主键：
ALTER TABLE sales ADD COLUMN sales_id SERIAL;

ALTER TABLE sales ADD PRIMARY KEY (sales_id);
```

> 💡 技巧解释：  
> `SERIAL` = `INTEGER` + 自动序列 + 默认值 `nextval('table_col_seq')`

#### 5. 使用自动递增的主键插入表中

```sql
-- 基础语法：
INSERT INTO < table_name > VALUES (DEFAULT, < value1 >);

INSERT INTO
    < table_name > (
        < column1_name >,
        < column2_name >
    )
VALUES (< value1 >, < value2 >);
-- 示例:
-- 方案1：使用DEFAULT关键字
INSERT INTO customers VALUES ( DEFAULT, '张三', 'zhangsan@example.com' );
-- 方案2：省略自增列
INSERT INTO orders (product_id, quantity) VALUES (101, 3);
-- 方案3：多行插入
INSERT INTO
    employees (name, department)
VALUES ('李四', 'HR'),
    ('王五', 'IT'),
    ('赵六', 'saler');
```

### 数据操作 DML

#### 1. 数据查询（SELECT）

```sql
-- 基础语法
SELECT <column1>, <column2> FROM <table_name>
WHERE <condition>
ORDER BY <column> [ASC|DESC]
LIMIT <count>;
-- 示例：
-- 1. 全表查询
-- 获取所有员工数据
SELECT * FROM employees;

-- 2. 单行查询
-- 获取第一条订单
SELECT * FROM orders LIMIT 1;

-- 3. 条件查询
-- 高价电子产品
SELECT * FROM products WHERE price > 100 AND category = 'apple';
```

#### 2. 数据插入 (INSERT)

```sql
-- 基础语法：
INSERT INTO
    < table_name > [(<column1>, <column2>, ...)]
VALUES
    (< value1 >, < value2 >,...) [, (<value1>, <value2>, ...)];

-- 多行插入
-- 示例：
-- 1. 全列插入
-- 按表结构顺序
INSERT INTO customers VALUES (101, '张三', 'zhangsan@qq.com');


-- 2. 安全插入（推荐）
-- 明确指定列名
INSERT INTO
    orders (
        order_date,
        customer_id,
        amount
    )
VALUES (CURRENT_DATE, 42, 199.99);
```

#### 3. 数据更新 (UPDATE)

```sql
-- 基础语法：
UPDATE < table_name >
SET
    < column1 > = < value1 >,
    < column2 > = < value2 >
[WHERE < condition >];
-- 缺少WHERE将更新所有行！
-- 示例：
UPDATE employeesSET department = 'IT',
salary = salary * 1.1WHERE id = 123;
```

#### 4. 数据删除 (DELETE)

```sql
-- 基础语法：
DELETEFROM <table_name> [WHERE <condition>];  -- 缺少WHERE将删除所有数据！
-- 示例：
-- 1. 条件删除
DELETE FROM logs WHERE created_at < '2023-01-01';  -- 删除旧日志
-- 2. 全表删除（极度危险！）
DELETE FROM temp_data;  -- 清空临时表（无WHERE条件）-- 
```

### 角色和 schema 的管理命令

#### 角色管理

1. 列出所有角色

```sql
SELECT rolname AS "角色名称", 
				rolsuper AS "超级用户", 
				rolcreaterole AS "可创建角色"
FROM pg_roles;
```

2. 创建用户

```sql
-- 创建用户（带登录权限）：
CREATE USER <user_name> WITH PASSWORD '<password>';
```

3. 删除用户

```sql
DROP USER IF EXISTS <user_name>;
```

4. 更改用户密码：

```sql
ALTER ROLE <user_name> WITH PASSWORD '<password>';
```

#### 模式管理

1. 列出 SCHEMAS

```sql
SELECT schema_name FROM information_schema.schemata;
SELECT nspname FROM pg_catalog.pg_namespace;
```

2. 创建模式

```sql
CREATE SCHEMA IF NOT EXISTS <schema_name>;
```

3. 删除模式

```sql
DROP SCHEMA IF EXISTS <schema_name> CASCADE;
```

### 查询逻辑执行顺序

**严格顺序性：**

- `WHERE` 始终在 `GROUP BY` 之前
- `HAVING` 必须在 `GROUP BY` 之后
- `ORDER BY/LIMIT` 总是最后阶段
