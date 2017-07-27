'use strict'

/*
 * adonis-auth
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
*/

const path = require('path')
const test = require('japa')
const generators = require('../src/Generators')
const OPTS = {
  appRoot: __dirname,
  appDir: 'app',
  dirs: {
    httpControllers: 'Controllers/Http',
    wsControllers: 'Controllers/Ws',
    models: 'Models',
    hooks: 'Models/Hooks',
    listeners: 'Listeners',
    exceptions: 'Exceptions',
    exceptionHandlers: 'Exceptions/Handlers',
    middleware: 'Middleware',
    commands: 'Commands',
    views: 'resources/views',
    migrations: 'database/migrations'
  }
}

test.group('Generators', () => {
  test('get path to the controller file', (assert) => {
    const filePath = generators.httpController.getFilePath('User', OPTS)
    assert.equal(filePath, path.join(__dirname, 'app/Controllers/Http', 'UserController.js'))
  })

  test('make controller file singular', (assert) => {
    const filePath = generators.httpController.getFilePath('Users', OPTS)
    assert.equal(filePath, path.join(__dirname, 'app/Controllers/Http', 'UserController.js'))
  })

  test('normalize controller keyword', (assert) => {
    const filePath = generators.httpController.getFilePath('UsersController', OPTS)
    assert.equal(filePath, path.join(__dirname, 'app/Controllers/Http', 'UserController.js'))
  })

  test('get data for the controller', (assert) => {
    const data = generators.httpController.getData('User', {})
    assert.deepEqual(data, { name: 'UserController', resource: false })
  })

  test('get path to the model file', (assert) => {
    const filePath = generators.model.getFilePath('User', OPTS)
    assert.equal(filePath, path.join(__dirname, 'app/Models', 'User.js'))
  })

  test('singularize model name', (assert) => {
    const filePath = generators.model.getFilePath('Users', OPTS)
    assert.equal(filePath, path.join(__dirname, 'app/Models', 'User.js'))
  })

  test('normalize model name', (assert) => {
    const filePath = generators.model.getFilePath('UsersModel', OPTS)
    assert.equal(filePath, path.join(__dirname, 'app/Models', 'User.js'))
  })

  test('get data for model', (assert) => {
    const data = generators.model.getData('UsersModel', {})
    assert.deepEqual(data, { name: 'User' })
  })

  test('get path to the middleware file', (assert) => {
    const filePath = generators.middleware.getFilePath('User', OPTS)
    assert.equal(filePath, path.join(__dirname, 'app/Middleware', 'UserMiddleware.js'))
  })

  test('keep middleware singular', (assert) => {
    const filePath = generators.middleware.getFilePath('Users', OPTS)
    assert.equal(filePath, path.join(__dirname, 'app/Middleware', 'UserMiddleware.js'))
  })

  test('normalize middleware name', (assert) => {
    const filePath = generators.middleware.getFilePath('UsersMiddleware', OPTS)
    assert.equal(filePath, path.join(__dirname, 'app/Middleware', 'UserMiddleware.js'))
  })

  test('get middleware data', (assert) => {
    const data = generators.middleware.getData('UsersMiddleware', {})
    assert.deepEqual(data, { name: 'UserMiddleware', http: false, ws: false })
  })

  test('get path to the hooks file', (assert) => {
    const filePath = generators.hook.getFilePath('User', OPTS)
    assert.equal(filePath, path.join(__dirname, 'app/Models/Hooks', 'UserHook.js'))
  })

  test('keep hook name singular', (assert) => {
    const filePath = generators.hook.getFilePath('Users', OPTS)
    assert.equal(filePath, path.join(__dirname, 'app/Models/Hooks', 'UserHook.js'))
  })

  test('normalize hook name', (assert) => {
    const filePath = generators.hook.getFilePath('Users_Hook', OPTS)
    assert.equal(filePath, path.join(__dirname, 'app/Models/Hooks', 'UserHook.js'))
  })

  test('get data for hook', (assert) => {
    const data = generators.hook.getData('Users_Hook', {})
    assert.deepEqual(data, { name: 'UserHook', method: 'method' })
  })

  test('use method name passed to flags', (assert) => {
    const data = generators.hook.getData('Users_Hook', { method: 'validatePassword' })
    assert.deepEqual(data, { name: 'UserHook', method: 'validatePassword' })
  })

  test('get path to the view file', (assert) => {
    const filePath = generators.view.getFilePath('User', OPTS)
    assert.equal(filePath, path.join(__dirname, 'resources/views', 'user.edge'))
  })

  test('get path to nested view file', (assert) => {
    const filePath = generators.view.getFilePath('users.list', OPTS)
    assert.equal(filePath, path.join(__dirname, 'resources/views', 'users/list.edge'))
  })

  test('get data for the view', (assert) => {
    const data = generators.view.getData('users.list', {})
    assert.deepEqual(data, { layout: null })
  })

  test('set layout on data', (assert) => {
    const data = generators.view.getData('users.list', { layout: 'master' })
    assert.deepEqual(data, { layout: 'master' })
  })

  test('get path to the command file', (assert) => {
    const filePath = generators.command.getFilePath('makeTemplate', OPTS)
    assert.equal(filePath, path.join(__dirname, 'app/Commands', 'MakeTemplate.js'))
  })

  test('keep command name singular', (assert) => {
    const filePath = generators.command.getFilePath('makeTemplates', OPTS)
    assert.equal(filePath, path.join(__dirname, 'app/Commands', 'MakeTemplate.js'))
  })

  test('normalize command name', (assert) => {
    const filePath = generators.command.getFilePath('makeTemplateCommand', OPTS)
    assert.equal(filePath, path.join(__dirname, 'app/Commands', 'MakeTemplate.js'))
  })

  test('get data for command', (assert) => {
    const data = generators.command.getData('makeTemplate', {})
    assert.deepEqual(data, { name: 'MakeTemplate', commandName: 'make:template' })
  })

  test('get path to the schema file', (assert) => {
    const filePath = generators.schema.getFilePath('users', OPTS)
    assert.include(filePath, '_users_schema.js')
  })

  test('get data for schema', (assert) => {
    const data = generators.schema.getData('users', {})
    assert.deepEqual(data, { create: false, table: 'users', name: 'UsersSchema' })
  })

  test('pluralize table name', (assert) => {
    const data = generators.schema.getData('user', {})
    assert.deepEqual(data, { create: false, table: 'users', name: 'UserSchema' })
  })

  test('snake case table name', (assert) => {
    const data = generators.schema.getData('UserProfile', {})
    assert.deepEqual(data, { create: false, table: 'user_profiles', name: 'UserProfileSchema' })
  })
})
