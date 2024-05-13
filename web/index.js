import { default as Maze } from "./Labyrinthe/Maze.js"
import { GenerationMaze } from "./Labyrinthe/Maze.js"

let length
let cellSize
let wallSize
let xP,yP
let maze

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

const canvas = document.querySelector("canvas")

const ctx = canvas.getContext("2d")

const Displaymaze = () => {
    for (let i = 0; i < maze.size; i++) {
        for (let f = 0; f < maze.size; f++) {
            drawCell(f,i,maze.laby[i][f])
        }
    }
    StartEnd(maze)
}

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

const cleanCell = (x,y) => {
    ctx.clearRect(x,y,cellSize-wallSize,cellSize-wallSize)
}



const Start = (difficulty) => {
    length = Difficulty[`length${difficulty}`]
    maze = GenerationMaze(length)
    cellSize = Difficulty[`cellSize${difficulty}`]
    wallSize = Difficulty[`wallSize${difficulty}`]
    canvas.width = (cellSize+1) * length
    canvas.height = (cellSize+1) * length
    Displaymaze();
}

Start("Hard");