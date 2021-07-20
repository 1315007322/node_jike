const http = require('http')
const url = require('url')
const game = require('./lib')
const fs = require('fs')
const queryString = require('querystring')

let playLastAction = null
let playWon = 0
let sameCount = 0

http.createServer(function (req, res) {
    const paseurl = url.parse(req.url)
    if(paseurl.pathname === '/game'){
        const query = queryString.parse(paseurl.query)
        console.log(query);
        const playAction = query.action
        const result = game(playAction)
      
        if(playWon >=3 || sameCount == 9){
            res.writeHead(500)
            res.end('我再也不和你玩了')
        }
        if(playLastAction && playLastAction === playAction){
            sameCount++
        }else{
            sameCount = 0
        }
        playLastAction = playAction
        if(sameCount >=3 ){
            res.writeHead(400)
            res.end('你作弊')
            sameCount = 9
            return
        }
        res.writeHead(200)
        if(result === 0){
            res.end('平局')
        }else if(result === -1){
            res.end('你输了')
            playWon++
        }else if(result === 1){
            res.end('你赢了')
            playWon++
        }
    }
    if(paseurl.pathname === '/'){
        fs.createReadStream(__dirname + '/index.html').pipe(res)
    }
}).listen(3000)