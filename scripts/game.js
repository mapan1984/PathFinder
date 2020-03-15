class Game {
    constructor(fps=5) {
        this.fps = fps
        this.runing = false
        this.actions = {}

        this.lastDrawTime = null
        this.fpsInterval = 1000 / this.fps

        this.draw()
    }

    setFps(fps) {
        this.fps = fps
        this.fpsInterval = 1000 / this.fps
    }

    registerAction(key, action) {
        this.actions[key] = action
    }

    listen() {
        window.addEventListener('keydown', (event) => {
            let action = this.actions[event.key]
            action && action()
        })
    }

    draw() { }

    update() { }

    reset() {}

    start() {
        if (this.runing) {
            return
        }

        this.runing = true

        this.loop()
    }

    stop() {
        if (!this.runing) {
            return
        }

        if (this.__requestAnimationFrameID) {
            cancelAnimationFrame(this.__requestAnimationFrameID)
        }
        if (this.__intervalID) {
            clearInterval(this.__intervalID)
        }
        if (this.__timeoutID) {
            clearTimeout(this.__timeoutID)
        }

        this.runing = false
    }

    taggle() {
        if (this.runing) {
            this.stop()
        } else {
            this.start()
        }
    }

    loop(timestamp) {
        if (!this.lastDrawTime) {
            this.lastDrawTime = timestamp
        }

        let elapsed = timestamp - this.lastDrawTime

        try {
            if (elapsed > this.fpsInterval) {
                this.lastDrawTime = timestamp
                this.update()
                this.draw()
            }
            this.__requestAnimationFrameID = requestAnimationFrame(this.loop.bind(this))
        } catch(e) {
            console.error(e.stack)
            this.stop()
        }
    }

    setIntervalLoop() {
        this.__intervalID = setInterval(() => {
            try {
                this.update()
                this.draw()
            } catch(e) {
                console.error(e.stack)
                this.stop()
            }
        }, this.fpsInterval)
    }

    setTimeoutLoop() {
        this.__timeoutID = setTimeout(() => {
            try {
                this.update()
                this.draw()

                this.__timeoutID = setTimeout(this.setTimeoutLoop.bind(this), this.fpsInterval)
            } catch(e) {
                console.error(e.stack)
                this.stop()
            }
        }, this.fpsInterval)
    }
}

export default Game
