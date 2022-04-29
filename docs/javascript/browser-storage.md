# browser storage
在使用阿里云云效时，发生了内存溢出的问题。对方技术人员反馈清除`indexDB`即可。云效在运行时大量使用了`localStorage`、`indexDB`做持久化缓存。

<img :src="$withBase('/images/js_1.png')" alt="js_1">

## localStorage

### 最大值
测试环境为edge浏览器
- 存储上限为5Mb
```js
// Error=> DOMException: Failed to execute 'setItem' on 'Storage': Setting the value of 'maxStorage' exceeded the quota.
testLocalStorageLimit() {
  let data = ''
  for (let i = 0; i < 1024 * 1024 * 1; i++) {
    data += 'a'
  }
  localStorage.setItem('testMaxLocalStorage', data)
},
```
- 性能。测试连续存取1Mb数据1000次耗时至少需要4s
```js
// testTimeConsume: 4093.830322265625 ms
testLocalStorageTimeConsume() {
  let data = ''
  for (let i = 0; i < 1024 * 1024; i++) {
    data += 'b'
  }
  console.time('testTimeConsume')
  for (let i = 0; i < 1000; i++) {
    localStorage.setItem('testTimeConsume', data)
    localStorage.removeItem('testTimeConsume')
  }
  console.timeEnd('testTimeConsume')
},
```
## indexDB