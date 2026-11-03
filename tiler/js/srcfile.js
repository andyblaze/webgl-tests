export default class SourceFile {
    constructor() {
        this.file = null;
        this.name = "";
    }
    isNull() {
        return (null === this.file);
    }
    setNull() {
        this.file = null;
    }
    setFile(f) {
        this.file = f;
        this.name = f.name;
    }
    update(data) {
        if ( null === data.file )
            this.setNull();
        else 
            this.setFile(data.file);
    }
}
