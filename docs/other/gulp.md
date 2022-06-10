# gulp
```js
// gulpfile.js
const { series, parallel, src, dest } = require('gulp')
const through2 = require('through2')
const parser = require('@babel/parser')
const walk = require('@babel/traverse').default
const generator = require('@babel/generator').default
const astring = require('astring')
const acornWalk = require('acorn-walk')
const Path = require('path')
console.log(Path.isAbsolute('through2'))
const resolveAlias = '@'
const filePaths = ['api', 'service', 'store', 'utils', 'components']
function proecess() {
  // 解析node stream
  return through2.obj(function (file, encoding, cb) {
    // console.log('file', Object.keys(file))//stat _contents history _cwd _isVinyl _symlink
    const wxJsAst = parser.parse(file._contents.toString(), { sourceType: 'module' })
    // console.log(wxJsAst)
    walk(wxJsAst, {
      ImportDeclaration(path) {
        const sourceValue = path.node.source.value
        //以 ../开头
        if (/^\.\.\//.test(sourceValue)) {
          const firstPathName = path.node.source.value.match(/([a-zA-Z]+)/)[0]//路径指向的第一个文件夹名称
          if (filePaths.includes(firstPathName)) {
            const thinSourceValue = sourceValue.replace(/\.\.\//g, '')
            // console.log(sourceValue)
            // console.log(firstPathName)
            // console.log(thinSourceValue)
            // console.log(`${resolveAlias}/${thinSourceValue}`)
            path.node.source.value = `${resolveAlias}/${thinSourceValue}`
          }
        }
      }
    })
    const updatCode = generator(wxJsAst, {
      retainLines: true
    }).code
    file._contents = Buffer.from(updatCode)
    this.push(file)
    return cb()
  })
}

function batchImportReplace() {
  return src(['../../yqmm-moblie-wx/miniprogramRoot/pages/**/*.js']).pipe(proecess()).pipe(dest('./pages'))

}

exports.default = batchImportReplace
```