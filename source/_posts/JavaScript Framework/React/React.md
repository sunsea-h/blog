---
title: React
categories:
  - JavaScript Framework
  - React
date: 2023-02-17 09:37:55
updated: 2025-07-07 11:11:41
---
# React

### 环境初始化

#### 使用脚手架创建项目

- 打开命令行窗口
- 执行命令

  ```shell
  npx create-react-app react-basic
  ```

  说明：

  1. npx create-react-app 是固定命令，`create-react-app` 是 React 脚手架的名称
  2. react-basic 表示项目名称，可以自定义，保持语义化
  3. npx 命令会帮助我们临时安装 create-react-app 包，然后初始化项目完成之后会自自动删掉，所以不需要全局安装 create-react-app

- 启动项目

  ```shell
  yarn start
  or
  npm start
  ```

#### 项目目录说明调整

- 目录说明

  1. `src` 目录是我们写代码进行项目开发的目录
  2. `package.json` 中俩个核心库：react 、react-dom

- 目录调整

  1. 删除 src 目录下自带的所有文件，只保留 app.js 根组件和 index.js
  2. 创建 index.js 文件作为项目的入口文件，在这个文件中书写 react 代码即可
  
- 入口文件说明

  ```js
  import React from 'react'
  import ReactDOM from 'react-dom'
  import './index.css'
  // 引入根组件App
  import App from './App'
  // 通过调用ReactDOM的render方法渲染App根组件到id为root的dom节点上
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  )
  ```

### vscode 格式化配置

   ```json
{
 "git.enableSmartCommit": true,
 // 修改注释颜色
 "editor.tokenColorCustomizations": {
	 "comments": {
		 "fontStyle": "bold",
		 "foreground": "##82e0aa"
	 }
 },
 // 配置文件类型识别
 "files.associations": {
	 "*.js": "javascript",
	 "*.json": "jsonc",
	 "*.cjson": "jsonc",
	 "*.wxss": "css",
	 "*.wxs": "javascript"
 },
 "extensions.ignoreRecommendations": false,
 "files.exclude": {
	 "**/.DS_Store": true,
	 "**/.git": true,
	 "**/.hg": true,
	 "**/.svn": true,
	 "**/CVS": true,
	 "**/node_modules": false,
	 "**/tmp": true
 },
 // "javascript.implicitProjectConfig.experimentalDecorators": true,
 "explorer.confirmDragAndDrop": false,
 "typescript.updateImportsOnFileMove.enabled": "prompt",
 "git.confirmSync": false,
 "editor.tabSize": 2,
 "editor.fontWeight": "500",
 "[json]": {},
 "editor.tabCompletion": "on",
 "vsicons.projectDetection.autoReload": true,
 "editor.fontFamily": "Monaco, 'Courier New', monospace, Meslo LG M for Powerline",
 "[html]": {
	 "editor.defaultFormatter": "vscode.html-language-features"
 },
 "editor.fontSize": 16,
 "debug.console.fontSize": 14,
 "vsicons.dontShowNewVersionMessage": true,
 "editor.minimap.enabled": true,
 "emmet.extensionsPath": [
	 ""
 ],
 // vue eslint start 保存时自动格式化代码
 "editor.formatOnSave": true,
 // eslint配置项，保存时自动修复错误
 "editor.codeActionsOnSave": {
	 "source.fixAll": true
 },
 "vetur.ignoreProjectWarning": true,
 // 让vetur使用vs自带的js格式化工具
 // uni-app和vue 项目使用
 "vetur.format.defaultFormatter.js": "vscode-typescript",
 "javascript.format.semicolons": "remove",
 // // 指定 *.vue 文件的格式化工具为vetur
 "[vue]": {
	 "editor.defaultFormatter": "octref.vetur"
 },
 // // 指定 *.js 文件的格式化工具为vscode自带
 "[javascript]": {
	 "editor.defaultFormatter": "vscode.typescript-language-features"
 },
 // // 默认使用prettier格式化支持的文件
 "editor.defaultFormatter": "esbenp.prettier-vscode",
 "prettier.jsxBracketSameLine": true,
 // 函数前面加个空格
 "javascript.format.insertSpaceBeforeFunctionParenthesis": true,
 "prettier.singleQuote": true,
 "prettier.semi": false,
 // eslint end
 // react
 // 当按tab键的时候，会自动提示
 "emmet.triggerExpansionOnTab": true,
 "emmet.showAbbreviationSuggestions": true,
 "emmet.includeLanguages": {
	 // jsx的提示
	 "javascript": "javascriptreact",
	 "vue-html": "html",
	 "vue": "html",
	 "wxml": "html"
 },
 // end
 "[jsonc]": {
	 "editor.defaultFormatter": "vscode.json-language-features"
 },
 // @路径提示
 "path-intellisense.mappings": {
	 "@": "${workspaceRoot}/src"
 },
 "security.workspace.trust.untrustedFiles": "open",
 "git.ignoreMissingGitWarning": true,
 "window.zoomLevel": 1
}
   ```

## 基础

### JSX

#### JSX 中使用 js 表达式

`{ JS 表达式 }`

