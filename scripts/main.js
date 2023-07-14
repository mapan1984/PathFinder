import Game from './game.js'
import Dungeon from './dungeon.js'


let game = new Game()

let dungeon = new Dungeon(500, 500, 10, '#dungeon')

let sel = document.querySelector('#method')
const methods = {
    'breadFirst': dungeon.breadthFirstUpdate.bind(dungeon),
    'greedy': dungeon.greedyUpdate.bind(dungeon),
    'dijkstra': dungeon.dijkstraUpdate.bind(dungeon),
    'astar': dungeon.astarUpdate.bind(dungeon),
}

let status = document.querySelector('#status')

dungeon.show()

game.draw = function() {
    dungeon.clean()
    dungeon.show()
}

game.update = function() {
    // 执行下一步
    methods[sel.value]()
}

game.reset = function() {
    if (!game.runing) {
        dungeon.init()
        dungeon.clean()
        dungeon.show()
        sel.disabled = false
    }
}

// 按空格开始/暂停
game.registerAction(' ', () => {
    game.taggle.bind(game)()
    // 游戏开始后禁用算法选择
    if (game.runing) {
        sel.disabled = true
    }
    status.innerText = `当前状态：${game.runing ? '运行(可按空格暂停)' : '停止(可按空格开始)'}`
})

// 按 'r' 重置
game.registerAction('r', game.reset.bind(game))

// 监控按键事件
game.listen()
