import Case from "./Case.ts"

const Random = (max : number) : number => {
    return Math.floor(Math.random()*max)
}

export default class Maze {

    private _laby : Case[][]
    private length : number
    public constructor(size : number) {
        this.emptyLaby(size)
    }

    public get laby() {
        return this._laby
    }

    public set laby(value) {
        this._laby = value
    }

    private emptyLaby = (size : number) => {
        this._laby = []
        let line : Case[]
        let id = 0
        for (let i = 0; i < size; i++) {
            line = []
            for (let f = 0; f < size; f++) {
                line.push(new Case(id))
                id++
            }
            this._laby.push(line)
        }
        this.length = this._laby.length-1
    }
    public Generation() {
        this.cleanse()
        this.StartEnd()
        const loseID = (keepId,loseId) => {
            for (let i of this.laby) {
                for (let f of i) {
                    if (f.id == loseId) {
                        f.id = keepId
                    }
                }
            }
        }
        const connect = (idLig : number, idCol : number, choice : number) => {
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
            let keepId = Math.min(center.id,dir.id)
            let loseId = Math.max(center.id,dir.id)
            loseID(keepId,loseId)
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
        const checkId = (idLig : number, idCol : number, choice : number) => {
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
            for (let i of this._laby) {
                for (let f of i) {
                    if (f.id != 0) {
                        return true
                    }
                }
            }
            return false
        }
        const checkDirection = (idLig : number, idCol : number, choice : number) => {
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
        let copyLaby : Case[][] = []
        let line : Case []= []
        this._laby.forEach((x) => {
            line = []
            x.forEach((y) => {
                line.push(y)
            })
            copyLaby.push(line)
        })
        let idLig : number, idCol : number, choice : number
        do {
            idLig = Random(this.length+1)
            idCol = Random(this.length+1)
            choice = Random(4)
            while (!checkDirection(idLig,idCol,choice)) {
                choice = Random(4)
            }
            if (!checkId(idLig,idCol,choice)) {
                continue
            } else if (this.laby[idLig][idCol].id == 0) {
                continue
            }
            connect(idLig,idCol,choice)

        } while (checkMaze())

        if (this.Resolve() < this.length*3) {

            this.Generation()
        }
        
    }

    public display() {
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
        const displayLine = (line : Case[]) => {
            let print = ""
            for (let i = 0; i < this.laby.length-1; i++) {
                print += ` ${line[i].name} `
                print += line[i].east ? "│" : " "
            }
            print += ` ${line[line.length-1].name} `
            console.log(`│${print}│`)
        }
        const displayLineID = (line : Case[]) => {
            let print = ""
            for (let i = 0; i < this.laby.length-1; i++) {
                print += ` ${line[i].id} `
                print += line[i].east ? "│" : " "
            }
            print += ` ${line[line.length-1].id} `
            console.log(`│${print}│`)
        }
        const displaySeparator = (index : number) => {
            let here = this.laby[index][0]
            let hereMirror : Case
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
        const cross = (here : Case,hereMirror : Case) => {
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
            //displayLineID(this.laby[i])
            displaySeparator(i)
        }
        displayLine(this.laby[this.length])
        //displayLineID(this.laby[this.length])
        displayBot()
    }

    public StartEnd() {
        this.laby[Random(this.laby.length)][Random(this.laby.length)].name = "A"
        this.laby[Random(this.laby.length)][Random(this.laby.length)].name = "B"
    }

    public cleanse() {
        this.laby.forEach((x) => x.forEach((y) => y.name = " "))
    }

    public Resolve() : number{
        let maze = new Maze(this.length+1)
        maze.laby = this.deepCopy()
        let [xA,yA] = maze.find("A")
        let [xB,yB] = maze.find("B")
        let path = maze.Path(xA,yA) 
        
        let rev = maze.ReversePath(path)
        maze.solve(rev)
        maze.beauty()
        this.laby = maze.laby
        return rev.length
        

    }

    public deepCopy = () : Case[][]=> {
        let maze : Case[][] = []
        let line : Case[]
        for (let i = 0; i < this.laby.length; i++) {
            line = []
            for (let f = 0; f < this.laby.length; f++) {
                line.push(this.laby[i][f])
            }
            maze.push(line)
        }
        return maze
    }
    private find = (letter : string) : number[] => {
        for (let i = 0; i < this.length; i++) {
            for (let f = 0; f < this.length; f++) {
                if (this.laby[i][f].name == letter) {
                    return [i,f]
                }
            }
        }
        return [-1,-1]
    }

    private Path = (x : number,y : number) => {
        const Indice = (maze : number[][], i : number, f : number, index : number) : number[][] => {
            if (maze[i][f] > index+1 ) {
                maze[i][f] = index+1
            }
            return maze
        }
        let chemin : number[][] = []
        let line : number[]
        for (let i of this.laby) {
            line = []
            for (let f of this.laby) {
                line.push(1000)
            }
            chemin.push(line)
        }
        chemin[x][y] = 0
        let index = 0
        let end = false
        while (!end) {
            end = true
            for (let i = 0; i < this.laby.length; i++) {
                for (let f = 0; f < this.laby.length; f++) {
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
    private smaller = (index : number[], indexList : number[][]) : number[] => {
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
    private checkSmall = (path : number[][],x : number,y : number) : number[] => {
        let index : number[]= []
        let indexList : number[][]= []
        if (x > 0 && !this.laby[x][y].north) {
            index.push(path[x-1][y])
            indexList.push([x-1,y])
        }
        if (y > 0 && !this.laby[x][y].west) {
            index.push(path[x][y-1])
            indexList.push([x,y-1])
        }
        if (x < this.laby.length && !this.laby[x][y].south) {
            index.push(path[x+1][y])
            indexList.push([x+1,y])
        }
        if (y < this.laby.length && !this.laby[x][y].east) {
            index.push(path[x][y+1])
            indexList.push([x,y+1])
        }
        return this.smaller(index,indexList)
    }

    private reverse = (l : number[][]) : number[][] => {
        let final : number[][] = []
        for (let i = l.length-1; i > -1; i--) {
            final.push(l[i])
        }
        return final
    }
    private ReversePath = (path : number[][]) => {
        let [xA, yA] = this.find("A")
        let [x, y] = this.find("B")
        let way = [[x,y]]
        while (x != xA || y != yA) {
            [x,y] = this.checkSmall(path,x,y)
            way.push([x,y])
        }
        return this.reverse(way)
    }
    private solve = (path : number[][]) => {
        let index = 0
        for (let i of path) {
            this.laby[i[0]][i[1]].id = index
            index++
        }
    }
    private beauty = () => {
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

const Display = (list : any[][]) => {
    for (let i of list) {
        console.log(i.join(" "))
    }
}