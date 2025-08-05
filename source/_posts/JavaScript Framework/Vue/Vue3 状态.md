---
title: Vue3 状态
categories:
  - JavaScript Framework
  - Vue
date: 2025-07-16 15:46:00
updated: 2025-07-29 11:00:45
---
# Vue3 状态

## [状态](https://cn.vuejs.org/api/reactivity-core.html#ref)

**ref**  
返回一个响应式对象。通过 `.value` 访问和设置。  
对象类型会通过 `reactive()` 转换为深层次响应对象。  
使用**shallowRef**不进行深层次转换。  
传入对象包含**ref**对象，不会自动解包，需要 `.value` 访问。

**reactive**  
返回一个**深层次递归**的响应式对象。  
代理对象包含**ref**自动解包。  
使用**shallowReactive**不进行深层次转换，也不会对属性是**ref**的进行解包。

**computed**  
传递**函数**，返回包含 `.value` 的只读对象。  
传递包含 `get`， `set` 属性对象，返回包含 `.value` 可读写的对象。

**readonly**  
返回传入对象的深层次只读对象。  
会自动解包。  
浅层只读使用**shallowReadonly**。

**toRef**  
针对对象属性签名，即使源对象属性不存在（prop 可选属性），也会返回一个 ref 对象。  
可用于将 prop 的 ref 传递给组合式函数。  
只有源对象是响应对象，返回的 ref 对象才会触发视图更新。

**toRefs**  
将一个响应式对象转换为一个属性都是 ref 响应引用的普通对象。  
可用于组合式函数的返回，方便解构保持响应性。

## 副作用执行

### [**watchEffect**](https://cn.vuejs.org/api/reactivity-core#watcheffect)  

立即执行回调函数。  
**onCleanup**会在改副作用下一次执行前调用。  
**3.5+** 可使用 **onWatcherCleanup** 替代。
> **onWatcherCleanup** 只能在 **watchEffect** 作用函数或 **watch** 回调函数同步执行期间执行。

```js
watchEffect(async (onCleanup) => {
  const { response, cancel } = doAsyncWork(newId)
  // 如果 `id` 变化，则调用 `cancel`，
  // 如果之前的请求未完成，则取消该请求
  onCleanup(cancel)
  data.value = await response
})
```

**watchPostEffect** 是 watchEffect 的 flush 选项为 post。  
**watchSyncEffect** 是 watchEffect 的 flush 选项为 sync。  

### **watch**

默认懒监听，每次发生变化时执行，初始化不会执行。  
监听源：ref 对象，函数，响应式对象以及组成的数组。  
回调函数同 watchEffect，增加了新旧值参数。

## [TS类型标注](https://cn.vuejs.org/guide/typescript/composition-api#typing-ref)
