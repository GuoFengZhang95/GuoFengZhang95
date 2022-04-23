## git
### git merge
#### --squash
通常我们开发的时候会从主分支上拉取开发分支，开发完成后执行`git merge`命令把开发内容合并到主分支

1. 新增开发分支`dev-v1.0.0`，并生成2次`commit`

2. 新增开发分支`dev-v2.0.0`，并生成2次`commit`

此时提交记录如下

<img :src="$withBase('/images/git001.png')" alt="git001">

此时`main`分支只有1个`commit`

<img :src="$withBase('/images/git002.png')" alt="git002">

3. 把`dev-v1.0.0`合并到`main`，执行`git merge`命令。此时`main`分支生成2个来自`dev-v1.0.0`的`commit`

<img :src="$withBase('/images/git003.png')" alt="git003">

3. 把`dev-v2.0.0`合并到`main`，执行`git merge --squash`命令。此时`main`分支生成1个新`commit`，内容是`dev-v2.0.0`的所有改动。此时提交记录如下（`main`分支也做了1次`commit`）:

>显示当前分支

<img :src="$withBase('/images/git004.png')" alt="git004">

>显示所有分支

<img :src="$withBase('/images/git005.png')" alt="git005">

- `git merge`命令能够在合并的目标分支上保留提交记录
- `git merge --squash`命令可以让主分支的`commit`数量减少，能够更清楚地看出主分支上迭代了那些功能