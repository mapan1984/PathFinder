class Grid {
    constructor(x, y, obstacle) {
        this.x = x
        this.y = y
        this.obstacle = obstacle  // 范围在 0 ~ 1 之间，值为 1 视为不可达

        this.costFromStart = null
        this.distanceToGoal = null

        this.cameFrom = null
    }

    cost(other) {
        return this.obstacle / 2 + other.obstacle / 2
    }

    distance(other) {
        let xDis = Math.abs(this.x - other.x)
        let yDis = Math.abs(this.y - other.y)
        return xDis * xDis + yDis * yDis
    }

    setCostFromStart(start) {

    }

    setDistanceToGoal(goal) {
        this.distanceToGoal = this.distance(goal)
    }
}


export default Grid
