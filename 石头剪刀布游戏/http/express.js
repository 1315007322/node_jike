const express = require('express')
const fs = require('fs')
const url = require('url')
const game = require('./lib')
const app = express()
const queryString = require('querystring')


let playLastAction = null
let playWon = 0
let sameCount = 0


app.get('/', function (req, res) {
    res.status(200)
    // console.log(typeof fs.readFileSync(__dirname + '/index.html','utf-8')) string
    res.send(fs.readFileSync(__dirname + '/index.html', 'utf-8'))
})

app.get('/game',
    function (req, res, next) {
        if (playWon >= 3 || sameCount == 9) {
            res.writeHead(500)
            res.end('我再也不和你玩了')
        }
        next()
        if(res.playWon === true){
            playWon++
        }
    },
    function (req, res, next) {
        const query = req.query
        const playAction = query.action
        if (playLastAction && playLastAction === playAction) {
            sameCount++
        } else {
            sameCount = 0
        }
        playLastAction = playAction
        res.playAction = playLastAction
        next()

    },
    function (req, res) {
        const playAction = res.playAction
        const result = game(playAction)
        if (sameCount >= 3) {
            res.status(400)
            res.send('你作弊')
            sameCount = 9
            return
        }
        res.status(200)
        if (result === 0) {
            res.send('平局')
        } else if (result === -1) {
            res.send('你输了')
        } else if (result === 1) {
            res.send('你赢了')
            res.playWon = true
        }
    }
)

app.listen(3000)