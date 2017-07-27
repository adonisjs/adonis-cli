# AdonisJs Cli 🍺
> Scaffolding tool for Adonisjs

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Appveyor][appveyor-image]][appveyor-url]
[![Coveralls][coveralls-image]][coveralls-url]

Adonis cli is built on top of [Adonis ace](https://github.com/adonisjs/ace) and helps you scaffold new projects.

Also it can proxy all the ace commands for a project, so that you can run them using the global `adonis` command.

<img src="http://res.cloudinary.com/adonisjs/image/upload/q_100/v1497112678/adonis-purple_pzkmzt.svg" width="200px" align="right" hspace="30px" vspace="100px">

## Installation
You can install the package from npm.
```bash
npm i --global @adonisjs/cli
```

## Usage

```bash
adonis new yardstick

# start http server
adonis serve
```

## Moving Forward
Checkout the [official documentation](http://adonisjs.com/guides/installation) at the AdonisJs website for more info.

## Tests
Tests are written using [japa](http://github.com/thetutlage/japa). Run the following commands to run tests.

```bash
npm run test:local

# report coverage
npm run test

# on windows
npm run test:win
```

## Release History

Checkout [CHANGELOG.md](CHANGELOG.md) file for release history.

## Meta

AdonisJs – [@adonisframework](https://twitter.com/adonisframework) – virk@adonisjs.com

Checkout [LICENSE.txt](LICENSE.txt) for license information

Harminder Virk (Aman) - [https://github.com/thetutlage](https://github.com/thetutlage)

[appveyor-image]: https://img.shields.io/appveyor/ci/thetutlage/adonis-fold/master.svg?style=flat-square

[appveyor-url]: https://ci.appveyor.com/project/thetutlage/adonis-fold

[npm-image]: https://img.shields.io/npm/v/@adonisjs/fold.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@adonisjs/fold

[travis-image]: https://img.shields.io/travis/poppinss/adonis-fold/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/poppinss/adonis-fold

[coveralls-image]: https://img.shields.io/coveralls/poppinss/adonis-fold/develop.svg?style=flat-square

[coveralls-url]: https://coveralls.io/github/poppinss/adonis-fold
