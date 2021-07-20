// console.log(process.argv);

// var playAction = process.argv[process.argv.length - 1]

const game = require('./lib')

let count = 0

process.stdin.on('data',e => {
    const playAction = e.toString().trim()
    const result = game(playAction)


    if(result === 1){
        count++
    }
    console.log(result);

    if(count === 3){
        console.log("机器人输的太多了，不玩了");
        process.exit()
    }
})
