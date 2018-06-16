<h1 align="center">
  AutoBump
</h1>
<p align="center">
  自动根据git日志提升pacakge.json中的版本
</p>
<p align="center">
  <a href="https://travis-ci.org/ihexxa/auto-bump">
    <img src="https://travis-ci.org/ihexxa/auto-bump.svg?branch=master" />
  </a>
</p>
<p align="center">
  <img src="https://github.com/ihexxa/auto-bump/raw/master/demo.png" alt="auto-bump">
<p>

选择语言: [English](./README.md) | 简体中文

## 背景

自动根据提交类型，提升`package.json`的`version`字段.

举个栗子:
如果当前版本是`1.0.0`(用 git tag 标记), 并且自该版本有提交了 3 次， 它们是：

- BREAKING CHANGE(button): add button api
- feat(button): add button
- fix(button): fix button bug

则版本应该是 `2.1.1`.

输入 `yarn auto-bump`, 则`package.json`的`version`字段会自动更新为`2.1.1`.

## 安装

### 前提

- git 历史中, 只有一条根分支.
- 提交标题应该复合[Conventional Commits](https://conventionalcommits.org/) (或者你需要在`package.json`中添加 autoBump 配置来指定自定义匹配规则)

```sh
$ yarn add -D auto-bump
```

或者

```sh
$ npm install -D auto-bump
```

## 使用

只需要：

```sh
$ yarn auto-bump
```

首先 auto-bump 会检查前一个版本是否有相应的 tag. 如果没有则会从根分支的第一个提交开始遍历每个提交, 并提升版本. 然后你就能看到 `package.json` 中的`version` 更新了.

请注意 auto-bump 会继承检查 git commit 的标题来决定提升 major/minor/patch 版本.因此默认你的提交应该符合[Conventional Commits](https://conventionalcommits.org/)标准.
或者你可以在`package.json`中添加自定义的匹配模式，可以参考本库的`package.json`作为例子.

## 贡献

WIP.

## 待完成

- 添加 Javascript API
- 添加生命期钩子

## 许可证

[MIT](LICENSE) © Hexxa
