import { default as Maze } from "./Labyrinthe/Maze.js"
import { GenerationMaze } from "./Labyrinthe/Maze.js"


const Difficulty = {
    lengthEasy : 10,
    lengthMid: 15,
    lengthHard: 20,
    cellSizeEasy: 84,
    cellSizeMid: 56,
    cellSizeHard: 42,
    wallSizeEasy:5,
    wallSizeMid:4,
    wallSizeHard:3,
}

let length,cellSize,wallSize,maze,score,difficultyChoice,dateStart, finish
const canvas = document.querySelector("canvas")

const ctx = canvas.getContext("2d")

const drawCell = (xCord,yCord,cell) => {
    ctx.strokeStyle = "black"
    let x = xCord * cellSize
    let y = yCord * cellSize
    if (cell.north) {
        for (let i = 0; i < wallSize; i++) {
            ctx.beginPath()
            ctx.moveTo(x+i,y+i)
            ctx.lineTo(x+i+cellSize,y+i)
            ctx.stroke()
        }
    }
    if (cell.south) {
        for (let i = 0; i < wallSize; i++) {
            ctx.beginPath()
            ctx.moveTo(x+i,y+i+cellSize)
            ctx.lineTo(x+i+cellSize,y+i+cellSize)
            ctx.stroke()
        }
    }
    if (cell.east) {
        for (let i = 0; i < wallSize; i++) {
            ctx.beginPath()
            ctx.moveTo(x+i+cellSize,y+i)
            ctx.lineTo(x+i+cellSize,y+i+cellSize)
            ctx.stroke()
        }
    }
    if (cell.west) {
        for (let i = 0; i < wallSize; i++) {
            ctx.beginPath()
            ctx.moveTo(x+i,y+i)
            ctx.lineTo(x+i,y+i+cellSize)
            ctx.stroke()
        }
    }
}

const cleanCell = (x,y) => {
    ctx.clearRect(x,y,cellSize-wallSize,cellSize-wallSize)
}

const StartEnd = () => {
    let [yA,xA] = maze.find("A")
    xA = xA * cellSize+wallSize
    yA = yA * cellSize+wallSize
    cleanCell(xA,yA)
    let [yB,xB] = maze.find("B")
    xB = xB * cellSize+wallSize
    yB = yB * cellSize+wallSize
    cleanCell(xB,yB)
    for (let i = 0; i < cellSize-wallSize; i++) {
        ctx.strokeStyle = "green"
        ctx.beginPath()
        ctx.moveTo(xA,yA+i)
        ctx.lineTo(xA+cellSize-wallSize,yA+i)
        ctx.stroke()
        ctx.strokeStyle = "red"
        ctx.beginPath()
        ctx.moveTo(xB,yB+i)
        ctx.lineTo(xB+cellSize-wallSize,yB+i)
        ctx.stroke()
    }

}

const Path = () => {
    const drawUp = (xCord,yCord) => {
        let x = xCord * cellSize + cellSize/2 - 1
        let y = yCord * cellSize + cellSize/2 - 1
        for (let i = 0; i < wallSize; i++) {
            ctx.beginPath()
            ctx.moveTo(x+i,y+i)
            ctx.lineTo(x+i,y+i-cellSize)
            ctx.stroke()
        }
    }
    const drawDown = (xCord,yCord) => {
        let x = xCord * cellSize + cellSize/2 - 1
        let y = yCord * cellSize + cellSize/2 - 1
        for (let i = 0; i < wallSize; i++) {
            ctx.beginPath()
            ctx.moveTo(x+i,y+i)
            ctx.lineTo(x+i,y+i+cellSize)
            ctx.stroke()
        }
    }
    const drawLeft = (xCord,yCord) => {
        let x = xCord * cellSize + cellSize/2 - 1
        let y = yCord * cellSize + cellSize/2 - 1
        for (let i = 0; i < wallSize; i++) {
            ctx.beginPath()
            ctx.moveTo(x+i,y+i)
            ctx.lineTo(x+i-cellSize,y+i)
            ctx.stroke()
        }
    }
    const drawRight = (xCord,yCord) => {
        let x = xCord * cellSize + cellSize/2 - 1
        let y = yCord * cellSize + cellSize/2 - 1
        for (let i = 0; i < wallSize; i++) {
            ctx.beginPath()
            ctx.moveTo(x+i,y+i)
            ctx.lineTo(x+i+cellSize,y+i)
            ctx.stroke()
        }
    }
    ctx.strokeStyle = "blue"
    let chemin = maze.rev
    let [yA,xA] = chemin[0]
    for (let i of chemin.slice(1)) {
        let [yB,xB] = i
        if (xB == xA) {
            if (yB > yA) {
                drawUp(xB,yB)
            } else {
                drawDown(xB,yB)
            }
        } else if (yB == yA) {
            if (xB < xA) {
                drawRight(xB,yB)
            } else {
                drawLeft(xB,yB)
            }
        }
        xA = xB, yA = yB
    }

    
}

