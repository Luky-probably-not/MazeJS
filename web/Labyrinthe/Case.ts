export default class Case {
    private _north = true
    private _south = true
    private _west = true
    private _east = true
    private _id : number
    public name : string = " "
    public constructor(id : number) {
        this._id = id
    }

    public get north() {
        return this._north
    }
    public set north(value : boolean) {
        this._north = value
    }

    public get east() {
        return this._east
    }
    public set east(value : boolean) {
        this._east = value
    }

    public get west() {
        return this._west
    }
    public set west(value : boolean) {
        this._west = value
    }

    public get south() {
        return this._south
    }
    public set south(value : boolean) {
        this._south = value
    }
    public get id() {
        return this._id
    }

    public set id(value : number) {
        this._id = value
    }
    
    toJSON(): any {
        return {
            north: this._north,
            south: this._south,
            west: this._west,
            east: this._east,
            id: this._id,
            name: this.name
        };
    }
}