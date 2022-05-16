# debounce & throttle

防抖与节流主要应用了闭包和定时器

## debounce

当js一直触发某个函数，且每次触发函数的间隔小于设定阈值，函数防抖只会执行最后一次。

```js
function debounce(fn, delay) {
  // timer是debounce的私有变量
  let timer
  return function () {
    const context = this
    const args = arguments
    // 每次点击清楚上一次记录的定时器id
    if (timer) {
      clearTimeout(timer)
    }
    // 生成新的定时器
    timer = setTimeout(function() {
      fn.apply(context, args)
    }, delay)
  }
}
```

```js
// ========== 使用 ==========
function request() {
  console.log('参数', Array.from(arguments))
}

let debounceHandle = debounce(request, 1000)

function click() {
  debounceHandle('入参')
}
window.onload = () => {
  btn.addEventListener("click", click)
}
```

## throttle

当js一直触发某个函数，且每次触发函数的间隔小于设定阈值，函数节流可以实现每隔设定阈值的时间执行一次函数

```js
function throttle (fn, delay) {
 let lastTime, timer
 return function () {
    const context = this
    const args = arguments
    let currentTime = new Date().getTime()
    if (lastTime && currentTime < lastTime + delay) {
      // 函数触发时，间隔小于设定值，清除定时器，生成新的定时器
      clearTimeout(timer)
      timer = setTimeout(function () {
        lastTime = currentTime
        fn.apply(context, args)
      }, delay)
    } else {
      // 初始化或者函数触发时间隔不小于设定值 直接执行
      lastTime = currentTime
      fn.apply(context, args)
    }
  }
 }
```

```js
function move() {
  console.log('move')
}
let throttleMove = throttle(move, 500)
window.addEventListener('mousemove', throttleMove)
```


