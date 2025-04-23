---
title: Node.js性能监控
categories:
  - NodeJS
date: 2025-04-10 14:55:31
updated: 2025-04-11 18:08:42
---
# Node.js 性能监控

[systeminformation](https://www.npmjs.com/package/systeminformation)

## CPU 使用率

CPU 使用率 = (总时间 - 空闲时间) / 总时间 * 100%  
`os.cpus()`  
 - model，CPU 型号
 - speed，CPU 频率
 - times
	 - user，在用户态下执行的时间（如应用程序代码等）
	 - nice，在低优先级用户态下运行的时间（nice 越大，优先级越低，如系统维护等）
	 - sys，内核态下运行的时间（执行系统核心和系统调用，如 I/O 访问，硬件访问，网络通信等）
	 - idle，空闲状态的时间
	 - irq，CPU 处理硬件中断请求的时间（网卡，硬盘发出请求等）  

**计算 CPU 使用率**

```js
const os = require("os");

// 获取 CPU 使用率的函数
function getCpuUsage() {
  return new Promise((resolve, reject) => {
    const startCpuInfo = os.cpus(); // 获取初始的 CPU 信息

    setTimeout(() => {
      const endCpuInfo = os.cpus(); // 获取采样后的 CPU 信息

      // 计算各个核心的使用率
      const cpuUsage = endCpuInfo.map((endCore, index) => {
        const startCore = startCpuInfo[index];

        // 计算起始和结束的时间差
        const startTotal = Object.values(startCore.times).reduce(
          (a, b) => a + b,
          0
        );
        const endTotal = Object.values(endCore.times).reduce(
          (a, b) => a + b,
          0
        );

        const idleDiff = endCore.times.idle - startCore.times.idle;
        const totalDiff = endTotal - startTotal;

        const usage = (1 - idleDiff / totalDiff) * 100;
        return {
          core: index,
          usage: usage.toFixed(2), // 保留两位小数
        };
      });

      resolve(cpuUsage);
    }, 100); // 延迟 100ms
  });
}

// 调用获取 CPU 使用率的函数
getCpuUsage()
  .then((cpuUsage) => {
    console.log("CPU 使用率:");
    cpuUsage.forEach((core) => {
      console.log(`核心 ${core.core} 使用率: ${core.usage}%`);
    });
  })
  .catch((err) => {
    console.error("获取 CPU 使用率失败:", err);
  });
```

## CPU 负载 (load)

`os.loadavg()`，返回 1 分钟，5 分钟，15 分钟内平均负载。  
平均负载是 Unix 特有概念，Windows 没有平均负载，一直为 `[0, 0, 0]`。  
CPU 中任务队列的长度，即等待中的任务数量。

```ad-note
title:CPU使用率和CPU负载的区别

CPU使用率高，负载低，表示CPU正常工作；

CPU使用率低，负载高，表示CPU可能被阻塞了。
```

## 内存

V8 内存分类：
- 堆内存
- 栈内存
- 本机内存  

`process.memoryUsage()`
- rss，常驻内存大小（堆内存，栈内存，本机内存）
- heapTotal，堆内存总量
- heapUsed，堆内存使用量
- external，外部内存使用情况（Buffer 使用内存）

## 磁盘

1.Linux 获取磁盘信息

```js
const { exec } = require("child_process");

function getDiskSpaceLinux() {
  exec("df -h /", (error, stdout, stderr) => {
    if (error) {
      console.error(`执行出错: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`标准错误输出: ${stderr}`);
      return;
    }

    // 解析 df 命令输出
    const lines = stdout.trim().split("\n");
    const diskInfo = lines[1].split(/\s+/);

    console.log("磁盘空间使用情况:");
    console.log(`总空间: ${diskInfo[1]}`);
    console.log(`已用空间: ${diskInfo[2]}`);
    console.log(`可用空间: ${diskInfo[3]}`);
    console.log(`使用率: ${diskInfo[4]}`);
  });
}

getDiskSpaceLinux();
```

2.Windows 获取磁盘信息

```js
const { exec } = require("child_process");

function getDiskSpaceWindows() {
  exec(
    "wmic logicaldisk get size,freespace,caption",
    (error, stdout, stderr) => {
      if (error) {
        console.error(`执行出错: ${error.message}`);
        return;
      }

      if (stderr) {
        console.error(`标准错误输出: ${stderr}`);
        return;
      }

      // 解析 wmic 命令输出
      const lines = stdout.trim().split("\n");
      lines.slice(1).forEach((line) => {
        const [drive, free, total] = line.trim().split(/\s+/);
        if (drive) {
          const used = total - free;
          const usage = ((used / total) * 100).toFixed(2);

          console.log(`磁盘分区: ${drive}`);
          console.log(`总空间: ${(total / 1024 / 1024 / 1024).toFixed(2)} GB`);
          console.log(`已用空间: ${(used / 1024 / 1024 / 1024).toFixed(2)} GB`);
          console.log(`可用空间: ${(free / 1024 / 1024 / 1024).toFixed(2)} GB`);
          console.log(`使用率: ${usage}%`);
          console.log("---");
        }
      });
    }
  );
}

getDiskSpaceWindows();
```

## I/O

包括磁盘读写和网络传输。

## 吞吐量 （Throughput）

## 每秒查询率 QPS（Query Per Second）

## 日志监控/真实 QPS

## 响应时间

## 进程监控