const Displaymaze = () => {
    ctx.clearRect(0,0,canvas.width,canvas.height)
    for (let i = 0; i < maze.size; i++) {
        for (let f = 0; f < maze.size; f++) {
            drawCell(f,i,maze.laby[i][f])
        }
    }
    StartEnd(maze)
    drawPlayer()
}

const DisplaySolution = () => {
    ctx.stroke()
    for (let i = 0; i < maze.size; i++) {
        for (let f = 0; f < maze.size; f++) {
            drawCell(f,i,maze.laby[i][f])
        }
    }
    Path()
    StartEnd()
}


const findPlayer = () => {
    for (let i = 0; i < maze.size; i++) {
        for (let f = 0; f < maze.size; f++) {
            if (maze.laby[i][f].playerLocation == "P") {
                return [i,f]
            }
        }
    }
    return [-1,-1]
}
const drawPlayer = () => {
    let [yP,xP] = findPlayer()
    xP = xP * cellSize + wallSize/2
    yP = yP * cellSize + wallSize/2
    ctx.strokeStyle = "blue"
    ctx.moveTo(xP,xP)
    ctx.beginPath()
    ctx.arc(xP + cellSize/2,yP + cellSize/2,cellSize/3,0,Math.PI*2)
    ctx.fillStyle = "blue"
    ctx.fill()
    ctx.stroke()
}

const Moving = (input) => {

    if (checkWin()) {
        document.getElementById("winMessage").style.display = "block";
        return;
    }

    const findPlayer = () => {
        for (let i = 0; i < maze.size; i++) {
            for (let f = 0; f < maze.size; f++) {
                if (maze.laby[i][f].playerLocation == "P") {
                    return [i,f]
                }
            }
        }
        return [-1,-1]
    }
    const check = (input) => {
        let [xP,yP] = findPlayer()
        if (maze.laby[xP][yP].north && input == "ArrowUp") {
            return true
        } else if (maze.laby[xP][yP].east && input == "ArrowRight") {
            return true
        } else if (maze.laby[xP][yP].south && input == "ArrowDown") {
            return true
        } else if (maze.laby[xP][yP].west && input == "ArrowLeft") {
            return true
        }
        return false
    }


    const move = (input,player) => {
        let NS = 0 
        let WE = 0
        let [xP,yP] = player
        if (input == "ArrowUp") {
            NS = -1
            maze.laby[xP][yP].playerLocation = ""
            cleanCell(yP*cellSize+wallSize,xP*cellSize+wallSize)
        } else if (input == "ArrowDown") {
            NS = 1
            maze.laby[xP][yP].playerLocation = ""
            cleanCell(yP*cellSize+wallSize,xP*cellSize+wallSize)
        } else if (input == "ArrowLeft") {
            WE = -1
            maze.laby[xP][yP].playerLocation = ""
            cleanCell(yP*cellSize+wallSize,xP*cellSize+wallSize)
        } else if (input == "ArrowRight") {
            console.log("Hello")
            WE = 1
            maze.laby[xP][yP].playerLocation = ""
            cleanCell(yP*cellSize+wallSize,xP*cellSize+wallSize)
        }
        maze.laby[xP+NS][yP+WE].playerLocation = "P"
    }
    if (check(input)) {
        return
    }
    score++
    move(input,findPlayer())
    if (checkWin()) {
        
        finish = false
        document.getElementById("winMessage").classList.add("show");
    }
}   

const checkWin = () => {
    let [xP, yP] = findPlayer();
    return maze.laby[xP][yP].name == "B"
}




document.onkeydown = (e) => {
    if (e.key == "Enter") {
        DisplaySolution()
    } else if (e.key.includes("Arrow")) {

        Moving(e.key)
        Displaymaze()
    }
}
const Start = (difficulty) => {
    finish = true
    score = 0
    length = Difficulty[`length${difficulty}`]
    maze = GenerationMaze(length)
    cellSize = Difficulty[`cellSize${difficulty}`]
    wallSize = Difficulty[`wallSize${difficulty}`]
    canvas.width = (cellSize+1) * length
    canvas.height = (cellSize+1) * length
    let [xA,yA] = maze.find("A")
    maze.laby[xA][yA].playerLocation = "P"
    Displaymaze()
    dateStart = Date.now()
    setInterval(() => {
        if (finish) {
           let diff = Date.now() - dateStart
           let secondes = Math.floor(diff/1000)
           let milliSecondes = Math.floor(diff/10)-secondes*100
           document.getElementById("timer").innerHTML = `${secondes}.${milliSecondes}`}
    },10)
}

document.getElementById("button").addEventListener("click", () => {
    var e = document.getElementById("diffSelect");
    difficultyChoice = e.options[e.selectedIndex].value;
    console.log(difficultyChoice)
    Start(difficultyChoice);
});

document.getElementById("replayButton").addEventListener("click", () => {
    document.getElementById("winMessage").classList.remove("show");
    var e = document.getElementById("diffSelect");
    difficultyChoice = e.options[e.selectedIndex].value;
    Start(difficultyChoice);
});