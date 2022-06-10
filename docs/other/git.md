# git
## git merge
### --squash
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

### git reset
`git reset`命令用于重置代码，一共有四个参数：`--soft`，`--mixed`（默认值），`--hard`，`--merge`。

重点关注一下`git reset --hard`：重置到某个`commit`后，这个`commit`之后工作区、暂存区、本地仓库所有的改动都会重置

如下图所示:

<img :src="$withBase('/images/git006.png')" alt="git006">

```js
let a = 1//远程仓库
let b = 1//本地仓库
let c = 1//暂存区
let d = 1//工作区
```

执行 `git reset f4eaf51fe5be5de981cbf1ed28f6ba7b25167b88 --hard` 重置到线上最新的`commit`。此时可以发现工作区、暂存区、本次仓库的改动都重置了

<img :src="$withBase('/images/git007.png')" alt="git007">

如果我们重置到线上最新提交的前一个`commit`，这时必须执行`git push --force`

<img :src="$withBase('/images/git008.png')" alt="git008">

<img :src="$withBase('/images/git009.png')" alt="git009">

### git revert
`git revert`也有回退代码的功能，与`git reset`不同的是，`git revert`

如下图所示，针对`revert.js`文件有三次提交

<img :src="$withBase('/images/git010.png')" alt="git010">

```js
let a = 1//第一次commit
let b = 1//第二次commit
let c = 1//第三次commit
```

1. 回退1次提交，只保留这个提交之前的内容`git revert 015a78b67294b4f989534abdc712af163a7f1d6a`，此时产生了一个新的提交覆盖原来的内容，

<img :src="$withBase('/images/git011.png')" alt="git011">

```js
let a = 1
let b = 1
```

此时再次回退3个提交，`git revert daf9418b60c8a0f44d4cdc49d315b127d8c0e443`,

<img :src="$withBase('/images/git011.png')" alt="git011">

```js
let a = 1
```