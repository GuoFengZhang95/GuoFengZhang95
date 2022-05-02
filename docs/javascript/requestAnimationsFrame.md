# requestAnimationsFrame
## 含义
告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行
## 使用
当你准备更新动画时你应该调用此方法。这将使浏览器在下一次重绘之前调用你传入给该方法的动画函数(即你的回调函数)。
回调函数执行次数通常是每秒60次，但在大多数遵循W3C建议的浏览器中，回调函数执行次数通常与浏览器屏幕刷新次数相匹配。
## 参数
callback:下一次重绘之前更新动画帧所调用的函数(即上面所说的回调函数)。该回调函数会被传入DOMHighResTimeStamp参数，该参数与performance.now()的返回值相同，它表示requestAnimationFrame() 开始去执行回调函数的时刻。
## 返回值
一个 long 整数，请求 ID ，是回调列表中唯一的标识。可以传这个值给 window.cancelAnimationFrame() 以取消回调函数。
## 兼容性
IE10及以上
## 案例
页面滚动、返回顶部
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>window.requestAnimationsFrame</title>
  <style>
    * {
      padding: 0;
      margin: 0;
    }
    .container {
      margin: 0 auto;
      width: 1200px;
      height: 2000px;
      background-color: #cecece;
    }
    .back-to-top {
      margin-left: 600px;
      width: 100px;
      height: 100px;
      position: fixed;
      left: 50%;
      bottom: 100px;
      background-color: rgba(0, 0, 0, 0.1);
      opacity: 0;
    }
    .section {
      width: 100%;
      height: 600px;
    }
    .section.one {
      background-color: red;
    }
    .section.two {
      background-color: green;
    }
    .section.three {
      background-color: blue;
    }
    .section.four {
      background-color: violet;
    }
    .elevator {
      margin-left: 650px;
      width: 50px;
      height: 100px;
      position: fixed;
      left: 50%;
      top: 200px;
    }
    .elevator .item {
      height: 25px;
      line-height: 25px;
      border: 1px solid black;
      margin-top: -1px;
      cursor: pointer;
    }
    .item.one {
      color: red;
    }
    .item.two {
      color: green;
    }
    .item.three {
      color: blue;
    }
    .item.four {
      color: violet;
    }
  </style>
</head>
<body id="body">
  <div id="app">
    <div class="container">
      <div class="section one" :class="item" :id="item" v-for="item in list"></div>
    </div>
    <div id="back-to-top" class="back-to-top" v-on:click="goBackToTop">返回首页</div>
    <div class="elevator">
      <div class="item" :class="item" @click="jump" :data-id="item" v-for="item in list">{{item}}</div>
    </div>
  </div>
</body>
<script src="./index.js" type="text/javascript"></script>
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js" type="text/javascript"></script>
<script type="text/javascript">
  var app = new Vue({
    el: '#app',
    data: {
      message: 'Hello word!',
      showBack: false,
      list:['one', 'two', 'three', 'four'],
    },
    methods: {
      goBackToTop(e) {
        // document.documentElement.scrollTop = 0
        myScrollTo('body', 0, 13)
      },
      jump(e) {
        var id = e.target.dataset.id
        myScrollTo(id,100, 20)
      },
    },
  })

  window.onscroll = function(e) {
    var scrollTop = document.documentElement.scrollTop
    if (scrollTop > 600) {
      if (!app.showBack) {
        app.showBack = true
        fadeIn('back-to-top')
      }
    } else {
      if (app.showBack) {
        app.showBack = false
        fadeOut('back-to-top')
      }
    }
  }
</script>
</html>
```

```js
// index.js
/**
 * 页面滚动
 * @param {*} id 目标元素id
 * @param {*} top 目标元素终点位置距离可视区域的高度
 * @param {*} step  步长
 */
function myScrollTo(id, top, step) {
  let pageDom = document.documentElement//htmlDom
  let targetDom = document.getElementById(id)//目标元素
  let currentDistance = targetDom.getBoundingClientRect().top - top//需要移动的距离 大于0 scrollTop增加，页面向上滚动；小于0 scrollTop减少，页面向下滚动
  let nextDistance // 下一帧后要移动的距离
  let dir = currentDistance > 0 ? 1 : -1
  move()
  function move(timestamp) {
    if (Math.abs(currentDistance) < step) {
      pageDom.scrollTop += currentDistance
      currentDistance = 0
    } else {
      pageDom.scrollTop = pageDom.scrollTop + step * dir
      currentDistance -= step * dir
    }
    nextDistance = targetDom.getBoundingClientRect().top - top
    if (currentDistance === nextDistance && currentDistance !== 0) {
      requestAnimationFrame(move)
    }
  }
}

/**
 * fade-in
 * @param {*} id 目标元素id
 */
function fadeIn(id) {
  let targetDom = document.getElementById(id)//目标元素
  let opacity = 0
  step()
  function step(timestamp) {
    opacity = Math.min(opacity + 0.04, 1)
    if (opacity <= 1) {
      targetDom.style.opacity = opacity
      requestAnimationFrame(step)
    }
  }
}
/**
 * fade-out
 * @param {*} id 目标元素id
 */
function fadeOut(id) {
  let targetDom = document.getElementById(id)//目标元素
  let opacity = 1
  step()
  function step(timestamp) {
    opacity = Math.max(opacity - 0.04, 0)
    if (opacity >= 0) {
      targetDom.style.opacity = opacity
      requestAnimationFrame(step)
    }
  }
}
```


