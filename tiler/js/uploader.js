export default class Uploader {
    constructor(args) {
        this.src = args.src;
        this.url = args.url;
        this.status = args.status;
        this.tileType = args.tileType;
        this.strength = args.strength;
        this.sendButton = null;
        this.formData = null;
    }
    setButton(b) {
        this.sendButton = b;
    }
    isOk() {
        if ( this.src.isNull() ) return false;

        if ( !this.url ) {
            this.status.update("Enter the PHP endpoint URL first.");
            return false;
        }
        return true;  
    }
    init() {
        this.formData = new FormData();
        this.formData.append(this.tileType.name, this.tileType.value);
        this.formData.append(this.strength.name, this.strength.value);
        this.formData.append('image', this.src.file, this.src.name);        

        this.sendButton.update(true);
        this.status.update("Sending image...");
    }
    async send() {
        return fetch(this.url, {
            method: "POST",
            body: this.formData
        });        
    }
}
