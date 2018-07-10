const Router = require('koa-router')
const WebHook = require('../util/webhook')
// const logger = require('../util/logger')

let hook = new Router()

hook.post('/', async (ctx) => {
	let result = await WebHook(ctx)
	console.log(`================================== HOOK ${ctx.params.num} RESULT START ==================================`)
	console.log(result)
	console.log(`================================== HOOK ${ctx.params.num} RESULT END ==================================`)
	// logger.info(`================================== HOOK ${ctx.params.num} RESULT START ==================================`)
	// logger.info(result)
	// logger.info(`================================== HOOK ${ctx.params.num} RESULT END ==================================`)
	ctx.body = result
})


module.exports = hook