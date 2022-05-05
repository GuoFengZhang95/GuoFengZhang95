# 文件处理
在仪器买卖小程序开发前期，没有使用正确的api结构。api的导出和引用分散到多个文件中。故想要使用node进行批量文本处理

当前使用方式

```js
// api/a.js
export function a() {}
// api/b.js
export function b() {}
// home.js
import { a } from 'api/a.js'
import { b } from 'api/b.js'
```

期望实现方式

```js
// api/index.js
export { a } from 'a.js'
export { b } from 'b.js'
// home.js
import { a, b } from 'api/index.js'
```

实现过程如下

1. 把api方法统一到`ap/index.js`文件中

```js
import { resolve, extname } from 'path'
import { readdir, appendFile, writeFile } from 'fs/promises'
import { createReadStream } from 'fs'
import * as readline from 'readline'

async function processLineByLine(path) {
  const fileStream = createReadStream(path)
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })
  // 使用 crlfDelay 选项将所有 CR LF ('\r\n') 实例识别为单个换行符。
  let lines = []
  for await (const line of rl) {
    // 文件中的每一行都将在此处作为 `line` 连续可用。
    lines.push(line)
  }
  return lines
}
function findDuplicateFnNames(temp) {
  const duplicatedFnNames = []
  let flattenAllFnNames = temp.reduce((total, currentVlaue, currentIndex, originArray) => {
    return [...total, ...currentVlaue]
  }, []).sort()
  for (let i = 0; i < flattenAllFnNames.length; i++) {
    const current = flattenAllFnNames[i]
    const next = flattenAllFnNames[i + 1]
    if (current === next) {
      if (duplicatedFnNames.indexOf(current) === -1) {
        duplicatedFnNames.push(current)
      }
    }
  }
  return duplicatedFnNames
}
const rootDir = './src'
const allFnNames = []
let duplicatedFnNames = []
try {
  writeFile(rootDir + '/index.js', '')
  const reg = /(?<=function).*(?=\()/g
  // 获取指定页面下的所有js api文件
  const files = (await readdir(rootDir)).filter(item => extname(item))
  for (const fileName of files) {
    // 按行读取每个文件中的内容
    if (fileName !== 'index.js') {
      const lines = await processLineByLine(resolve(rootDir, fileName))
      // 获取到当前页面中所有的导出方法名
      const fnNames = lines.filter(line => line.match(reg)).map(line => line.match(reg)[0].trim())
      allFnNames.push(fnNames)
      let exportStr = `export { ${fnNames.join(', ')} } from './${fileName}'\r\n`
      appendFile(rootDir + '/index.js', exportStr, { encoding: 'utf-8' })
    }
  }
} catch (err) {
  console.error(err)
}
duplicatedFnNames = findDuplicateFnNames(allFnNames)
console.log('重名方法', duplicatedFnNames)
import * as api from './src/index.js'
console.log(api)
```

2. 替换业务文件中的引用方式

```js
import path, { resolve, extname, relative } from 'path'
import { createReadStream } from 'fs'
import { readdir, writeFile, appendFile } from 'fs/promises'
import * as readline from 'readline'
import ora from 'ora'
const fileType = '.js'
const filePaths = []
const importFromPath = '../api/src/index.js'// ap导出文件的目录
async function main() {
  await getAllMatchedFiles('./src')
  // console.log('filePaths', filePaths)
  for (const path of filePaths) {
    await handlePageJs(path)
  }
}

/**
 * @description 获取项目中所有的匹配文件
 * @param {string} path 
 */
async function getAllMatchedFiles(path) {
  const res = await readdir(path, { withFileTypes: true })
  for (const item of res) {
    if (item.isDirectory()) {
      await getAllMatchedFiles(`${path}/${item.name}`)
    } else {
      if (extname(item.name) === fileType) {
        filePaths.push(`${path}/${item.name}`)
      }
    }
  }
}

/**
 * @description 逐行读取文件内容并返回行数组
 * @param {*} path 
 * @returns {[string]}
 */
async function processLineByLine(path) {
  // console.log('path', path)
  // return
  const fileStream = createReadStream(path)
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })
  // 使用 crlfDelay 选项将所有 CR LF ('\r\n') 实例识别为单个换行符。
  let lines = []
  for await (const line of rl) {
    // 文件中的每一行都将在此处作为 `line` 连续可用。
    lines.push(line)
  }
  return lines
}
/**
 * @description 修改指定路径的js文件
 */
async function handlePageJs(targetPath) {
  const relativePath = relative(targetPath, importFromPath).split(path.sep).join('/')
  // console.log('targetPath', targetPath)
  // console.log('相对路径', relativePath)
  let fileLines = await processLineByLine(targetPath)//某页面行数组
  // return
  // 找到构造方法分界处
  const splitIndex = fileLines.findIndex(item => item.includes('Component(') || item.includes('Page(') || item.includes('MumuComponent('))
  const structureFileLines = fileLines.slice(splitIndex)//页面组件构造方法的行数组
  let importFileLines = fileLines.slice(0, splitIndex)//和import相关的行数组
  const importApiArr = []//满足条件的原有import字符串
  const importApiArrIndex = []//满足条件的原有import字符串下标
  let startIndex = -1
  let endIndex = -1
  importFileLines.forEach((item, index) => {
    if (item.includes('import')) {
      startIndex = index
    }
    if (item.includes('/api/')) {
      endIndex = index
      importApiArrIndex.push([startIndex, endIndex])
      importApiArr.push(importFileLines.slice(startIndex, endIndex + 1).join(''))
    }
  })
  let fnNames = []//满足条件方法名
  fnNames = importApiArr.map(item => {
    const reg = /(?<={).*(?=})/g
    item = item.replaceAll('\r\n', '').split(' ').filter(item => item).join('').match(reg)
    // console.log(item)
    return item[0]
  })
  const fnsStr = fnNames.join(',').split(',').join(', ')
  const newImportStr = `import { ${fnsStr} } from '${relativePath}'`//新的import字符串
  // 删除历史import
  importFileLines = importFileLines.filter((item, index) => importApiArrIndex.every(d => index < d[0] || index > d[1]))
  importFileLines.push(newImportStr)

  fileLines = [...importFileLines, ...structureFileLines]
  await writeFile(targetPath, '')
  for (const line of fileLines) {
    if (line && line != '\r\n') {
      await appendFile(targetPath, `${line}\r\n`)
    }
  }
}
console.time('main')
const spinner = ora('main').start()
spinner.text = 'main'
spinner.color = 'yellow'
await main()
spinner.stop()
console.timeEnd('main')
console.log(path.sep)
```