export default class Observable {
    constructor() {
        this.obsservers = [];
        this.data = {};
    }
    addObservers(o) {
        if ( Array.isArray(o) )
            this.obsservers = o;
        else 
            this.obsservers.push(o);
    } 
    notify() {
        for ( const o of this.obsservers )
            o.update(this.data);
    }
}