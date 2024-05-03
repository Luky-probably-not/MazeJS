import Maze from "./Maze.ts"


const GenerateMaze = (size : number) : Maze => {
    let laby : Maze
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

GenerateMaze(15).display()
