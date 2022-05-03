# 微信小程序

## 生成小程序码
### 注意事项
小程序码中的参数放在scene字段中，参数长度有限制，所以尽可能使用更短的字符（例如不管是否是加密id都使用id）

### 方法与步骤
小程序码可以在服务端生成，也可以在前端生成。（强烈建议后期项目使用后端生成小程序码，方便快捷）

本文档介绍前端生成小程序的步骤和方法

1. 开通云开发
2. 在根目录下创建云函数文件夹 `cloudFunctions`
3. 在根目录的`project.config.json`文件中，配置云函数文件夹
```json
"cloudfunctionRoot": "cloudFunctions/"
```
4. 右键云函数文件夹，选择新建node.js云函数，设置文件夹名称 `getUnlimitedCode`，新建完成后，开发工具会自动上传函数到云端
5. 在 `getUnlimitedCode` 文件夹的 `config.json`文件中配置 `wxacode.getUnlimited `API 的权限
```json
"permissions": {
  "openapi": [
    "wxacode.getUnlimited"
  ]
}
```
6. 在云函数 getUnlimitedCode 的入口文件 index.js中配置如下代码
<a href="https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/qr-code/wxacode.getUnlimited.html#method-cloud">官方参考文档</a>
```js
const cloud = require('wx-server-sdk')
  cloud.init()
  exports.main = async (event, context) => {
    try {
      const result = await cloud.openapi.wxacode.getUnlimited({
        scene: event.scene,
        page:event.page,
        width:event.width
      })
      return result
    } catch (err) {
      return err
    }
  }
```

7. 在云函数根目录下安装 `wx-server-sdk` 的依赖
```
npm install --save wx-server-sdk@latest
```
8. 右键云函数文件夹选择 创建并部署：所有文件
9. 在小程序端初始化
```js
// evn环境变量是在开通云开发时指定的
onLaunch() {
  wx.cloud.init({
    traceUser: true,
    env: 'yiqimm-82qvw'
  })
}
```
10. 在需要生成小程序的页面进行调用
```js
wx.cloud.callFunction({
  name: 'getUnlimitedCode',
  data: {
    page: '',
    width: 430,
    scene: 123
  }
}).then(res => { })
```
## 开发总结

### 业务开发

### 友盟埋点统计
- 手机端非正式环境需要开启调试模式才能出发友盟埋点（待再次确认）

### 新增页面默认不设置分享函数
- 页面一但分享出去，将会长期存在于微信对话中，后期如果页面有变动需要考虑兼容

### 如果一个页面既可以从分享进入也可以从内部页面进入
- 需要优先使用页面的options中的参数判断。因为如果不更改进入方式的话，当前周期中的场景值不会更新
- 离开这个页面的时候需要考虑销毁这个页面，因为如果在从消息卡片中进入的话，不会触发页面onLoad事件（如果初始化事件卸载onShow中不受影响）

### 组件注册页面
在properTies中可以接收页面url传递的参数或者在onLoad之后在this.options中获取

### 微信文档

#### web-view
跳转到承载这个web-view的页面之后，如果当前小程序的页面栈中没有除了tabBar页面以外的页面，这个时候页面顶部的导航栏没有返回按钮

#### 自定义tabBar
自定义tabBar是Component()构造，但是仍然可以使用Page()中的一些函数
- onPageScroll
- onReachBottom
- onPullDownRefresh
- onShareAppMessage
- onShareTimeline 
- onAddToFavorites 收藏

#### 模块引入路径的问题
- image template wxs 等均可以使用绝对路径引入资源，/指向当前小程序的更目录，该根目录可以在项目配置文件project.config.json中指定。
<img :src="$withBase('/images/wx_001.png')" alt="wx_001">
<img :src="$withBase('/images/wx_002.png')" alt="wx_002">
- import 不支持根路径和别名引入

#### image组件
`show-menu-by-longpress`

图片组件新增api可以支持长按图片识别小程序码

<img :src="$withBase('/images/wx_003.png')" alt="wx_003">

#### 冷启动&热启动
`wx.getLaunchOptionsSync()`
获取小程序启动时的参数。与 `App.onLaunch` 的回调参数一致。
`wx.getEnterOptionsSync()`
获取本次小程序启动时的参数。如果当前是冷启动，则返回值与 App.onLaunch 的回调参数一致；如果当前是热启动，则返回值与 App.onShow 一致。
>注意事项（应用场景）
当把小分享到单人会话或者群聊时，如果要获取分享的参数那么建议用热启动的方法获取参数，保证获取到的参数是最新的

<img :src="$withBase('/images/wx_004.png')" alt="wx_004">

#### 授权
1. `wx.getSetting`

获取用户的当前设置。返回值中只会出现小程序已经向用户请求过的权限
<img :src="$withBase('/images/wx_005.png')" alt="wx_005">

2. `wx.authorize`
提前向用户发起授权请求。调用后会立刻弹窗询问用户是否同意授权小程序使用某项功能或获取用户的某些数据，但不会实际调用对应接口。如果用户之前已经同意授权，则不会出现弹窗，直接返回成功。更多用法详见 

3. `wx.openSetting`
- 调起客户端小程序设置界面，返回用户设置的操作结果。设置界面只会出现小程序已经向用户请求过的权限。
<img :src="$withBase('/images/wx_006.png')" alt="wx_006">

