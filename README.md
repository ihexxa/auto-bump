<h1 align="center">
  AutoBump
</h1>
<p align="center">
  Bump version in package.json automatically according to git log.
</p>
<p align="center">
  <img src="/ihexxa/autobump/raw/master/demo.png" alt="auto-bump">
<p>

Choose Language: English | [简体中文](./README_zh_cn.md)

## Background

Help to bump `version` in `pacakge.json` according to commit types (such as fix, feature or breaking change).

For example:
If previous version is "1.0.0" (using git tag), and there are 3 commits after that version, they are:

- BREAKING CHANGE(button): add button api
- feat(button): add button
- fix(button): fix button bug

The version should be `2.1.1`.

By inputting `yarn auto-bump`, `version` in `package.json` will be updated to `2.1.1`.

## Install

```sh
$ yarn add -D auto-bump
```

or

```sh
$ npm install -D auto-bump
```

## Usage

Only one command to bump your version:

```sh
$ yarn auto-bumpbump
```

Then auto-bump will traverse git logs and bump version for each commit. And you will see package.json version is udpated.

Please notice that auto-bump will check commit subject to decide bumping major/minor/patch version. So by default your commit subject should follow [Conventional Commits](https://conventionalcommits.org/). Or your can add custom matching patterns in `package.json`, you can check `package.json` in this repository as example.

## Contribute

WIP.

## License

[MIT](LICENSE) © Hexxa
