<a name="3.0.9"></a>
## [3.0.9](https://github.com/adonisjs/adonis-cli/compare/v3.0.8...v3.0.9) (2017-08-16)


### Bug Fixes

* **generators:** add WsController template ([#51](https://github.com/adonisjs/adonis-cli/issues/51)) ([a10e1e4](https://github.com/adonisjs/adonis-cli/commit/a10e1e4))
* **generators:** generate proper paths to nested folders ([6cae861](https://github.com/adonisjs/adonis-cli/commit/6cae861))
* **install:** pass `--save` flag to npm install ([9b39aa7](https://github.com/adonisjs/adonis-cli/commit/9b39aa7))
* **wsController:** make proper path for subdirs ([28f7af0](https://github.com/adonisjs/adonis-cli/commit/28f7af0))


### Features

* **serve:** remove forever for nodemon ([23f1798](https://github.com/adonisjs/adonis-cli/commit/23f1798))



<a name="3.0.8"></a>
## [3.0.8](https://github.com/adonisjs/adonis-cli/compare/v3.0.7...v3.0.8) (2017-08-08)


### Bug Fixes

* **template:** fix command template ([cb3bb86](https://github.com/adonisjs/adonis-cli/commit/cb3bb86))



<a name="3.0.7"></a>
## [3.0.7](https://github.com/adonisjs/adonis-cli/compare/v3.0.6...v3.0.7) (2017-08-04)


### Bug Fixes

* **context:** cli.copy should not overwrite the existing file ([8fc3bd1](https://github.com/adonisjs/adonis-cli/commit/8fc3bd1))
* **instructions:** make sure instruction fn is a function ([acc7e82](https://github.com/adonisjs/adonis-cli/commit/acc7e82))
* **serve:** fix glob pattern for ignore dirs ([4860502](https://github.com/adonisjs/adonis-cli/commit/4860502))



<a name="3.0.6"></a>
## [3.0.6](https://github.com/adonisjs/adonis-cli/compare/v3.0.5...v3.0.6) (2017-08-02)



<a name="3.0.5"></a>
## [3.0.5](https://github.com/adonisjs/adonis-cli/compare/v3.0.4...v3.0.5) (2017-08-01)


### Bug Fixes

* **commands:** use as flag over name ([e11ae80](https://github.com/adonisjs/adonis-cli/commit/e11ae80))



<a name="3.0.4"></a>
## [3.0.4](https://github.com/adonisjs/adonis-cli/compare/v3.0.3...v3.0.4) (2017-08-01)


### Features

* **commands:** add install command ([56834a8](https://github.com/adonisjs/adonis-cli/commit/56834a8))
* **commands:** add run:instructions command ([459d7c9](https://github.com/adonisjs/adonis-cli/commit/459d7c9))



<a name="3.0.3"></a>
## [3.0.3](https://github.com/adonisjs/adonis-cli/compare/v3.0.2...v3.0.3) (2017-07-28)


### Features

* **commands:** add make:ehandler command ([8703159](https://github.com/adonisjs/adonis-cli/commit/8703159))
* **commands:** add make:seed command ([c7898da](https://github.com/adonisjs/adonis-cli/commit/c7898da))
* **commands:** add repl command ([e0c0f7f](https://github.com/adonisjs/adonis-cli/commit/e0c0f7f))
* **commands:** add route:list command ([a0b63ed](https://github.com/adonisjs/adonis-cli/commit/a0b63ed))



<a name="3.0.2"></a>
## [3.0.2](https://github.com/adonisjs/adonis-cli/compare/v3.0.1...v3.0.2) (2017-07-27)


### Features

* **serve:** add ignore patterns to serve command ([eb132ef](https://github.com/adonisjs/adonis-cli/commit/eb132ef))



<a name="3.0.1"></a>
## [3.0.1](https://github.com/adonisjs/adonis-cli/compare/v3.0.0...v3.0.1) (2017-07-27)


### Bug Fixes

* **bin:** remove --harmony flag ([a814d45](https://github.com/adonisjs/adonis-cli/commit/a814d45))



<a name="3.0.0"></a>
# [3.0.0](https://github.com/adonisjs/adonis-cli/compare/v2.1.9...v3.0.0) (2017-07-27)


### Bug Fixes

* **test:** add hack for windows ([5ee5071](https://github.com/adonisjs/adonis-cli/commit/5ee5071))
* **test:** another attempt for window ([5a98518](https://github.com/adonisjs/adonis-cli/commit/5a98518))
* **test:** fix breaking tests ([525312a](https://github.com/adonisjs/adonis-cli/commit/525312a))
* **test:** fs.remove doesn't work in windows ([c4539cf](https://github.com/adonisjs/adonis-cli/commit/c4539cf))


### Features

* **command:** cleanup & add `new` command ([5844ef6](https://github.com/adonisjs/adonis-cli/commit/5844ef6))
* **commands:** add key:generate ([e4d105e](https://github.com/adonisjs/adonis-cli/commit/e4d105e))
* **commands:** add make commands ([c4d21d4](https://github.com/adonisjs/adonis-cli/commit/c4d21d4))
* **commands:** add make:listener command ([6e276d6](https://github.com/adonisjs/adonis-cli/commit/6e276d6))
* **commands:** add migration make command ([d13b2f7](https://github.com/adonisjs/adonis-cli/commit/d13b2f7))
* **commands:** add serve command ([34ee502](https://github.com/adonisjs/adonis-cli/commit/34ee502))



<a name="2.1.9"></a>
## [2.1.9](https://github.com/adonisjs/adonis-cli/compare/v2.1.8...v2.1.9) (2017-03-14)


### Bug Fixes

* **new:** change process directory ([#26](https://github.com/adonisjs/adonis-cli/issues/26)) ([35afe17](https://github.com/adonisjs/adonis-cli/commit/35afe17))



<a name="2.1.8"></a>
## [2.1.8](https://github.com/adonisjs/adonis-cli/compare/v2.1.7...v2.1.8) (2017-01-30)


### Bug Fixes

* **fs:** fs.constants is undefined across versions ([b0d8841](https://github.com/adonisjs/adonis-cli/commit/b0d8841))



<a name="2.1.7"></a>
## [2.1.7](https://github.com/adonisjs/adonis-cli/compare/v2.1.6...v2.1.7) (2017-01-28)


### Bug Fixes

* **dependencies:** install adonis-fold as main dependency ([dbf9e21](https://github.com/adonisjs/adonis-cli/commit/dbf9e21))



<a name="2.1.6"></a>
## [2.1.6](https://github.com/adonisjs/adonis-cli/compare/v2.1.5...v2.1.6) (2017-01-28)


### Bug Fixes

* closes [#3](https://github.com/adonisjs/adonis-cli/issues/3) ([25d2edd](https://github.com/adonisjs/adonis-cli/commit/25d2edd))
* use the requiredNodeVersion and requiredNpmVersion const ([246dde6](https://github.com/adonisjs/adonis-cli/commit/246dde6))
* **install:** install using --no-optional flag ([0426fa3](https://github.com/adonisjs/adonis-cli/commit/0426fa3))


### Features

* add check node.js and npm required versions to the new command. ([7493ee6](https://github.com/adonisjs/adonis-cli/commit/7493ee6))
* check node.js and npm required versions ([954f3e8](https://github.com/adonisjs/adonis-cli/commit/954f3e8))
