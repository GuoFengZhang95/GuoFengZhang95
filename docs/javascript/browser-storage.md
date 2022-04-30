# browser storage
在使用阿里云云效时，发生了内存溢出的问题。对方技术人员反馈清除`indexDB`即可。云效在运行时大量使用了`localStorage`、`indexDB`做持久化缓存。

<img :src="$withBase('/images/js_1.png')" alt="js_1">

## localStorage

### 最大值
测试环境为edge浏览器
- 存储上限：5Mb
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
- 存取是同步操作，影响主页面渲染。
```js
// testLocalStorageTimeConsume: 311.553955078125 ms
testLocalStorageTimeConsume() {
  console.time('testLocalStorageTimeConsume')
  for (let i = 0; i < 10000 * 5; i++) {
    let data = {id: i, name: '张国峰', age: 18}
    localStorage.setItem(`testLocalStorageTimeConsume-${i}`, JSON.stringify(data))
  }
  console.timeEnd('testLocalStorageTimeConsume')
},
```
## indexDB
### 特点
1. 非关系型数据库(NoSql)。我们都知道MySQL等数据库都是关系型数据库，它们的主要特点就是数据都以一张二维表的形式存储，而Indexed DB是非关系型数据库，主要以键值对的形式存储数据。
2. 持久化存储。cookie、localStorage、sessionStorage等方式存储的数据当我们清楚浏览器缓存后，这些数据都会被清除掉的，而使用IndexedDB存储的数据则不会，除非手动删除该数据库。
3. 异步操作。IndexedDB操作时不会锁死浏览器，用户依然可以进行其他的操作，这与localstorage形成鲜明的对比，后者是同步的。
4. 支持事务。IndexedDB支持事务(transaction)，这意味着一系列的操作步骤之中，只要有一步失败了，整个事务都会取消，数据库回滚的事务发生之前的状态，这和MySQL等数据库的事务类似。
5. 同源策略。IndexedDB同样存在同源限制，每个数据库对应创建它的域名。网页只能访问自身域名下的数据库，而不能访问跨域的数据库。
6. 存储容量大。全局限制为可用磁盘空间的50％。

```js
// testIndexDBTimeConsume 978.656005859375 ms
indexedDBInit() {
  let db = null
  const IDBRequest = window.indexedDB.open('SchoolDb', 1)
  IDBRequest.onerror = function (e) {
    console.log('onerror', e)
  }
  IDBRequest.onsuccess = function (e) {
    db = IDBRequest.result
    console.log('success', db)
    // 插入数据
    console.time('testIndexDBTimeConsume')
    let trans = db.transaction('student', 'readwrite').objectStore('student')
    for (let i = 0; i < 10000 * 5; i++) {
      trans.add({id: i, name: '张国峰', age: 18})
    }
    console.timeEnd('testIndexDBTimeConsume')
    trans.onsuccess = function(e) {
      console.log('trans.onsuccess', e)
    }
    trans.onerror = function(e) {
      console.log('trans.onerror', e)
    }
  }
  IDBRequest.onupgradeneeded = function (e) {
    db = IDBRequest.result
    console.log('onupgradeneeded', db)
    const objectStore = db.createObjectStore('student', {
      keyPath: 'id',
    })
    // 创建索引
    objectStore.createIndex('id', 'id', { unique: true })
    objectStore.createIndex('name', 'name', { unique: false })
    objectStore.createIndex('age', 'age', { unique: false })
  }
},
```

<img :src="$withBase('/images/js_2.png')" alt="js_2">

### 相关文档
- <a href="https://www.ruanyifeng.com/blog/2018/07/indexeddb.html">阮一峰浏览器数据库 IndexedDB 入门教程</a>
- <a href="https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API">MDN-IndexedDB</a>