```jsx
const name = '柴柴'

<h1>你好，我叫{name}</h1>   //    <h1>你好,我叫柴柴</h1>
```

**可以使用的表达式**
1. 字符串、数值、布尔值、null、undefined、object（ [] / {} ）
2. 1 + 2、'abc'.split('')、['a', 'b'].join('-')
3. fn()

```ad-tip
title:以下为语句，不是表达式
- ​if 语句
- switch-case 语句
- 变量声明语句
```

#### JSX 列表渲染

```jsx
// 来个列表
const songs = [
  { id: 1, name: '痴心绝对' },
  { id: 2, name: '像我这样的人' },
  { id: 3, name: '南山南' }
]

function App() {
  return (
    <div className="App">
      <ul>
        {
          songs.map(item => <li>{item.name}</li>)
        }
      </ul>
    </div>
  )
}

export default App
```

```ad-tip
title:需要为遍历项添加 `key` 属性

1. key 在 HTML 结构中是看不到的，是 React 内部用来进行性能优化时使用
2. key 在当前列表中要唯一的字符串或者数值（String/Number）
3. 如果列表中有像 id 这种的唯一值，就用 id 来作为 key 值
4. 如果列表中没有像 id 这种的唯一值，就可以使用 index（下标）来作为 key 值
```

#### JSX 条件渲染

```jsx
// 来个布尔值
const flag = true
function App() {
  return (
    <div className="App">
      {/* 条件渲染字符串 */}
      {flag ? 'react真有趣' : 'vue真有趣'}
      {/* 条件渲染标签/组件 */}
      {flag ? <span>this is span</span> : null}
    </div>
  )
}
export default App
```

#### JSX 样式处理

- 行内样式 - style

  ```jsx
  function App() {
    return (
      <div className="App">
        <div style={{ color: 'red' }}>this is a div</div>
      </div>
    )
  }
  
  export default App
  ```

- 行内样式 - style - 更优写法

  ```jsx
  const styleObj = {
      color:red
  }
  
  function App() {
    return (
      <div className="App">
        <div style={ styleObj }>this is a div</div>
      </div>
    )
  }
  
  export default App
  ```

- 类名 - className（推荐）

  *app.css*

  ```css
  .title {
    font-size: 30px;
    color: blue;
  }
  ```

 *app.js*

  ```jsx
  import './app.css'
  
  function App() {
    return (
      <div className="App">
        <div className='title'>this is a div</div>
      </div>
    )
  }
  export default App
  ```

- 类名 - className - 动态类名控制

  ```jsx
  import './app.css'
  const showTitle = true
  function App() {
    return (
      <div className="App">
        <div className={ showTitle ? 'title' : ''}>this is a div</div>
      </div>
    )
  }
  export default App
  ```

#### JSX 注意事项

1. JSX 必须有一个根节点，如果没有根节点，可以使用 `<></>`（幽灵节点）替代
2. 所有标签必须形成闭合，成对闭合或者自闭合都可以
3. JSX 中的语法更加贴近 JS 语法，属性名采用驼峰命名法 `class -> className` `for -> htmlFor`
4. JSX 支持多行（换行），如果需要换行，需使用 `()` 包裹，防止 bug 出现

### 组件

#### 函数组件

```js
// 定义函数组件
function HelloFn () {
  return <div>这是我的第一个函数组件!</div>
}

// 定义类组件
function App () {
  return (
    <div className="App">
      {/* 渲染函数组件 */}
      <HelloFn />
      <HelloFn></HelloFn>
    </div>
  )
}
export default App
```

```ad-info
title:约定说明

1. 组件的名称 **必须首字母大写**，react 内部会根据这个来判断是组件还是普通的 HTML 标签
2. 函数组件 **必须有返回值**，表示该组件的 UI 结构；如果不需要渲染任何内容，则返回 null
3. 组件就像 HTML 标签一样可以被渲染到页面中。组件表示的是一段结构内容，对于函数组件来说，渲染的内容是函数的 **返回值** 就是对应的内容
4. 使用函数名称作为组件标签名称，可以成对出现也可以自闭合
```

#### 类组件

```js
// 引入React
import React from 'react'

// 定义类组件
class HelloC extends React.Component {
  render () {
    return <div>这是我的第一个类组件!</div>
  }
}

function App () {
  return (
    <div className="App">
      {/* 渲染类组件 */}
      <HelloC />
      <HelloC></HelloC>
    </div>
  )
}
export default App
```

```ad-info
title:约定说明

1. **类名称也必须以大写字母开头**
2. 类组件应该继承 React.Component 父类，从而使用父类中提供的方法或属性 
3. 类组件必须提供 render 方法 **render 方法必须有返回值，表示该组件的 UI 结构**

```

#### 事件绑定

##### 如何绑定事件

  ```js
  // 1.函数组件
  function HelloFn () {
    // 定义事件回调函数
    const clickHandler = () => {
      console.log('事件被触发了')
    }
    return (
      // 绑定事件
      <button onClick={clickHandler}>click me!</button>
    )
  }
  
  // 2.类组件
  class HelloC extends React.Component {
    // 定义事件回调函数
    clickHandler = () => {
      console.log('事件被触发了')
    }
    render () {
      return (
        // 绑定事件
        <button onClick={this.clickHandler}>click me!</button>
      )
    }
  }
  ```

