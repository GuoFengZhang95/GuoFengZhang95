# optimization
optimization 是webpack中非常重要的一个属性。通常情况下webpack的默认配置不能适用所有的项目。我们需要了解该配置下的一些重要属性，针对不同项目做出优化

## chunkIds（moduleIds）
根据官方文档可知，推荐使用下述两值
- 开发模式下默认使用 `named`便于调试
<img :src="$withBase('/images/webpack_config_chunkIds_1.png')" alt="webpack_config_chunkIds">

- 生产模式下默认使用`deterministic`利于缓存
<img :src="$withBase('/images/webpack_config_chunkIds_2.png')" alt="webpack_config_chunkIds">

## concatenateModules
让webpack找到模块之间的依赖联系，把模块合并的同一个函数中，缩小代码体积

函数关系如下

<img :src="$withBase('/images/concatenateModules.png')" alt="concatenateModules">

开启`concatenateModules`

<img :src="$withBase('/images/concatenateModules_true.png')" alt="concatenateModules">

关闭`concatenateModules`

<img :src="$withBase('/images/concatenateModules_false.png')" alt="concatenateModules">

## removeAvailableModules
改配置会降低webpack性能，在后续正式版本会默认关闭
## runtimeChunk
把运行时的代码提取出来生成一个公共的文件。但是任何一个运行时改动都会导致这个共文件hash闭环，导致缓存失效，所以建议关闭
## sideEffects
待定
## splitChunks
（cacheGroups可以拿lodash实例）