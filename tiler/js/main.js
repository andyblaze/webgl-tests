
import FileInput from "./fileinput.js";
import EndPoint from "./endpoint.js";
import SendButton from "./sendbutton.js";
import Status from "./status.js";
import Canvas from "./canvas.js";
import SourceFile from "./srcfile.js";
import FileLoader from "./file-loader.js";
import Uploader from "./uploader.js";

const fileInput = new FileInput("fileInput");
const endPoint = new EndPoint("endpoint");
const sendButton = new SendButton("sendButton");
const status = new Status("status");

const srcCanvas = new Canvas("sourceCanvas");
const destCanvas = new Canvas("resultCanvas");

const srcFile = new SourceFile();

const loader = new FileLoader(fileInput);
loader.addObservers([srcCanvas, srcFile, sendButton, status]);

fileInput.onchange((event) => loader.load(event));

const uploader = new Uploader(srcFile, endPoint, status, sendButton);

sendButton.input.addEventListener("click", async () => {
    if ( false === uploader.isOk() ) return;
    uploader.init();

    const data = { "img": null, "msg": "" };
    const obs = [destCanvas, status];

    try {
        const response = await uploader.send();

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

        data.img = bitmap;
        data.msg = `Received ${bitmap.width} x ${bitmap.height} image (${blob.size.toLocaleString()} bytes).`;

        for ( const o of obs )
            o.update(data);

        bitmap.close();

    } catch (error) {
        data.msg = `Request failed: ${error.message}`;
        data.img = null;
        status.update(data);
        destCanvas.update(data);
    } finally {
        sendButton.update(srcFile.isNull());
    }
});