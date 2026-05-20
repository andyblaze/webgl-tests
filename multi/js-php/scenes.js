class Scenes {
    constructor() {
        this.indices = [$$indices$$]; 
        this.index = 0;
        this.data = {$$scenes$$};
    }
    current() {
        const idx = this.indices[this.index];
        return this.data[idx];
    }
    next() {
        if ( this.index + 1 >= this.indices.length )
            this.index = -1;
        this.index++;
        const idx = this.indices[this.index];
        return this.data[idx];
    }
    rand() {
        
    }
}