---
title: React 性能优化
categories:
  - JavaScript Framework
  - React
date: 2025-04-25 14:24:32
updated: 2025-07-29 16:52:17
---
# React 性能优化

**性能优化优化原理**
1. 减少 diff 过程
	1. 将可变部分和不可变部分分离
2. 减少前后 DOM 的差异，提高 diff 效率
	1. 使用性能优化 API
	2. 提高页面渲染效率

### 将可变部分和不可变部分分离

可变数据（state 数据）：state，props，context。  
将父组件中的可变数据封装到一个组件中，避免数据变更导致子组件也重新渲染。

未优化

```jsx
function App() {
  const [count, setCount] =  useState(0)

  const add = () => {
    setCount(count + 1)
  }

  return (
    <div className="App" title={count}>
      <p onClick={add}>{count}</p>
      <Children />
    </div>
  );
}
```

优化后  
Children 实际上属于 App 的子组件，App 的 state 发生变化才会触发 Children 渲染。

```jsx
function App() {
  return (
    <CountWrapper>
      <Children />
    </CountWrapper>
  );
}

function CountWrapper({children}) {
  const [count, setCount] =  useState(0)

  const add = () => {
    setCount(count + 1)
  }

  return (
    <div className="App" title={count}>
      <p onClick={add}>{count}</p>
      {children}
    </div>
  )
}
```

### 使用性能优化 API

props 判断是否变更默认使用全等比较。  
使用 `React.memo()` 包裹组件，修改为对象的浅比较。  
**注意**：引用类型属性值修改，引用地址未变的情况。可以是使用 [immutable](https://www.npmjs.com/package/immutable) 数据解决。

### 提高页面渲染效率

**1.DOM 层级不要变**

```jsx
{flag ? (
	<div className="component">子节点内容</div>
) : (
	<div className="outer-box">
		<div className="component">子节点内容</div>
	</div>
)}
```

**2.相同内容节点类型不要变**  
节点类型不一致会导致重建整个子树。  
属性改变不会导致子树重建，只会更新属性。

```jsx
{flag ? (
	<div className="component">子节点内容</div>
) : (
	<span className="component">子节点内容</span>
)}
```

**3.循环元素添加 key 值**  
key 值应在循环内保持唯一，且是稳定的。每次渲染都是固定的。

**4.保持结构的稳定性，避免兄弟节点错位，严重影响性能**  
同级节点默认按顺序比较，错位会影响性能。

```jsx
{flag && <div className="loading"></div>}

<div className="component">
    <!--子节点内容-->
</div>
<div className="component2">
    <!--子节点内容-->
</div>
```

上述代码，loading 元素会因为条件而不存在，同级节点顺序发生变化。  
即使后续节点没有发生变化，也不会重用。

所以尽量保持结构稳定性。在使用条件渲染的子节点，保证同级元素不多。

```jsx
<!-- 方式一 -->
<div className={`loading ${flag ? '' : 'hidden'}`}></div>
<!-- 方式二 -->
{flag ? <div className="loading"></div> : <div></div>}
<!-- 方式三 -->
<div> {flag && <div className="loading"></div>} </div>

<div className="component">
    <!--子节点内容-->
</div>
<div className="component2">
    <!--子节点内容-->
</div>
```

**5.减少不必要的组件重渲染**

```jsx
<div className="App">
	{data.map((item, i) => {
		return (
			<Item
				key={item.title}
				item={item}
				onClick={() => handleClick(i)}
			/>
		);
	})}
</div>
```

每次父组件的 data 改变触发渲染，默认所有 Item 都会重新渲染。
- 需要给 Item 包裹 `React.memo()`，避免未改动 Item 重渲染。
- 事件处理函数避免传递匿名函数，每次都会生成新的函数，触发子组件渲染。

```jsx
  const clickHandlers = useMemo(() => {
    return data.map((_, i) => () => handleClick(i));
  }, [data.length]);
```

遇到需要传递循环中变量，
- 使用 `useMemo` 生成事件处理函数缓存，每次传递缓存
- 将需要传递的变量传给子组件，子组件内部传递给事件处理函数
- 自定义 `React.memo()` 的比较函数，排除事件处理函数的比较
