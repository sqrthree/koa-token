const http = require('http')
const Koa = require('koa')
const test = require('ava')
const listen = require('test-listen')
const got = require('got')

const { tokenMiddleware } = require('../dist/index')

const app = new Koa()

app.use(tokenMiddleware({ token: 'token' }))

app.use((ctx) => {
  ctx.body = 'success'
})

test.before(async (t) => {
  t.context.server = http.createServer(app.callback())
  t.context.prefixUrl = await listen(t.context.server)
})

test.after.always((t) => {
  t.context.server.close()
})

test('should return 403 without token', async (t) => {
  try {
    await got(t.context.prefixUrl)
  } catch (err) {
    t.is(err.response.statusCode, 403)
    t.is(err.response.body, 'Token is required')
  }
})

test('should return 401 with invalid token', async (t) => {
  try {
    await got(t.context.prefixUrl, {
      headers: {
        'x-token': 'invalid token',
      },
    })
  } catch (err) {
    t.is(err.response.statusCode, 401)
    t.is(err.response.body, 'Invalid token')
  }
})

test('should return 200 with x-token in header', async (t) => {
  const response = await got(t.context.prefixUrl, {
    headers: {
      'x-token': 'token',
    },
  })

  t.is(response.statusCode, 200)
  t.is(response.body, 'success')
})

test('should return 200 with authorization in header', async (t) => {
  const response = await got(t.context.prefixUrl, {
    headers: {
      Authorization: 'bearer token',
    },
  })

  t.is(response.statusCode, 200)
  t.is(response.body, 'success')
})

test('should return 200 with Promised token', async (t) => {
  const app = new Koa()

  app.use(
    tokenMiddleware({
      token: () => Promise.resolve('token'),
    })
  )

  app.use((ctx) => {
    ctx.body = 'success'
  })

  const server = http.createServer(app.callback())
  const url = await listen(server)

  const response = await got(url, {
    headers: {
      'x-token': 'token',
    },
  })

  t.is(response.statusCode, 200)
  t.is(response.body, 'success')

  server.close()
})
