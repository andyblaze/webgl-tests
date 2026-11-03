export default class FileLoader {
    constructor(input) {
        this.input = input;
        this.obsservers = [];
        this.data = { "img": null, "msg": '', "file": null, "state": false };
    }
    addObservers(o) {
        if ( Array.isArray(o) )
            this.obsservers = o;
        else 
            this.obsservers.push(o);
    }
    checkFile() {
        const file = this.input.getFile();

        if ( false === file ) {
            //status.update("Please choose a PNG file.");
            return false;
        }
        return file;
    }  
    notify() {
        for ( const o of this.obsservers )
            o.update(this.data);
    }
    async loadFile(file) {
        try {        
            const bitmap = await createImageBitmap(file);
            this.data = { 
                "img": bitmap, 
                "msg": `Loaded ${file.name} (${bitmap.width} x ${bitmap.height}).`, 
                "file": file, 
                "state": false 
            };
            this.notify();

            bitmap.close();

        } catch (error) {
            this.data = { 
                "img": null, 
                "msg": `Loaded ${file.name} (${bitmap.width} x ${bitmap.height}).`, 
                "file": null, 
                "state": false 
            };                
            this.notify();
        }       
    }              
    async load() {
        const file = this.checkFile();
        if ( false === file ) return false;

        this.loadFile(file);      
    }
}
