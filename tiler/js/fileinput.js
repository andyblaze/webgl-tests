import { byId } from "./functions.js";

export default class FileInput {
    constructor(id) {
        this.input = byId(id);
    }
    isValid(f) {
        return (f.type === "image/png" && f.name.toLowerCase().endsWith(".png"));
    }
    getFile() {
        const file = this.input.files[0];
        if ( !file ) return false;    
        if ( false === this.isValid(file) ) {
            this.input.value = "";
            return false;
        }  
        return file;  
    }
    onchange(func) {
        this.input.addEventListener("change", func);
    }
}