##### 获取事件对象

- 通过事件处理程序的参数获取事件对象 e

  ```js
  // 函数组件
  function HelloFn () {
    // 定义事件回调函数
    const clickHandler = (e) => {
      e.preventDefault()
      console.log('事件被触发了', e)
    }
    return (
      // 绑定事件
      <a href="http://www.baidu.com/" onClick={clickHandler}>百度</a>
    )
  }
  ```

#### 组件状态

![](React.assets/image-20230220111856662.png)

```js
class Counter extends React.Component {
  // 定义数据
  state = {
    count: 0
  }
  // 定义修改数据的方法
  setCount = () => {
    this.setState({
      count: this.state.count + 1
    })
  }
  // 使用数据 并绑定事件
  render () {
    return <button onClick={this.setCount}>{this.state.count}</button>
  }
}
```

#### this 问题说明

![](React.assets/image-20230220111806143.png)

这里我们作为了解内容，随着 js 标准的发展，主流的写法已经变成了 class fields，无需考虑太多 this 问题

#### React 的状态不可变

**概念**：不要直接修改状态的值，而是基于当前状态创建新的状态值

**1. 错误的直接修改**

```js
state = {
  count : 0,
  list: [1,2,3],
  person: {
     name:'jack',
     age:18
  }
}
// 直接修改简单类型Number
this.state.count++
++this.state.count
this.state.count += 1
this.state.count = 1

// 直接修改数组
this.state.list.push(123)
this.state.list.spice(1,1)

// 直接修改对象
this.state.person.name = 'rose'
```

**2. 基于当前状态创建新值**

```js
this.setState({
    count: this.state.count + 1
    list: [...this.state.list, 4],
    person: {
       ...this.state.person,
       // 覆盖原来的属性 就可以达到修改对象中属性的目的
       name: 'rose'
    }
})
```

#### 表单处理

##### 受控表单组件 (推荐)

```ad-note
title:什么是受控组件？ 

input框自己的状态被React组件状态控制。

React 组件的状态的地方是在 state 中，input 表单元素也有自己的状态是在 value 中，React 将 state 与表单元素的值（value）绑定到一起，由 state 的值来控制表单元素的值，从而保证单一数据源特性。
```

**实现步骤**

以获取文本框的值为例，受控组件的使用步骤如下：

1. 在组件的 state 中声明一个组件的状态数据
2. 将状态数据设置为 input 标签元素的 value 属性的值
3. 为 input 添加 change 事件，在事件处理程序中，通过事件对象 e 获取到当前文本框的值（`即用户当前输入的值`）
4. 调用 setState 方法，将文本框的值作为 state 状态的最新值

**代码落地**

```js
import React from 'react'

class InputComponent extends React.Component {
  // 声明组件状态
  state = {
    message: 'this is message',
  }
  // 声明事件回调函数
  changeHandler = (e) => {
    this.setState({ message: e.target.value })
  }
  render () {
    return (
      <div>
        {/* 绑定value 绑定事件*/}
        <input value={this.state.message} onChange={this.changeHandler} />
      </div>
    )
  }
}


function App () {
  return (
    <div className="App">
      <InputComponent />
    </div>
  )
}
export default App
```

##### 非受控表单组件

```ad-note
title:什么是非受控组件？
非受控组件就是通过手动操作 dom 的方式获取文本框的值，文本框的状态不受 react 组件的 state 中的状态控制，直接通过原生 dom 获取输入框的值。
```

**实现步骤**

1. 导入 `createRef` 函数
2. 调用 createRef 函数，创建一个 ref 对象，存储到名为 `msgRef` 的实例属性中
3. 为 input 添加 ref 属性，值为 `msgRef`
4. 在按钮的事件处理程序中，通过 `msgRef.current` 即可拿到 input 对应的 dom 元素，而其中 `msgRef.current.value` 拿到的就是文本框的值

**代码落地**

```js
import React, { createRef } from 'react'

class InputComponent extends React.Component {
  // 使用createRef产生一个存放dom的对象容器
  msgRef = createRef()

  changeHandler = () => {
    console.log(this.msgRef.current.value)
  }

  render() {
    return (
      <div>
        {/* ref绑定 获取真实dom */}
        <input ref={this.msgRef} />
        <button onClick={this.changeHandler}>click</button>
      </div>
    )
  }
}

function App () {
  return (
    <div className="App">
      <InputComponent />
    </div>
  )
}
export default App
```

#### 组件通信

##### 父子组件 -Props/回调

###### 父传子 -Props

```js
import React from 'react'

// 函数式子组件
function FSon(props) {
  console.log(props)
  return (
    <div>
      子组件1
      {props.msg}
    </div>
  )
}

// 类子组件
class CSon extends React.Component {
  render() {
    return (
      <div>
        子组件2
        {this.props.msg}
      </div>
    )
  }
}

// 父组件
class App extends React.Component {
  state = {
    message: 'this is message'
  }
  render() {
    return (
      <div>
        <div>父组件</div>
        <FSon msg={this.state.message} />
        <CSon msg={this.state.message} />
      </div>
    )
  }
}

export default App
```

