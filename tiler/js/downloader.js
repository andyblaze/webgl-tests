export default class Downloader {
    constructor(obs=[]) {
        this.obsservers = obs;
        this.data = { "img": null, "msg": "" };
        this.button = null;
    }
    notify() {
        for ( const o of this.obsservers )
            o.update(this.data);
    }
    addObservers(o) {
        if ( Array.isArray(o) )
            this.obsservers = o;
        else 
            this.obsservers.push(o);
    }
    setButton(btn) {
        this.button = btn;
    }
    async handle(response) {
        if (!response.ok) {
            const detail = await response.text();
            throw new Error(`HTTP ${response.status}: ${detail.slice(0, 500)}`);
        }

        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("image/")) {
            const detail = await response.text();
            throw new Error(`Expected an image/png response, received "${contentType}". ${detail.slice(0, 300)}`);
        }

        const blob = await response.blob();    
        const bitmap = await createImageBitmap(blob);

        this.data.img = bitmap;
        this.data.msg = `Received ${bitmap.width} x ${bitmap.height} image (${blob.size.toLocaleString()} bytes).`;

        this.notify();

        bitmap.close();
    }
    error(errMsg) {
        this.data.msg = `Request failed: ${errMsg}`;
        this.data.img = null;
        this.notify();        
    }
}
