import { byId } from "./functions.js";

export default class SendButton {
    constructor(id) {
        this.input = byId(id);
        this.uploader = null;
        this.download = null;
    }
    setUploader(u) {
        this.uploader = u;
        this.uploader.setButton(this);
    }
    setDownloader(d) {
        this.download = d;
    }
    update(data) {
        this.input.disabled = data.state;
    }
    async clicked() {
        if ( false === this.uploader.isOk() ) return;
        this.uploader.init();

        try {
            const response = await this.uploader.send();
            this.download.handle(response);

        } catch (error) {
            this.download.error(error.message);
        } finally {
            this.update(this.uploader.src.isNull());
        }
    }
    onclick(func) {
        this.input.addEventListener("click", func);
    }
}
