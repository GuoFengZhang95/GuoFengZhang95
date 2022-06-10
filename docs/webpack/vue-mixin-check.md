# vue-mixin-check
```js
const VUE_MIXIN_CHECK = 'VueMixinCheck'
const Fs = require('fs')
const Path = require('path')
const babelParser = require('@babel/parser')
const babelTraverse = require('@babel/traverse').default
// import { parse as vueParser } from '@vue/compiler-dom'
import { parse as vueParser } from '@vue/compiler-sfc'

function isVue(path) {
  return path && path.indexOf('node_modules') === -1 && path.indexOf('src') !== -1 && /(\.vue)$/.test(path)
}
class VueMixinCheck {
  constructor(options = {}) {
    this.name = VUE_MIXIN_CHECK
    this.checkKeys = ['data', 'computed']
    this.mixinPath = options.mixinPath
    this.excludeFileNames = options.excludeFileNames
    this.mixinPropertiesArray = []
    this.vuePropertiesArray = []
  }
  apply(compiler) {
    this.mixinPropertiesArray = this.getAllMixins()
    // console.log('this.mixinPropertiesArray', this.mixinPropertiesArray)
    compiler.hooks.compilation.tap(this.name, (compilation) => {
      compilation.hooks.succeedModule.tap(this.name, module => {
        // console.log('compilation succeedModule')
        if (isVue(module.resource)) {
          // console.log(module.resource)
          const vuePropertiesInfo = this.formatVueScript(module.resource)
          this.vuePropertiesArray.push(vuePropertiesInfo)
        }
      })
      compilation.hooks.finishModules.tap(this.name, modules => {
        // console.log('this.mixinPropertiesArray', this.mixinPropertiesArray, '\n')
        // console.log('this.vuePropertiesArray', this.vuePropertiesArray)
        const warnings = []
        this.vuePropertiesArray.forEach(vuePropertiesItem => {
          // console.log('item', vuePropertiesItem)
          const { vueMixinNames, vuePropertiesInfo, filePath } = vuePropertiesItem
          // 比较当前vue文件和引入mixin文件的对应属性是否有重复
          let dataKeys = [...vuePropertiesInfo.data]
          let computedKeys = [...vuePropertiesInfo.computed]
          vueMixinNames.forEach(vueMixinNamesItem => {
            const mixinProperties = this.mixinPropertiesArray.find(mixinPropertiesItem => mixinPropertiesItem.mixinName === vueMixinNamesItem)?.mixinProperties
            if(mixinProperties) {
              // console.log('mixinProperties', mixinProperties)
              dataKeys = [...dataKeys, ...mixinProperties.data,]
              computedKeys = [...computedKeys, ...mixinProperties.computed,]
            }
          })
          const duplicateKeys = [...this.findDuplicate(dataKeys), ...this.findDuplicate(computedKeys)]
          if (duplicateKeys.length) {
            warnings.push({
              filePath,
              warnings: duplicateKeys
            })
          }
        })
        // console.log('warnings', warnings)
        compilation.warnings.push(JSON.stringify(warnings))
        // compilation.errors.push(JSON.stringify(warnings))
      })
    })
  }
  /**
   * @description 获取指定文件夹下所有mixin的相关信息
   * @returns {[{ filePath:string,mixinName:string,mixinProperties:[{data:string[],computed:string[]}] }]}
   */
  getAllMixins() {
    const mixins = Fs.readdirSync(this.mixinPath).filter(fileName => {
      if (this.excludeFileNames.some(item => fileName.indexOf(item) === -1)) {
        return fileName
      }
    }).map(item => {
      const filePath = Path.resolve(this.mixinPath, item)
      const { mixinProperties, mixinName } = this.getMixinPropertiesByAst(this.getFileAst(filePath))
      return {
        filePath,
        mixinName,
        mixinProperties,
      }
    })
    return mixins
  }
  /**
 * @description 
 * 1. 获取vue-script中使用的mixin
 * 2. 获取vue-script中需要监测的key的value
 * @param {string} path 
 * @returns {{filePath:string,vueMixinNames:string[],vuePropertiesInfo:{data:string[],computed:string[]}}}
 */
  formatVueScript(filePath) {
    // 1、读取代码文本
    const vueCode = Fs.readFileSync(filePath, 'utf-8')
    // const jsCode = vueParser(vueCode).children.find(item => item.tag === 'script').children[0].content
    const jsCode = vueParser(vueCode).descriptor.script.content
    // console.log(jsCode)
    // 2、生成AST
    const ast = babelParser.parse(jsCode, { sourceType: 'module', sourceFilename: true, plugins: ['jsx'] })
    let vueMixinNames = []
    // vue文件内需要检测的所有的key的value
    const vuePropertiesInfo = {
      data: [],
      computed: [],
    }
    babelTraverse(ast, {
      enter(path) {
        if (path.isProperty() && !path.isMethod() && path.node.key.name === 'mixins') {
          vueMixinNames = path.get('value.elements').map(item => {
            let mixinName = ''
            if (item.node.type === 'CallExpression') {
              mixinName = item.node.callee.name
            } else if (item.node.type === 'Identifier') {
              mixinName = item.node.name
            }
            return mixinName
          })
        }
      },
      ObjectMethod(path) {
        if (path.node.key.name === 'data') {
          if (path.node.body.body[0].type === 'ReturnStatement') {
            const dataKey = path.node.body.body[0].argument.properties.map(node => node.key.name)
            // console.log('dataKey', dataKey)
            vuePropertiesInfo.data = dataKey
          }
        }
      },
      ObjectProperty(path) {
        // console.log(path.node.key.name)
        if (path.node.key.name === 'computed') {
          const computedKey = path.node.value.properties.filter(node => node.type === 'ObjectMethod').map(node => node.key.name)
          // console.log('computedKey', computedKey)
          vuePropertiesInfo.computed = computedKey
        }
      },
    })
    return {
      filePath,
      vueMixinNames,
      vuePropertiesInfo
    }
  }
  /**
   * @description 获取mixin内需要监测的所有的key的value
   * @param {ast} ast 
   * @returns {{data:string[],computed:string[]}}
   */
  getMixinPropertiesByAst(ast) {
    const mixinProperties = {
      data: [],
      computed: [],
    }
    let mixinName = ''
    // 解析mixin中的 data computed
    babelTraverse(ast, {
      ObjectMethod(path) {
        if (path.node.key.name === 'data') {
          const dataKey = path.node.body.body[0].argument.properties.map(node => node.key.name)
          // console.log('dataKey', dataKey)
          mixinProperties.data = dataKey
        }
      },
      ObjectProperty(path) {
        // console.log(path.node.key.name)
        if (path.node.key.name === 'computed') {
          const computedKey = path.node.value.properties.filter(node => node.type === 'ObjectMethod').map(node => node.key.name)
          // console.log('computedKey', computedKey)
          mixinProperties.computed = computedKey
        }
      },
      ExportNamedDeclaration(path) {
        const { type } = path.node.declaration
        if (type === 'FunctionDeclaration') {
          mixinName = path.node.declaration.id.name
        } else if (type === 'VariableDeclaration') {
          mixinName = path.node.declaration.declarations[0].id.name
        }
      }
    })
    return { mixinProperties, mixinName }
  }
  /**
   * @description 获取文件ast
   * @param {string} filePath 
   * @returns {ast}
   */
  getFileAst(filePath) {
    const file = Fs.readFileSync(filePath, 'utf-8')
    const ast = babelParser.parse(file, { sourceType: 'module', sourceFilename: true, plugins: ['jsx'] })
    return ast
  }
  findDuplicate(arr) {
    const duplicates = []
    const map = new Map()
    arr.forEach((item, index) => {
      if (map.get(item) !== undefined) {
        duplicates.push(item)
      } else {
        map.set(item, index)
      }
    })
    return Array.from(new Set(duplicates))
  }
}

module.exports = VueMixinCheck
```