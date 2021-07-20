module.exports = function (playAction) {
    var random = Math.random() * 3

    if (random < 1) {
        var computerAction = 'rock'
    } else if (random > 2) {
        var computerAction = 'scissor'
    } else {
        var computerAction = 'paper'
    }

    if (computerAction === playAction) {
        console.log('平局');
        return 0
    } else if (
        (computerAction === 'rock' && playAction === 'paper') ||
        (computerAction === 'paper' && playAction === 'scissor') ||
        (computerAction === 'scissor' && playAction === 'rock')
    ) {
        console.log('你赢了');
        return 1
    } else {
        console.log('你输了');
        return -1

    }
}