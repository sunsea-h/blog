---
title: JavaScript 常用场景
categories:
  - JavaScript
date: 2026-01-08 13:49:47
updated: 2026-02-24 15:17:02
---
# JavaScript 常用场景

## 滚动事件捕获阻断

```js
import { useRef, useEffect } from 'react';

/**
 * 自定义Hook：阻止局部滚动容器滚动到边界后触发全局滚动
 * @returns 绑定到滚动容器的ref对象
 */
function usePreventScrollPropagation() {
  // 创建ref用于绑定滚动容器
  const scrollRef = useRef<HTMLDivElement>(null);

  // 定义滚轮事件处理函数
  const handleWheel = (e: WheelEvent) => {
    const target = e.target as HTMLDivElement;
    if (!target) return;

    const { scrollTop, scrollHeight, clientHeight } = target;
    
    // 向下滚动且已到底部（预留1px精度容错）
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
    const isScrollingDown = e.deltaY > 0;
    
    // 向上滚动且已到顶部（预留1px精度容错）
    const isAtTop = scrollTop <= 1;
    const isScrollingUp = e.deltaY < 0;

    // 边界滚动时阻断事件传播
    if ((isAtBottom && isScrollingDown) || (isAtTop && isScrollingUp)) {
      e.preventDefault(); // 阻止默认滚动行为
      e.stopPropagation(); // 阻止事件冒泡
    }
  };

  // 监听和解绑事件
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    // 添加滚轮事件监听（passive: false 才能调用preventDefault）
    container.addEventListener('wheel', handleWheel, { passive: false });

    // 组件卸载时解绑事件，避免内存泄漏
    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  return scrollRef;
}

// ============== 使用示例 ==============
function ScrollLockedComponent() {
  // 使用自定义Hook获取ref
  const scrollRef = usePreventScrollPropagation();

  return (
    <div style={{ 
      minHeight: '2000px', // 让页面有全局滚动
      padding: '20px' 
    }}>
      <h2>React 局部滚动锁死示例</h2>
      {/* 将ref绑定到需要局部滚动的容器 */}
      <div 
        ref={scrollRef}
        style={{
          width: '400px',
          height: '300px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '10px',
          overflow: 'auto', // 开启局部滚动
          scrollbarWidth: 'thin'
        }}
      >
        {Array.from({ length: 30 }).map((_, index) => (
          <p key={index}>测试内容 {index + 1}</p>
        ))}
      </div>
    </div>
  );
}

export default ScrollLockedComponent;
```
