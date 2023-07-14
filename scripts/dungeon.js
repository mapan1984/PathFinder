import Grid from './grid.js'
import PriorityQueue from './priorityQueue.js'


class Dungeon {
    constructor(width, height, gridSize, mapId) {
        this.width = width
        this.height = height
        this.gridSize = gridSize

        this.xMax = this.width / this.gridSize  // cols
        this.yMax = this.height / this.gridSize  // rows

        this._canvas = document.querySelector(mapId)
        this._canvas.width = width
        this._canvas.height = height

        this.context = this._canvas.getContext('2d')

        this.init()
    }

    init() {
        this.stop = false

        this.initGrids()

        this.start = this.grids[0][0]
        this.goal = this.grids[this.yMax-1][this.xMax-1]

        this.current = this.start

        this.start.obstacle = 0
        this.goal.obstacle = 0

        this.start.costFromStart = 0

        // 记录每个 grid 到 goal 的距离
        this.initGridsDis()

        // 记录当前可扩展边界
        this.frontier = [this.start]

        // 记录当前可扩展边界（优先队列）
        this.priorityFrontier = new PriorityQueue()
        this.priorityFrontier.enqueue(this.start, this.start.distanceToGoal)

        // 记录当前访问过的节点
        this.visited = [this.start]

        this.cameFrom = new Map()
        this.cameFrom.set(this.start, null)
    }

    clean() {
        this.context.clearRect(0, 0, this.width, this.height)
    }

    initGrids() {
        this.grids = []
        for (let y = 0; y < this.yMax; y++) {
            let row = []
            for (let x = 0; x < this.xMax; x++) {
                let random = Math.random()
                let grid
                if (random > 0.7) {
                    grid = new Grid(x, y, 1)
                } else {
                    grid = new Grid(x, y, 0)
                }
                row.push(grid)
            }
            this.grids.push(row)
        }
    }

    initGridsDis() {
        for (let row of this.grids) {
            for (let grid of row) {
                grid.setDistanceToGoal(this.goal)
            }
        }
    }

    neighbors(grid) {
        let x = grid.x
        let y = grid.y

        let res = []

        // 上、下、左、右 4 格，禁止走斜线
        if (y - 1 >= 0) {
            if (this.grids[y-1][x].obstacle < 1) {
                res.push(this.grids[y-1][x])
            }
        }

        if (y + 1 < this.yMax) {
            if (this.grids[y+1][x].obstacle < 1) {
                res.push(this.grids[y+1][x])
            }
        }

        if (x - 1 >= 0) {
            if (this.grids[y][x-1].obstacle < 1) {
                res.push(this.grids[y][x-1])
            }
        }

        if (x + 1 < this.xMax) {
            if (this.grids[y][x+1].obstacle < 1) {
                res.push(this.grids[y][x+1])
            }
        }

        return res
    }

    breadthFirstUpdate() {
        if (this.stop) {
            return
        }

        if (this.frontier.length == 0) {
            alert('无可探索区域')
            this.stop = true
            return
        }

        let current = this.frontier.shift()
        this.current = current
        this.visited.push(current)

        if (current == this.goal) {
            alert('找到目标')
            this.stop = true
            return
        }

        for (let next of this.neighbors(current)) {
            if (!this.cameFrom.has(next)) {
            // if (!this.visited.includes(next)) {
                this.frontier.push(next)
                this.cameFrom.set(next, current)
            }
        }
    }

    greedyUpdate() {
        if (this.stop) {
            return
        }

        if (this.priorityFrontier.isEmpty()) {
            alert('无可探索区域')
            this.stop = true
            return
        }

        let current = this.priorityFrontier.dequeue()
        this.current = current
        this.visited.push(current)

        if (current == this.goal) {
            alert('找到目标')
            this.stop = true
            return
        }


        for (let next of this.neighbors(current)) {
            if (!this.cameFrom.has(next)) {
            // if (!this.visited.includes(next)) {
                this.priorityFrontier.enqueue(next, next.distanceToGoal)
                this.cameFrom.set(next, current)
            }
        }
    }

    dijkstraUpdate() {
        if (this.stop) {
            return
        }

        if (this.priorityFrontier.isEmpty()) {
            alert('无可探索区域')
            this.stop = true
            return
        }

        let current = this.priorityFrontier.dequeue()
        this.current = current
        this.visited.push(current)

        if (current == this.goal) {
            alert('找到目标')
            this.stop = true
            return
        }


        for (let next of this.neighbors(current)) {
            let cost = current.costFromStart + current.cost(next)
            // if (!this.cameFrom.has(next)) {
            // if (!this.visited.includes(next)) {
            if (
                next.costFromStart == null
                || cost < next.costFromStart
            ) {
                next.costFromStart = cost
                this.priorityFrontier.enqueue(next, next.costFromStart)
                this.cameFrom.set(next, current)
            }
        }
    }

    astarUpdate() {
        if (this.stop) {
            return
        }

        if (this.priorityFrontier.isEmpty()) {
            alert('无可探索区域')
            this.stop = true
            return
        }

        let current = this.priorityFrontier.dequeue()
        this.current = current
        this.visited.push(current)

        if (current == this.goal) {
            alert('找到目标')
            this.stop = true
            return
        }


        for (let next of this.neighbors(current)) {
            let cost = current.costFromStart + current.cost(next)
            // if (!this.cameFrom.has(next)) {
            // if (!this.visited.includes(next)) {
            if (
                next.costFromStart == null
                || cost < next.costFromStart
            ) {
                next.costFromStart = cost
                this.priorityFrontier.enqueue(next, next.distanceToGoal + next.costFromStart)
                this.cameFrom.set(next, current)
            }
        }
    }

    show() {
        for (let rows of this.grids) {
            for (let grid of rows) {
                this.context.fillStyle = '#FFFFFF'

                if (
                    this.frontier.includes(grid)
                    || this.priorityFrontier.includes(grid)
                ) {
                    // 当前边界 green
                    this.context.fillStyle = '#00FF00'
                } else if (this.visited.includes(grid)) {
                    // 已访问过 red
                    this.context.fillStyle = '#FF0000'
                }

                if (grid.obstacle == 1) {
                    // 障碍
                    this.context.fillStyle = '#000000'
                }

                this.context.fillRect(
                    grid.x*this.gridSize,
                    grid.y*this.gridSize,
                    this.gridSize,
                    this.gridSize
                )
            }
        }

        // 路径 blue
        let current = this.current
        while (current != null) {
            this.context.fillStyle = '#0000FF'
            this.context.fillRect(
                current.x*this.gridSize,
                current.y*this.gridSize,
                this.gridSize,
                this.gridSize
            )
            current = this.cameFrom.get(current)
        }

        // 灰色格子框
        this.context.strokeStyle = 'lightgrey'
        this.context.beginPath()
        for (let x = 0; x < this.width; x += this.gridSize) {
            this.context.moveTo(x, 0)
            this.context.lineTo(x, this.height)
        }
        for (let y = 0; y < this.height; y += this.gridSize) {
            this.context.moveTo(0, y)
            this.context.lineTo(this.width, y)
        }
        this.context.stroke()
    }
}

export default Dungeon