````ad-info
title:Props
1. props 是只读对象（readonly）
2. props 可以传递任意数据

数字、字符串、布尔值、数组、对象、`函数、JSX`
```js
class App extends React.Component {
  state = {
    message: 'this is message'
  }
  render() {
    return (
      <div>
        <div>父组件</div>
        <FSon 
          msg={this.state.message} 
          age={20} 
          isMan={true} 
          cb={() => { console.log(1) }} 
          child={<span>this is child</span>}
        />
        <CSon msg={this.state.message} />
      </div>
    )
  }
}
```
````

###### 子传父 - 回调

```js
import React from 'react'

// 子组件
function Son(props) {
  function handleClick() {
    // 调用父组件传递过来的回调函数 并注入参数
    props.changeMsg('this is newMessage')
  }
  return (
    <div>
      {props.msg}
      <button onClick={handleClick}>change</button>
    </div>
  )
}


class App extends React.Component {
  state = {
    message: 'this is message'
  }
  // 提供回调函数
  changeMessage = (newMsg) => {
    console.log('子组件传过来的数据:',newMsg)
    this.setState({
      message: newMsg
    })
  }
  render() {
    return (
      <div>
        <div>父组件</div>
        <Son
          msg={this.state.message}
          // 传递给子组件
          changeMsg={this.changeMessage}
        />
      </div>
    )
  }
}

export default App
```

##### 兄弟组件 - 共享父状态 (状态提升)

```js
import React from 'react'

// 子组件A
function SonA(props) {
  return (
    <div>
      SonA
      {props.msg}
    </div>
  )
}
// 子组件B
function SonB(props) {
  return (
    <div>
      SonB
      <button onClick={() => props.changeMsg('new message')}>changeMsg</button>
    </div>
  )
}

// 父组件
class App extends React.Component {
  // 父组件提供状态数据
  state = {
    message: 'this is message'
  }
  // 父组件提供修改数据的方法
  changeMsg = (newMsg) => {
    this.setState({
      message: newMsg
    })
  }

  render() {
    return (
      <>
        {/* 接收数据的组件 */}
        <SonA msg={this.state.message} />
        {/* 修改数据的组件 */}
        <SonB changeMsg={this.changeMsg} />
      </>
    )
  }
}

export default App
```

##### 嵌套组件 -Context

**实现步骤**

1. 创建 Context 对象 导出 Provider 和 Consumer 对象

   ```js
   const { Provider, Consumer } = createContext()
   ```

2. 使用 Provider 包裹根组件提供数据 

   ```js
   <Provider value={this.state.message}>
       {/* 根组件 */}
   </Provider>
   ```

3. 需要用到数据的组件使用 Consumer 包裹获取数据

   ```js
   <Consumer >
       {value => /* 基于 context 值进行渲染*/}
   </Consumer>
   ```

**代码实现**

```js
import React, { createContext }  from 'react'

// 1. 创建Context对象 
const { Provider, Consumer } = createContext()


// 3. 消费数据
function ComC() {
  return (
    <Consumer >
      {value => <div>{value}</div>}
    </Consumer>
  )
}

function ComA() {
  return (
    <ComC/>
  )
}

// 2. 提供数据
class App extends React.Component {
  state = {
    message: 'this is message'
  }
  render() {
    return (
      <Provider value={this.state.message}>
        <div className="app">
          <ComA />
        </div>
      </Provider>
    )
  }
}

export default App
```

##### Children 属性

获取成对标签之间包含的内容。

##### Props 校验 -propTypes

```jsx
import PropTypes from 'prop-types'

// 1.函数组件
// 1.2.1.默认值1(推荐)
// const List = ({ colors=[] }) => {
const List = (props) => {
  const arr = props.colors
  const lis = arr.map((item, index) => <li key={index}>{item.name}</li>)
  return <ul>{lis}</ul>
}
// 1.1.类型
List.propTypes = {
  colors: PropTypes.array
}
// 1.2.2.默认值2
List.defaultProps = {
	colors: []
}

// 2.类组件
class List extends Component {
	// 2.1.类型
	static propTypes = {
		pageSize: PropTypes.number
	}
	// 2.2.默认值
  static defaultProps = {
    pageSize: 10
  }
    
  render() {
    return (
      <div>
        此处展示props的默认值：{this.props.pageSize}
      </div>
    )
  }
}
```

