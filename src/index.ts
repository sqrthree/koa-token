import Koa from 'koa'
import _ from 'lodash'

type tokenFn = () => string | Promise<string>

interface tokenOptions {
  token: string | tokenFn
}

/**
 * Verify requests with special token.
 *
 * @param options Options of token middleware.
 * @param options.token string or function to get target token.
 *
 * @returns token middleware
 */
export function tokenMiddleware(options: tokenOptions): Koa.Middleware {
  return async function middleware(
    ctx: Koa.Context,
    next: Koa.Next
  ): Promise<void> {
    let token = ctx.headers['x-token'] || ctx.headers.token

    if (!token && ctx.headers.authorization) {
      token = ctx.headers.authorization.substring('Bearer '.length)
    }

    if (!token) {
      ctx.throw(403, 'The request is missing an authentication token', {
        code: 'TOKEN_REQUIRED',
      })
    }

    let targetToken = ''

    if (typeof options.token === 'string') {
      targetToken = options.token
    } else {
      targetToken = await options.token()
    }

    const isValid = token === targetToken

    if (!isValid) {
      ctx.throw(401, 'Invalid token', {
        code: 'TOKEN_INVALID',
      })
    }

    return next()
  }
}
