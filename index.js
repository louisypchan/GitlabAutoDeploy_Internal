const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')
const Hook = require('./routers/hook')
const bodyParser = require('koa-bodyparser')

let router = new Router()

router.use('/hook:num', Hook.routes(), Hook.allowedMethods())

app.use(bodyParser())

app.use(router.routes()).use(router.allowedMethods())



app.listen(3000)
console.log('[demo] start-quick is starting at port 3000')