````ad-note
title:规则
1. 常见类型：array、bool、func、number、object、string
2. React 元素类型：element
3. 必填项：isRequired
4. 特定的结构对象：shape({})
```js
// 常见类型
optionalFunc: PropTypes.func,
// 必填 只需要在类型后面串联一个isRequired
requiredFunc: PropTypes.func.isRequired,
// 特定结构的对象
optionalObjectWithShape: PropTypes.shape({
	color: PropTypes.string,
	fontSize: PropTypes.number
})
```
[更多](https://reactjs.org/docs/typechecking-with-proptypes.html)  
````

#### 生命周期 - 类组件

[动态生命周期](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram)  

##### 生命周期 - 挂载阶段

![](React-基础.assets/React-基础_image_17.png)

| 钩子 函数         | 触发时机                                            | 作用                                                         |
| ----------------- | --------------------------------------------------- | ------------------------------------------------------------ |
| constructor       | 创建组件时，最先执行，初始化的时候只执行一次        | 1. 初始化 state  2. 创建 Ref 3. 使用 bind 解决 this 指向问题等 |
| render            | 每次组件渲染都会触发                                | 渲染 UI（**注意： 不能在里面调用 setState()** ）               |
| componentDidMount | 组件挂载（完成 DOM 渲染）后执行，初始化的时候执行一次 | 1. 发送网络请求 2.DOM 操作                                  |

##### 生命周期 - 更新阶段

![](React-基础.assets/React-基础_image_18.png)

| 钩子函数           | 触发时机                  | 作用                                                         |
| ------------------ | ------------------------- | ------------------------------------------------------------ |
| render             | 每次组件渲染都会触发      | 渲染 UI（与 挂载阶段 是同一个 render）                         |
| componentDidUpdate | 组件更新后（DOM 渲染完毕） | DOM 操作，可以获取到更新后的 DOM 内容，**不要直接调用 setState** |

##### 生命周期 - 卸载阶段

| 钩子函数             | 触发时机                 | 作用                               |
| -------------------- | ------------------------ | ---------------------------------- |
|componentWillUnmount|组件卸载（从页面中消失）| 执行清理工作（比如：清理定时器等） |

##### 生命周期 - props 更新

参数：nextProps, nextContext

| 钩子函数             | 触发时机                 | 作用                               |
| -------------------- | ------------------------ | ---------------------------------- |
|componentWillReceiveProps|props 更新|在 props 更新后，render() 渲染前修改 state|

组件初次渲染不会执行，`props` 发生变化时执行。  
通过 `this.props` 访问旧属性。  
可通过 `this.setState()` 更新组件状态，不会引起组件二次渲染。 

**注意**：父组件向子组件传递引用类型的属性时， this.props 和 nextProps 内容一致，同一份引用。

## Hooks(>v16.8)

1. 组件的状态逻辑复用  
2. 2.class 组件自身的问题

```ad-tip
title: Hook规则
1. 只能在最顶层使用  
	- 不要再循环、条件、嵌套函数中使用   

2. 只能再React函数中使用  
	- 在函数组件调用  
	- 在自定义Hook中调用
```

### useState

每次执行相互独立。  

```js
// 初始值只在第一次渲染时生效，之后渲染时执行会自动会去最新值
const [name, setName] = useState('lili');
const [name, setName] = useState(()=>{      
	return '计算之后的初始值';
})
```

````ad-info
title: useState 为什么使用数组

是为了降低使用的复杂度。  
- 数组解构时，对应位置进行赋值，可以直接重命名;  
- 对象解构时，需要与原对象中属性相同，重命名复杂。  

```js
const [value, setValue] = useState(0);

const { state: value, setState: setValue } = useState(0);
```
````

#### useState 和 setState 的执行机制

TODO: 批量更新机制

```ad-tip
setState和useState本身是<font color="##ff0000">同步方法</font>，由于react执行机制造成<font color="##ff0000">“异步”</font>。
```

batchUpdate 机制会在每次方法执行之前设置一个 `isBatchingUpdate` 为 `true`，方法结束之后设置为 `false` 。  
为 `true` 时，命中 batchUpdate 机制，进行“异步更新”； 反之进行同步更新。  

1. 在合成事件、钩子函数或生命周期函数如 useEffect 中（React 控制的事件处理程序）
   - 不会立即更新 state 结果； 
   - 多次执行，只会调用一次 render 重新渲染 ；  
   - 多次执行，setState 会进行 State 合并，useState 不会合并，而是直接覆盖。

2. 原生 DOM 事件和异步函数（`setTimeout`、`Promise.resolve().then` 、网络请求等）中（React 控制之外的）
   - 立即更新 state 结果；  
   - 每次执行 setState 和 useState 都会调用 render 重新渲染。   

对于 state 无法合并执行更新，可以使用 `unstable_batchedUpdates` 手动进行合并更新。

对于 setState 合并只执行最后一次操作的问题，可以使用传入函数的方式来解决。  
`this.setState(preState => ({ count: preState.count + 1 }))`

总结：  
由执行机制看，setState 本身并不是异步的，而是如果在调用 setState 时，如果 react 正处于更新过程，当前更新会被暂存，等上一次更新执行后在执行，这个过程给人一种异步的假象。

在生命周期，根据 JS 的异步机制，会将异步函数先暂存，等所有同步代码执行完毕后在执行，这时上一次更新过程已经执行完毕，isBranchUpdate 被设置为 false，根据上面的流程，这时再调用 setState 即可立即执行更新，拿到更新结果。

React18 对状态批处理进行了优化，在原生 DOM 中也会进行状态批处理（自动批处理），使用 `flushSync` 函数可以退出状态批处理。

```js
import {flushSync} from "react-dom";

  handleClickWithPromise = () => {
    Promise.resolve().then(() => {
      flushSync(()=>{
        this.setState({ a: this.state.a + 1 })
      })
      flushSync(()=>{
        this.setState({ a: this.state.a + 1 })
      })
      this.setState({ a: this.state.a + 1 })
    })
    // setTimeout(() => {
    //   this.setState({ a: this.state.a + 1 })
    //   this.setState({ a: this.state.a + 1 })
    // })
  }
```

[合成事件](React%20原理.md##合成事件)  

#### useState 使用注意

[javascript - react使用hook——useState的坑_个人文章 - SegmentFault 思否](https://segmentfault.com/a/1190000040013137?sort=newest)  

```js
const textObj = {name:'dx'}
const [useState1, setUseState1] = useState(textObj)
const [useState2, setUseState2] = useState(textObj)
```

1. `useState` 存储引用类型时，是存储该值的引用 (浅拷贝)。上述情况在修改时会影响另一个。    

```js
const textObj = {name:'dx'}
const [useState1, setUseState1] = useState(textObj )
const [useState2, setUseState2] = useState(JSON.parse(JSON.stringify(textObj)))
```

可以在通过上述方法（深拷贝）来解决。  
使用上述方法时需要注意：
- 拷贝的对象中如果有函数，undefined，symbol，当使用过 `JSON.stringify()` 进行处理之后，都会消失。
- 无法拷贝不可枚举的属性；
- 无法拷贝对象的原型链；
- 拷贝 Date 引用类型会变成字符串；
- 拷贝 RegExp 引用类型会变成空对象；
- 对象中含有 NaN、Infinity 以及 -Infinity，JSON 序列化的结果会变成 null；
- 无法拷贝对象的循环应用，即对象成环 (`obj[key] = obj`)。

2. `useState` 存储引用类型时，`useEffect` 会检测不到变化。  

```js
setUseState1((oldUseState1) => {
  oldUseState1.age = 18
  return {...oldUseState1}
})
```

可以在更新状态时传入一个函数，返回一个新的对象。  
3. `useState` 获取更新后的值，可以在 `useEffect` 根据依赖值的变化获取更新后的值。  

### useEffect

1. useEffect 中 return 的函数，在下一次 useEffect 执行前执行，则模拟 `DidUpdate` ；
2. useEffect 中 return 的函数，在组件销毁前前执行，则模拟 `WillUnmount` ；（第二参数传入 `[]`）
3. useEffect 中函数体再传入一个 `[]` 时，在组建加载时执行，模拟 `DidMount` ；传入 `[a,b]` 时，再 a、b 发生变化时也会更新，模拟 `DidUpdate` 。  

```ad-warning
useEffect的return中函数是在同一个useEffect再次执行之前调用，和其他useEffect无关。  
即不同的useEffect相互独立。
```

1. 依赖为 `[]`

```js
// 1.依赖为 []
useEffect(() => {
	// 模拟 DidMount
	return () => {
		// 模拟 WillUnmount
	}
}, [])
```

2. 依赖为 `[a,b]` 或没有依赖

```js
useEffect(() => {
	// 第一次：模拟 DidMount
	// 第二次之后：模拟 DidUpdate
	return () => {
		// 模拟 DidUpdate
	}
}, [a, b])
```

[组件生命周期](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)  
![](React.assets/image-20230217175256050.png)

### useLayoutEffect

`useEffect` 渲染完之后异步执行；  
`useLayoutEffect` 在渲染之前同步执行（浏览器 layout 之后，painting 之前执行）。  

**使用 useEffect**  

```js
import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
	const [state, setState] = useState("hello world");
	
	useEffect(() => {
		let i = 0;
		while (i <= 100000000) {
			i++;
		}
		setState("world hello");
	}, []);
	
	return (
		<>
			<div>{state}</div>
		</>
	);
}

export default App;
```

**使用 useLayoutEffect**  

```js
import React, { useState, useLayoutEffect } from "react";
import "./App.css";

function App() {
	const [state, setState] = useState("hello world");
	
	useLayoutEffect(() => {
		let i = 0;
		while (i <= 100000000) {
			i++;
		}
		setState("world hello");
	}, []);
	
	return (
		<>
			<div>{state}</div>
		</>
	);
}

export default App;
```

经过上述代码的测试，  
useEffect 在渲染时会先渲染 hello world 在渲染成 world hello ，所以会产生闪烁；  
useLayoutEffect 在渲染时直接渲染为 world hello ，所以不会闪烁。  
**总结：**  
1.优先使用 `useEffect`，因为它是异步执行的，不会阻塞渲染  
2.会影响到渲染的操作尽量放到 `useLayoutEffect` 中去，避免出现闪烁问题  
3.`useLayoutEffect` 和 `componentDidMount` 是等价的，会同步调用，阻塞渲染  
4.`useLayoutEffect` 在服务端渲染的时候使用会有一个 warning，因为它可能导致首屏实际内容和服务端渲染出来的内容不一致。  

### useRef

```js
import { useEffect, useRef } from 'react'
function App() {  
    const h1Ref = useRef(null)  
    useEffect(() => {    
        console.log(h1Ref)  
    },[])  
    return (    
        <div>      
            <h1 ref={ h1Ref }>this is h1</h1>    
        </div>  
    )
}
export default App
```

函数组件没有实例，可以使用 forwordRef 包裹来将 ref 传递到 DOM 上。  

```js
function App() {
  const testRef = useRef(null)
  const [clientHeight, setClientHeight] = useState(0)
  const onScroll = () => {
    if (testRef?.current) {
      let clientHeight = testRef?.current.clientHeight
      setClientHeight(clientHeight)
    }
  }

  return (
    <div>
      <div>
        <p>可视区域高度：{clientHeight}</p>
      </div>
      <div
        style={{ height: 200, overflowY: 'auto' }}
        ref={testRef}
        onScroll={onScroll}
      >
        <div style={{ height: 2000 }}></div>
      </div>
    </div>
  )
}
```

除了获取对应元素的属性，也可以用于 **缓存数据**。

```js
function App() {
  let initData = {
    name: 'lisa',
    age: '20',
  }
  let refData = useRef(initData) //refData声明后组件再次渲染不会再重新赋初始值
  console.log(refData.current)

  const handleClick = () => {
    refData.current = {
      //修改refData后页面不会重新渲染
      name: 'liyang ',
      age: '18',
    }
    console.log(refData.current)
  }

  return (
    <div>
      <button onClick={handleClick}>修改</button>
    </div>
  )
}
```

总结：
- `useRef` 存储的是组件的基础设施数据；`useState` 存储的是渲染到屏幕上的数据。
- `useRef` 更新是同步的，立即更新；`useState` 更新是异步的，不立即更新。
- `useRef` 更新不会重新渲染组件；`useState` 更新会重新渲染组件。
- `useRef` 存储的数据在渲染之间持久化。
- `useRef` 初始化时为 `undefined`，所以更新值应该在 `useEffect` 或事件处理函数中。

`useRef` vs `createRef`  

|          | useRef              | createRef |
| -------- | ------------------- | --------- |
| 用途     | 函数组件            | 类组件    |
| 存储方式 | 组件对应的 Fiber 节点 | 类实例属性          |

### useImperativeHandle

给 `ref.current` 赋值是个副作用，所以一般在 Did 函数或者事件处理函数里给 `ref.current` 赋值；  
组件在卸载时要清理 `ref.current` 的值。  
本质上 useImperativeHandle 就是在帮我们做这些事情。  
**使用步骤：**  
1.父组件使用 `useRef`(或 `createRef`) 创建一个 ref 对象，将这个 ref 对象赋给子组件的 ref 属性。  
2.子组件使用 forwardRef 包装自己，允许作为函数组件的自己使用 ref。  
3.然后使用 `useImperativeHandle` 钩子函数，在该钩子函数的第二个函数参数中返回一些状态或方法，这个被返回的状态或方法就可以被父组件访问到。  
父组件使用创建的 ref 对象的 current 属性获取子组件暴露出的状态或方法。  

```jsx
import React, { useRef, useImperativeHandle } from 'react';
import ReactDOM from 'react-dom';

const FancyInput = React.forwardRef((props, ref) => {
	const inputRef = useRef();
	// 也接受第三个参数，依赖数组
	// 命令式的给`ref.current`赋值个对象
	useImperativeHandle(ref, () => ({
		focus: () => {
			inputRef.current.focus();
		},
	}));
	return <input ref={inputRef} type="text" />
});

const App = props => {
	const fancyInputRef = useRef();
	return (
		<div>
			<FancyInput ref={fancyInputRef} />
			<button
	        onClick={() => fancyInputRef.current.focus()}>      // 调用子组件的方法
				父组件调用子组件的 focus
			</button>
		</div>
	)
}
ReactDOM.render(<App />, root);
```

函数执行时机与 `useLayoutEffect` 一致。  
只有当实参 ref 有值时，才会执行 createHandle 函数。  
**最佳实践：**  
1.与 forwardRef 一同使用，指定需要暴露的状态或方法，返回给 ref 。  
2.尽量采用声明式的（即让 React 内部处理），避免命令式地给 `ref.current` 赋值。   

[javascript - 最陌生的hooks: useImperativeHandle_个人文章 - SegmentFault 思否](https://segmentfault.com/a/1190000040758640?sort=votes)  

### useContext

```js
import { createContext, useContext } from 'react'
// 创建Context对象
const Context = createContext()

function Foo() {  
    return <div>Foo <Bar/></div>
}

function Bar() {  
    // 底层组件通过useContext函数获取数据  
    const name = useContext(Context)  
    return <div>Bar {name}</div>
}

function App() {  
    return (    
        // 顶层组件通过Provider 提供数据    
        <Context.Provider value={'this is name'}>     
            <div><Foo/></div>    
        </Context.Provider>  
    )
}

export default App
```

### useMemo 和 useCallback

当父组件发生状态变化时，无论有没有对子组件进行操作，子组件都会重新渲染，造成不必要的性能消耗。  
可以使用 `React.memo` 对函数组件进行包裹，它的作用相当于结合了类组件中 `pureComponent` 纯组件和 `componentShouldUpdate` 生命周期的功能，对传入的 props 进行比较，然后根据第二个参数的返回值判断是否更新。  
但它存在一个问题，比较是浅比较，当 props 中包含引用类型时，会出现引用地址改变，内容不变造成组件重新渲染，或者引用地址不变，内容改变却未重新渲染组件。因此出现了 `useMemo` 。  
`useMemo` 与 `React.memo` 理念相同，根据第二个参数数组中的依赖是否发生变化，决定是否执行第一个参数中的回调函数。  
`useCallback` 与 `useMemo` 作用相似，只是前者返回一个函数，后者返回一个值。

**总结：**  
虽然 `useMemo` 与 `useCallback` 可以优化子组件，当 props 没有变化时不会重新渲染；  
但是由于它要进行缓存，不利于页面的首次渲染。所以，需要谨慎使用。

## 高级指引

### 代码分割

#### import()

使用 import() 动态引入，Webpack 会自动进行代码分割。

```js
import { add } from './math';

console.log(add(16, 26));

// import() 动态引入
import("./math").then(math => {
  console.log(math.add(16, 26));
});
```

#### React.lazy()

```js
import OtherComponent from './OtherComponent';

// React.lazy()
// 接受一个函数，函数需要动态调用 import() , 返回一个 promise，resolve一个 default export 的 React 组件
const OtherComponent = React.lazy(() => import('./OtherComponent'));
```

#### 避免兜底

```jsx
function handleTabSelect(tab) {
  startTransition(() => {
    setTab(tab);
  });
}

return (
	<div>
	<Tabs onTabSelect={handleTabSelect} />
		<Suspense fallback={<Glimmer />}>
			{tab === 'photos' ? <Photos /> : <Comments />}
		</Suspense>
	</div>
);
```

`startTransition` 避免 `<Photos />` 切换 `<Comments />` 时，展示 `<Glimmer /> ；` 而是展示旧组件，等待新组件渲染后切换。

#### 异常捕获边界

捕获模块加载失败，方便进行恢复事宜。

```jsx
import React, { Suspense } from 'react';
import MyErrorBoundary from './MyErrorBoundary';

const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

const MyComponent = () => (
  <div>
    <MyErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </MyErrorBoundary>
  </div>
);
```

#### 基于路由的代码分割

```js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Suspense>
  </Router>
);
```

### forceUpdate()

`forceUpdate()` 会导致组件跳过 `shouldComponentUpdate()` ,直接调用 `render()` 。

## React API

### Children

在 React 中，可以通过 props 中的 children 来获取开始与结束标签中的内容，并选择展示的位置等，与 Vue 中的插槽作用类似。Children 是用来处理 children 的工具。
1. **Children.map(children, func)** 针对 children 的每个直接子节点调用 func ，返回一个数组或者 undefined。  
children 有三种情况：  
- 没有节点，为 null 或 undefined，`map()` 返回 null 或 undefined ；
- 有一个节点，直接对节点调用 func ，返回一个数组；
- 有多个节点，遍历并对子节点调用 func ，返回一个数组。

如果 children 为一个 Fragment 对象，视为单一节点处理。  
2. **Children.forEach()** 作用与 **Children.map()** 类似，但是没有返回值。  
3. **Children.count()** 统计子节点组件的数量。  
4. **Children.only()** 判断是否只有一个子节点，是则返回该节点，否则抛出错误。  
5. **Children.toArray()** 将子节点转化为数组，同时添加 key 。  

总结：在 children 的类型无法确定时，无法使用 map() 等方法处理，而 Children 提供的方法即使是 undefined 或 null 也可以正确处理。

### cloneElement 

`cloneElement(element，[props], [...children])` 以 element 为样板克隆返回一个新元素，取代现有元素，并保留原始元素的 key 和 ref 。  
新元素与原始元素的 props 会进行浅合并。  
cloneElement() 几乎等同于 `<element.type {...element.props} {...props}>{children}</element.type>` ，差别在于前者保留了组件的 ref ，会添加到克隆后的新元素上。  
总结：结合 **Children.map()** 方法使用，可以为列表渲染等情况添加新的属性，如是否选中的标记属性。

### forwardRef

适用于：  
- 转发 refs 到 DOM 组件
- 高阶组件中转发 refs

React.forwardRef 的 API 中 ref 必须指向 dom 元素而不是 React 组件。   

```jsx
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
```

## 实践

### [遇到的问题](React%20问题.md)

### [第三方库](React%20第三方库.md)

## [原理解析](React%20原理.md)

## [React Router](React%20Router.md)

## 状态库

### [Redux](Redux.md)

### [Mobx](Mobx.md)

### [Recoil](Recoil.md)

## 开发框架

### [DvaJS](DvaJS.md)

### [UmiJS](UmiJS.md)

## 参考

[生命周期与useEffect](https://blog.csdn.net/weixin_40710480/article/details/116056092)  
[mind-map/React at master · jCodeLife/mind-map · GitHub](https://github.com/jCodeLife/mind-map/tree/master/React)
