<h1 align="center">
  Auto-Bump
</h1>
<p align="center">
  Bump version in package.json automatically according to git log.
</p>
<p align="center">
  <a href="https://travis-ci.org/ihexxa/auto-bump">
    <img src="https://travis-ci.org/ihexxa/auto-bump.svg?branch=master" />
  </a>
</p>
<p align="center">
  <img src="https://github.com/ihexxa/auto-bump/raw/master/demo.png" alt="auto-bump">
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

### Preconditions

- There is only one root branch in git history.
- Subjects of commits should align to [Conventional Commits](https://conventionalcommits.org/) (or you need to add autoBump config in `package.json` to specify custom matching patterns).

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
$ yarn auto-bump
```

At first auto-bump will check if there is tag for previous version.
Or it will traverse from the first commit of root branch and bump version for each commit.
And you will see package.json version is udpated.

Please notice that auto-bump will check commit subject to decide bumping major/minor/patch version. So by default your commit subject should follow [Conventional Commits](https://conventionalcommits.org/). Or your can add custom matching patterns in `package.json`, you can refer `package.json` in this repository as example.

## Contribute

WIP.

## TODO

- Add API for Javascript
- Add life cycle functions

## License

[MIT](LICENSE) © Hexxa
