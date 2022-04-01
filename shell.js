const shell = require('shelljs')
if (shell.exec('npm run build').code !== 0) {//执行npm run build 命令
  shell.echo('Error: Git commit failed')
  shell.exit(1)
}
shell.cd('./docs/.vuepress/dist')
shell.exec('git init')
shell.exec('git add -A')
shell.exec("git commit -m 'deploy'")
shell.exec('git push -f git@github.com:GuoFengZhang95/blog.git master:gh-pages')