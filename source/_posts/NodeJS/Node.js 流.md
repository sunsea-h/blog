---
title: Node.js 流
categories:
  - NodeJS
date: 2025-03-18 17:17:07
updated: 2025-03-27 17:44:00
---
# Node.js 流

## 自定义 Readable 流

```js
const stream = require('stream');
const fs = require('fs');
const util = require('util');

class JSONLineReader extends stream.Readable {
  constructor(source) {
    super();
    this._source = source;
    this._foundLineEnd = false;
    this._buffer = '';

    source.on('readable', () => {
      this.read();
    });
  }

  // 所有定制 stream.Readable 类都需要实现 _read 方法
  _read(size) {
    let chunk;
    let line;
    let result;

    if (this._buffer.length === 0) {
	    // size 读取的字节数，默认尽可能多的读取
      chunk = this._source.read();
      if (chunk === null) {
        // 如果没有更多数据可读，检查 buffer 中是否还有剩余内容
        if (this._buffer) {
          try {
            result = JSON.parse(this._buffer);
            this.emit('object', result);
            this.push(util.inspect(result));
          } catch (error) {
            // 处理解析错误
            console.error('Error parsing JSON:', error);
          }
          this._buffer = '';
        }
        this.push(null); // 结束流
        return;
      }
      this._buffer += chunk;
    }

    const lineIndex = this._buffer.indexOf('\n');

    if (lineIndex !== -1) {
      line = this._buffer.slice(0, lineIndex); // 从 buffer 的开始截取第一行来获取一些文本进行解析
      if (line) {
        result = JSON.parse(line);
        this._buffer = this._buffer.slice(lineIndex + 1);
        this.emit('object', result); // 当一个 JSON 记录解析出来的时候，触发一个 object 事件
        this.push(util.inspect(result)); // 将解析好的 JSON 发回内部队列
      } else {
        this._buffer = this._buffer.slice(1);
      }
    } else {
      // 如果没有找到换行符，尝试读取更多数据
      chunk = this._source.read();
      if (chunk) {
        this._buffer += chunk;
        this._read(size); // 递归调用 _read 方法继续处理
      } else {
        // 如果没有更多数据可读，处理 buffer 中剩余的内容
        if (this._buffer) {
          try {
            result = JSON.parse(this._buffer);
            this.emit('object', result);
            this.push(util.inspect(result));
          } catch (error) {
            // 处理解析错误
            console.error('Error parsing JSON:', error);
          }
          this._buffer = '';
        }
        this.push(null); // 结束流
      }
    }
  }
}

const input = fs.createReadStream(`${__dirname}/json-lines.txt`, {
  encoding: 'utf8',
});
const jsonLineReader = new JSONLineReader(input); // 创建一个 JSONLineReader 实例，传递一个文件流给它处理

jsonLineReader.on('object', (obj) => {
  console.log('pos:', obj.position, '- letter:', obj.letter);
});
```
