import Case from "./Case.js";

const Random = (max) => {
    return Math.floor(Math.random()*max)
}

export default class Maze {
    laby
    length
    size

    constructor(size) {
        this.size = size
        this.emptyLaby()
    }

    toJSON = () => {
        return {
            length: this.length,
            laby: this.laby.map(row => row.map(cell => cell.toJSON()))
        }
    }
    emptyLaby = () => {
        this.laby = []
        let line
        let id = 0
        for (let i = 0; i < this.size; i++) {
            line = []
            for (let f = 0; f < this.size; f++) {
                line.push(new Case(id))
                id++
            }
            this.laby.push(line)
        }
        this.length = this.size-1
    }
    Generation = () => {
        this.cleanse()

        this.StartEnd()


        const connect = (idLig, idCol, choice) => {
            const loseID = (kId,lId) => {
                for (let i of this.laby) {
                    for (let f of i) {
                        if (f.id == lId) {
                            f.id = kId
                        }
                    }
                }
            }
            let center = this.laby[idLig][idCol]
            let NS = 0
            let WE = 0
            let dir = new Case(0)
            let direction = ""
            switch (choice) {
                case 0:
                    dir = this.laby[idLig-1][idCol]
                    NS = -1
                    direction = "n"
                    break
                case 1:
                    dir = this.laby[idLig][idCol+1]
                    WE = 1
                    direction = "e"
                    break
                case 2:
                    dir = this.laby[idLig+1][idCol]
                    NS = 1
                    direction = "s"
                    break
                case 3:
                    dir = this.laby[idLig][idCol-1]
                    WE = -1
                    direction = "w"
                    break
            }
            let kId = Math.min(center.id,dir.id)
            let lId = Math.max(center.id,dir.id)
            loseID(kId,lId)
            switch (direction) {
                case "n":
                    center.north = false
                    dir.south = false
                    break
                case "e":
                    center.east = false
                    dir.west = false
                    break
                case "s":
                    center.south = false
                    dir.north = false
                    break
                case "w":
                    center.west = false
                    dir.east = false
            }
            this.laby[idLig][idCol] = center
            this.laby[idLig+NS][idCol+WE] = dir
        }

        const checkId = (idLig, idCol, choice) => {
            let dir = new Case(0)
            switch (choice) {
                case 0:
                    dir = this.laby[idLig-1][idCol]
                    break
                case 1:
                    dir = this.laby[idLig][idCol+1]
                    break
                case 2:
                    dir = this.laby[idLig+1][idCol]
                    break
                case 3:
                    dir = this.laby[idLig][idCol-1]
                    break
            }
            return !(dir.id == this.laby[idLig][idCol].id)
        }

        const checkMaze = () => {
            for (let i of this.laby) {
                for (let f of i) {
                    if (f.id != 0) {
                        return true
                    }
                }
            }
            return false
        }

        const checkDirection = (idLig, idCol, choice) => {
            switch (true) {
                case idLig == 0 && choice == 0:
                    return false
                case idLig == this.length && choice == 2:
                    return false
                case idCol == 0 && choice == 3:
                    return false
                case idCol == this.length && choice == 1:
                    return false
                default:
                    return true
            }
        }
        let idLig,idCol,choice
        while (checkMaze()) {
            idLig = Random(this.size)
            idCol = Random(this.size)
            do {
                choice = Random(4)
            } while (!checkDirection(idLig,idCol,choice))
            if (!checkId(idLig,idCol,choice)) {
                continue
            } else if (this.laby[idLig][idCol].id == 0) {
                continue
            }
            connect(idLig,idCol,choice)
        }
        if (this.Resolve() <= this.size*3) {
            this.Generation()
        }

    }

    display = () => {
        const displayTop = () => {
            let line = ""
            for (let i = 0; i < this.length;i++) {
                line += "───"
                line += this.laby[0][i].east ? "┬" : "─"
            }
            console.log(`┌${line}───┐`)
        }
        const displayBot = () => {
            let line = ""
            for (let i = 0; i < this.length;i++) {
                line += "───"
                line += this.laby[this.length][i].east ? "┴" : "─"
            }
            console.log(`└${line}───┘`)
        }
        const displayName = (line) => {
            let print = ""
            for (let i = 0; i < this.size-1; i++) {
                print += ` ${line[i].name} `
                print += line[i].east ? "│" : " "
            }
            print += ` ${line[line.length-1].name} `
            console.log(`│${print}│`)
        }
        const displayLine = (line) => {
            let print = ""
            for (let i = 0; i < this.size-1; i++) {
                print += line[i].name == " " ? "   " : ` ${line[i].name} `
                print += line[i].east ? "│" : " "
            }
            print += line[line.length-1].name == " " ? "   " : ` ${line[line.length-1].name} `
            console.log(`│${print}│`)
        }
        const displaySeparator = (index) => {
            let here = this.laby[index][0]
            let hereMirror
            let line = here.south ? "├" : "│"
            for (let i = 0; i < this.length; i++) {
                here = this.laby[index][i]
                hereMirror = this.laby[index+1][i+1]
                line += here.south ? "───" : "   "
                line += cross(here,hereMirror)
            }
            line += this.laby[index][this.length].south ? "───┤" : "   │"
            console.log(line)
        }
        const cross = (here,hereMirror) => {
            if (!here.south && !here.east) return hereMirror.west && hereMirror.north ? "┌" : " "   
            if (!here.south && hereMirror.west) return hereMirror.north ? "├" : "│"
            if (!here.south) return hereMirror.north ? "└" : " "  
            if (here.east && hereMirror.west) return hereMirror.north ? "┼" : "┤"
            if (here.east) return hereMirror.north ? "┴" : "┘"
            if (hereMirror.west) return hereMirror.north ? "┬" : "┐"
            return hereMirror.north ? "─" : " "
    
        }

        displayTop()
        for (let i = 0; i < this.length; i++) {
            displayLine(this.laby[i])
            //displayName(this.laby[i])
            displaySeparator(i)
        }
        displayLine(this.laby[this.length])
        //displayName(this.laby[this.length])
        displayBot()
    }

