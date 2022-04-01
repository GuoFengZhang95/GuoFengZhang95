const shell = require('shelljs')
// if (shell.exec('npm run build').code !== 0) {//执行npm run build 命令
//   shell.echo('Error: Git commit failed')
//   shell.exit(1)
// }
let res1 = shell.exec('git init')
console.log(res1)
let res2 = shell.exec('git add -A')
console.log(res2)
shell.exec("git commit -m 'deploy'")
shell.exec('git push -f git@github.com:GuoFengZhang95/blog.git master:gh-pages')