export default class Case {
    north = true
    south = true
    east = true
    west = true
    name = " "

    constructor(id) {
        this.id = id
    }
    toJSON = () => {
        return {
            west: this.west,
            south: this.south,
            east : this.east ,
            south: this.south,
            id: this.id,
            name: this.name
        }
    }

}