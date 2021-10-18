const canvas = document.getElementById('pewpewgame');
const ctx = canvas.getContext('2d');
let cannonPos = {x: 0, y: 0}
let ciblePos = {x: 0, y: 100}
let cibleRadius = 35
let cannonMoveSpeed = 10
let bulletMoveSpeed = 15
let lastBullet = Date.now()
let keys = []
let bullets = []
let score = 0
let isWin = false
let isStart = false
let lastDateChrono = null
let startDateChrono = null

canvas.width = document.body.clientWidth
canvas.height = document.body.clientHeight

let init = () => {
    cannonPos = {x: canvas.width / 2, y: canvas.height}
    isStart = true
    lastDateChrono = Date.now()
    startDateChrono = Date.now()

    placeCible()
    draw()
}

let startGame = () => {
    isStartGui(false)
    init()
}

let restartGame = () => {
    isWinGui(false)
    score = 0
    isWin = false
    isStart = true
    placeCible()
    cannonPos = {x: canvas.width / 2, y: canvas.height}
    lastDateChrono = Date.now()
    startDateChrono = Date.now()
}

let clear = () => {
    ctx.clearRect(0,0, canvas.width, canvas.height)
}

let draw = () => {
    let now = Date.now()

    clear()
    checkWin()

    if (!isWin && isStart) {
        lastDateChrono = Date.now()
        if (keys[37] && (cannonPos.x - cannonMoveSpeed - 35 > 0)) cannonPos.x -= cannonMoveSpeed
        if (keys[39] && (cannonPos.x + cannonMoveSpeed + 35 < canvas.width)) cannonPos.x += cannonMoveSpeed
        if (keys[32] && (now - lastBullet > 500)) {
            lastBullet = Date.now()
            bullets.push({x: cannonPos.x, y: cannonPos.y - 65})
        }

        bullets.forEach(pos => {
            pos.y -= bulletMoveSpeed

            if (pos.y >= 0) {
                drawFire(pos)
            } else {
                bullets = bullets.filter(value => value.y !== pos.y)
            }
        })

        drawCannon(cannonPos)
        drawSible(ciblePos)
        drawScore()
        drawChrono()
    }

    requestAnimationFrame(draw)
}

let drawFire = ({x,y}) => {
    ctx.fillStyle = "#7a7a7a"
    ctx.beginPath()
    ctx.arc(x, y, 4,0,2 * Math.PI)
    ctx.rect(x - 4, y,8,10)
    ctx.fill()

    if (y <= ciblePos.y && ciblePos.x - cibleRadius <= x && ciblePos.x + cibleRadius >= x) {
        bullets = bullets.filter(value => value.y !== y)
        score++
        placeCible()
    }
}

let drawCannon = ({x, y}) => {
    ctx.fillStyle = "#597d17"
    ctx.beginPath()
    ctx.arc(x, y, 35,0,2 * Math.PI)
    ctx.rect(x - 7.5, y - 65,15,35)
    ctx.fill()
}

let drawSible = ({x, y}) => {
    ctx.fillStyle = "#c6c6c6"
    ctx.beginPath()
    ctx.arc(x, y, cibleRadius,0,2 * Math.PI)
    ctx.fill()
    ctx.fillStyle = "#a5a5a5"
    ctx.beginPath()
    ctx.arc(x, y, 25,0,2 * Math.PI)
    ctx.fill()
    ctx.fillStyle = "#757575"
    ctx.beginPath()
    ctx.arc(x, y, 15,0,2 * Math.PI)
    ctx.fill()
}

let drawScore = () => {
    ctx.font = "20px Arial"
    ctx.textAlign = "end"
    ctx.fillText("Score : " + score, canvas.width - 20, 25)
}

let drawChrono = () => {
    ctx.font = "20px Arial"
    ctx.textAlign = "end"
    ctx.fillText(getChrono(), canvas.width - 20, 55)
}

let getChrono = () => {
    return new Date(lastDateChrono - startDateChrono).toISOString().slice(11, -1);
}

let placeCible = () => {
    ciblePos.x = Math.floor(Math.random() * (canvas.width - cibleRadius*2) + cibleRadius)
}

let checkWin = () => {
    isWin = score >= 10

    if (isWin) {
        isStart = false
        isWinGui(true)
    }
}

let isWinGui = (active) => {
    let winModal = document.getElementById("winModal")
    let finishTime = document.getElementById("finishTime")

    finishTime.innerText = getChrono()

    if (active) {
        isActiveModal(winModal, active)
        winModal.querySelector(".start-button").addEventListener("click", restartGame)
    } else {
        isActiveModal(winModal, active)
        winModal.querySelector(".start-button").removeEventListener("click", restartGame)
    }
}

let isStartGui = (active) => {
    let startModal = document.getElementById("startModal")

    if (active) {
        isActiveModal(startModal, active)
        startModal.querySelector(".start-button").addEventListener("click", startGame)
    } else {
        isActiveModal(startModal, active)
        startModal.querySelector(".start-button").removeEventListener("click", startGame)
    }
}

let isActiveModal = (modalElement, active) => {
    modalElement.style.zIndex = active ? "999" : "-1"
    modalElement.style.opacity = active ? "1" : "0"
}

isStartGui(true)

window.addEventListener("keydown", (event) => keys[event.keyCode] = true);
window.addEventListener("keyup", (event) => keys[event.keyCode] = false);
window.addEventListener("resize", (event) => {
    canvas.width = document.body.clientWidth
    canvas.height = document.body.clientHeight
});