# koa-token

A token middleware for Koa

## Install

```bash
npm install @sqrtthree/koa-token
```

## Usage

```ts
import * as Koa from 'koa'
import { tokenMiddleware } from '@sqrtthree/koa-token'

const app = new Koa()

app.use(
  tokenMiddleware({
    token: 'target token',
  })
)
```

## Options

### token: `string | () => string | Promise<string>`

String or function to get target token.

---

> [sqrtthree.com](https://sqrtthree.com/) &nbsp;&middot;&nbsp;
> GitHub [@sqrthree](https://github.com/sqrthree) &nbsp;&middot;&nbsp;
> Twitter [@sqrtthree](https://twitter.com/sqrtthree)
