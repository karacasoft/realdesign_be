const Koa = require('Koa')
const app = new Koa()

const Router = require('koa-router')
const router = new Router()

const koaBody = require('koa-body')

const cors = require('@koa/cors')
app.use(cors({
    origin: "*"
}))

router.get( '/', async (ctx, next) => {
    ctx.body = "hello"
});

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(8080)
