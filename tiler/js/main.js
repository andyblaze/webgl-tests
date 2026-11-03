
import FileInput from "./fileinput.js";
import EndPoint from "./endpoint.js";
import SendButton from "./sendbutton.js";
import Status from "./status.js";
import Canvas from "./canvas.js";
import SourceFile from "./srcfile.js";
import FileLoader from "./file-loader.js";

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


sendButton.input.addEventListener("click", async () => {
    if ( srcFile.isNull() ) return;

    //const endpoint = endpointInput.value.trim();
    if ( !endPoint.url ) {
        status.update("Enter the PHP endpoint URL first.");
        return;
    }

    const formData = new FormData();
    formData.append("image", srcFile.file, srcFile.name);

    sendButton.update(true);
    status.update("Sending image...");

    try {
    const response = await fetch(endPoint.url, {
        method: "POST",
        body: formData
    });

    if (!response.ok) {
        const detail = await response.text();
        throw new Error(`HTTP ${response.status}: ${detail.slice(0, 500)}`);
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("image/")) {
        const detail = await response.text();
        throw new Error(`Expected an image/png response, received "${contentType}". ${detail.slice(0, 300)}`);
    }

    const resultBlob = await response.blob();
    const bitmap = await createImageBitmap(resultBlob);

    destCanvas.setSize(bitmap.width, bitmap.height).clear().draw(bitmap);
    bitmap.close();

    status.update(`Received ${bitmap.width} x ${bitmap.height} image (${resultBlob.size.toLocaleString()} bytes).`);
    } catch (error) {
    status.update(`Request failed: ${error.message}`);
    } finally {
    sendButton.update(srcFile.isNull());
    }
});