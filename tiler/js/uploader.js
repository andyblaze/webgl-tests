export default class Uploader {
    constructor(src, dest, stat, tt) {
        this.src = src;
        this.dest = dest;
        this.status = stat;
        this.tileType = tt;
        this.sendButton = null;
        this.formData = null;
    }
    setButton(b) {
        this.sendButton = b;
    }
    isOk() {
        if ( this.src.isNull() ) return false;

        if ( !this.dest.url ) {
            this.status.update("Enter the PHP endpoint URL first.");
            return false;
        }
        return true;  
    }
    init() {
        this.formData = new FormData();
        this.formData.append("image", this.src.file, this.src.name);
        this.formData.append("function", this.tileType.value);

        this.sendButton.update(true);
        this.status.update("Sending image...");
    }
    async send() {
        return fetch(this.dest.url, {
            method: "POST",
            body: this.formData
        });        
    }
}
