const koa = require('koa')
const game = require('./lib')
const fs = require('fs')
const mount = require('koa-mount')


let playLastAction = null
let playWon = 0
let sameCount = 0

const app = new koa()

app.listen(3000)
app.use(
    mount('/favicon.ico', function (ctx) {
        ctx.status = 200
    })
)
const gameKoa = new koa()

app.use(
    mount('/game', gameKoa)
)

gameKoa.use(
    async function (ctx,next) {
        if (playWon >= 3 || sameCount == 9) {
            ctx.status = 500
            ctx.body = '我再也不和你玩了'
        }
        await next()
        if(ctx.playWon === true){
            playWon++
        }
    }
)
gameKoa.use(
    async function (ctx, next) {
        const query = ctx.query
        const playAction = query.action
        if (playLastAction && playLastAction === playAction) {
            sameCount++
        } else {
            sameCount = 0
        }
        playLastAction = playAction
        ctx.playAction = playLastAction
        await next()
    }
)

gameKoa.use(
    async function (ctx,next) {
        const playAction = ctx.playAction
        const result = game(playAction)
        if (sameCount >= 3) {
            ctx.status = 400
            ctx.body = '你作弊'
            sameCount = 9
            return
        }
        ctx.status = 200
        if (result === 0) {
            ctx.body = '平局'
        } else if (result === -1) {
            ctx.body = '你输了'
        } else if (result === 1) {
            ctx.body = '你赢了'
            ctx.playWon = true
        }
    }
)
app.use(
    mount('/game', function (ctx) {
        
    })
)

app.use(
    mount('/', function (ctx) {
        ctx.body = fs.readFileSync(__dirname + '/index.html','utf-8')
    })
)