    Resolve = () => {
        let maze = new Maze(this.size)
        maze.laby = this.deepCopy()
        let [xA,yA] = maze.find("A")
        let [xB,yB] = maze.find("B")
        let path = maze.Path(xA,yA) 
        
        let rev = maze.ReversePath(path)
        this.rev = rev
        maze.solve(rev)
        maze.beauty()
        this.laby = maze.laby
        return rev.length
    }

    StartEnd = () => {
        this.laby[Random(this.size)][Random(this.size)].name = "A"
        this.laby[Random(this.size)][Random(this.size)].name = "B"
        this.laby[Random(this.size)][Random(this.size)].playerLocation = "P"
    }

    cleanse = () => {
        for (let i of this.laby) {
            for (let f of i) {
                f.name = " "
                f.playerLocation = ""
            }
        }
    }
    deepCopy = () => {
        let maze = []
        let line
        for (let i of this.laby) {
            line = []
            for (let f of i) {
                line.push(f)
            }
            maze.push(line)
            }
        return maze
    }

    find = (letter) => {
        for (let i = 0; i < this.length; i++) {
            for (let f = 0; f < this.length; f++) {
                if (this.laby[i][f].name == letter) {
                    return [i,f]
                }
            }
        }
        return [-1,-1]
    }

    Path = (xA, yA) => {
        const Indice = (maze, i, f,index) => {
            if (maze[i][f] > index+1 ) {
                maze[i][f] = index+1
            }
            return maze
        }

        let chemin = []
        let line
        for (let i of this.laby) {
            line = []
            for (let f of this.laby) {
                line.push(1000)
            }
            chemin.push(line)
        }
        chemin[xA][yA] = 0
        let index = 0
        let end = false
        while (!end) {
            end = true
            for (let i = 0; i < this.size; i++) {
                for (let f = 0; f < this.size; f++) {
                    if (chemin[i][f] == index) {
                        if (!this.laby[i][f].north) {
                            chemin = Indice(chemin,i-1,f,index)
                        }
                        if (!this.laby[i][f].east) {
                            chemin = Indice(chemin,i,f+1,index)
                        }
                        if (!this.laby[i][f].south) {
                            chemin = Indice(chemin,i+1,f,index)
                        }
                        if (!this.laby[i][f].west) {
                            chemin = Indice(chemin,i,f-1,index)
                        }
                        end = false
                    }
                }
            }
            index++
        }
        return chemin
    }

    smaller = (index, indexList) => {
        let min = 1000
        let id = indexList[0]
        for (let i = 0; i < index.length; i++) {
            if (min > index[i]) {
                min = index[i]
                id = indexList[i]
            }
        }
        return id
    }

    checkSmall = (path,x,y) => {
        let index = []
        let indexList = []
        if (x > 0 && !this.laby[x][y].north) {
            index.push(path[x-1][y])
            indexList.push([x-1,y])
        }
        if (y > 0 && !this.laby[x][y].west) {
            index.push(path[x][y-1])
            indexList.push([x,y-1])
        }
        if (x < this.size && !this.laby[x][y].south) {
            index.push(path[x+1][y])
            indexList.push([x+1,y])
        }
        if (y < this.size && !this.laby[x][y].east) {
            index.push(path[x][y+1])
            indexList.push([x,y+1])
        }
        return this.smaller(index,indexList)
    }

    reverse = (l) => {
        let result = []
        for (let i = l.length-1; i> -1; i--) {
            result.push(l[i])
        }
        return result
    }

    ReversePath = (path) => {
        let [xA, yA] = this.find("A")
        let [x, y] = this.find("B")
        let way = [[x,y]]
        while (x != xA || y != yA) {
            [x,y] = this.checkSmall(path,x,y)
            way.push([x,y])
        }
        return this.reverse(way)
    }

    solve = (path) => {
        let index = 0
        for (let i of path) {
            this.laby[i[0]][i[1]].id = index
            index++
        }
    
    }

    beauty = () => {
        let [xA, yA] = this.find("A")
        let [xB, yB] = this.find("B")
        for (let i of this.laby) {
            for (let f of i) {
                if (f.id != 0) {
                    f.name = "1"
                }
            }
        }
        this.laby[xA][yA].name = "A"
        this.laby[xB][yB].name = "B"
    }
}

export const GenerationMaze = (size) => {
    let laby
    do {
        laby = new Maze(size)
        try {
            laby.Generation()
        } catch (e) {
            continue
        }
        break
    } while (true)
    return laby
}

