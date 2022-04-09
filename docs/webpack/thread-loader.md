# thread-loader

启动该loader需要600ms的开销，建议只用于耗时的操作`babel-lader`等

为了减少启动loader的延迟，可以进行预热

```js
  threadLoader.warmup(
    {
      // the number of spawned workers, defaults to (number of cpus - 1) or
      // fallback to 1 when require('os').cpus() is undefined
      // workers: 4,

      // number of jobs a worker processes in parallel
      // defaults to 20
      workerParallelJobs: 20,

      // additional node.js arguments
      workerNodeArgs: ['--max-old-space-size=1024'],

      // Allow to respawn a dead worker pool
      // respawning slows down the entire compilation
      // and should be set to false for development
      poolRespawn: false,

      // timeout for killing the worker processes when idle
      // defaults to 500 (ms)
      // can be set to Infinity for watching builds to keep workers alive
      poolTimeout: 500,

      // number of jobs the poll distributes to the workers
      // defaults to 200
      // decrease of less efficient but more fair distribution
      poolParallelJobs: 200,
      // name of the pool
      // can be used to create different pools with elsewise identical options
      name: 'my-pool',
    },
    [
      'less-loader',
      'babel-loader',
      'vue-loader',
    ]
  )
```

```js
  use: [
    {
      loader: 'thread-loader',
    },
    {
      loader: 'babel-loader',
    },
  ]
```

时间统计如下表所示

| none          | less-loader | vue-loader | babel-loader| babel-loader+vue-loader | less-loader + babel-loader + vue-loader |
| :------------:|:-----------:|:----------:|:-----------:|:-----------------------:|:-----------------------------------:|
| 31493         | 31922       | 32550      | 32338       | 33555                   | 28358                               |
| 31574         | 32239       | 32778      | 32070       | 32864                   | 32087                               |
| 31358         | 32241       | 32594      | 32325       | 32920                   | 27461                               |
| 32593         | 31453       | 32698      | 32076       | 33126                   | 27334                               |
| 32191         | 31851       | 32892      | 32789       | 33011                   | 32399                               |
| 31305         | 32363       | 32892      | 32664       | 33136                   | 28162                               |

给单个耗时的loader放入进程池提升并不明显。在三个loader都放入进程池后打包速度有一定提升，可能是因为项目体积比较小，待后续项目体积进一步增大后再次尝试。