- 用户发生点击行为后，才可以跳转打开设置页，管理授权信息
使用 `button` 组件来使用此功能

<button open-type="openSetting" bindopensetting="callback">打开设置页</button>
由点击行为触发wx.openSetting接口的调用
<button bindtap="openSetting">打开设置页</button> 

#### setData
`Page.prototype.setData(Object data, Function callback)`
`setData` 函数用于将数据从逻辑层发送到视图层（异步），同时改变对应的 `this.data`的值（同步）。
>参数说明
<img :src="$withBase('/images/wx_007.png')" alt="wx_007">
>注意：
1. 直接修改 this.data 而不调用 this.setData 是无法改变页面的状态的，还会造成数据不一致。
2. 仅支持设置可 JSON 化的数据。
3. 单次设置的数据不能超过1024kB，请尽量避免一次设置过多的数据。
4. 请不要把 data 中任何一项的 value 设为 undefined ，否则这一项将不被设置并可能遗留一些潜在问题。

#### wxs

- WXS（WeiXin Script）是小程序的一套脚本语言，结合 WXML，可以构建出页面的结构。
- WXS 与 JavaScript 是不同的语言，有自己的语法，并不和 JavaScript 一致。
>主要应用场景
- 过滤器
<img :src="$withBase('/images/wx_008.png')" alt="wx_008">
<img :src="$withBase('/images/wx_009.png')" alt="wx_009">

- 动画（响应式事件）

相对复杂，可以参考官方文档底部的代码片段(滑动变色以及滑动吸顶等)

#### 场景值
场景值用来描述用户进入小程序的路径。例如：扫码进入；单人会话进入；微信搜索进入等。完整场景值的含义请查看<a href="https://developers.weixin.qq.com/miniprogram/dev/reference/scene-list.html">场景值列表</a>。

由于Android系统限制，目前还无法获取到按 Home 键退出到桌面，然后从桌面再次进小程序的场景值，对于这种情况，会保留上一次的场景值。
>获取场景值
开发者可以通过下列方式获取场景值：
- `App` 的 `onLaunch` 和 `onShow`
- `wx.getLaunchOptionsSync`` wx.getEnterOptionsSync`
部分场景值下还可以获取来源应用、公众号或小程序的appId。获取方式请参考对应API的参考文档。

#### 骨架屏
按照文档操作即可

#### 注意事项
对于页面中有自定义组件，但是不想让这个自定义组件参与生成骨架屏（比如仪器买卖中的<navigation></navigation>），需要使用骨架屏中的 hide属性，并参考下图设置

#### 更改小程序页面路径
1. 谨慎更改，最好不改。保留原页面，在原页面导向新页面
2. 变动可能会带来的问题
- 历史分享卡片无法进入新的页面
- 广告位路径
- 小程序广告组件组件（重新生成广告可能会非常麻烦，需要特别注意）

#### 云开发
禁止使用云开发存储静态资源，很容易超流量，需要收费

使用云开发中的图片路径时u，不要使用带标识符的地址

https://7969-yiqimm-82qvw-1301404338.tcb.qcloud.la/images/addbrand-baoguandan-example.png?sign=9ba2918451dc35c1a4148d18bbca92f8&t=1619661247

应该使用

https://7969-yiqimm-82qvw-1301404338.tcb.qcloud.la/images/addbrand-baoguandan-example.png

这样当图片被误删后，重新上传同名同类型的文件即可

#### 分包功能
分包功能目前在PC可能有问题。无法从直接从tabBar页面进入分包页面
已解决：在正式环境中，PC端分包没有问题。

### BUG
- wxs中使用selectComponent，无法获取到使用了虚拟接点的自定义组件，微信官方暂未修复
- 高分屏电脑调整分辨率后（不等于100%的时候），时间组件会不准确（选中的和实际展示的不一致），微信官方高分屏适应问题，微信官方暂未修复
- IOS系统input设置maxlength时，输入到最后如果输入汉字的拼音长度超过限制会直接中断输入,属于bug，微信官方暂未修复
- camera 组件会默认申请微信的相机权限，在js中使用wx.authorize的话会重复弹窗，可先wx:if隐藏camera组件
- 小程序退后台网络请求报错

### CSS
- absolute 参照 sticky定位 在PC端可能有问题
- env(safe-area-inset-bottom)，不能用于PC端小程序，会导致css计算失效
- background: -webkit-linear-gradient(white, transparent);在IOS表现有问题，暂不知原因。建议不使用或者使用图片代替（已经修复）
- scroll-view 中 多行文本超出显示省略号失效，需要设置：
```css
white-space:normal;
```
- scroll-view中使用scroll-x，如要要使用flex布局的话需要设置：
```css
display: flex;
white-space: nowrap;
```
- scroll-view 外层设置fixed属性时，设置fixed属性的元素需要宽度100%，否则无法滑动
- 图片命名不能出现 # 和 空格
- Andriod page中最底部的元素设置margin-bottom有效，ios端无效
- ios中，手动设置input/area focus 失效，可以给输入框设置wx:if="{{isFocus}}"处理
- IOS低版本，子组件设置sticky属性时，必需设置`virtualHost：true`

### <a href="https://developers.weixin.qq.com/community/develop/doc/00040e5a0846706e893dcc24256009">代码优化</a>

