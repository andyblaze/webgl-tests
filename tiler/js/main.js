
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

function checkOk() {
    if ( srcFile.isNull() ) return false;

    //const endpoint = endpointInput.value.trim();
    if ( !endPoint.url ) {
        status.update("Enter the PHP endpoint URL first.");
        return false;
    }
    return true;  
}

function prepForm() {
    const formData = new FormData();
    formData.append("image", srcFile.file, srcFile.name);

    sendButton.update(true);
    status.update("Sending image...");   
    return formData; 
}

async function sendForm(url, data) {
    return fetch(url, {
        method: "POST",
        body: data
    });
}

sendButton.input.addEventListener("click", async () => {
    if ( false === checkOk() ) return;

    const formData = prepForm();

    try {
    const response = await sendForm(endPoint.url, formData);
    console.log(response);

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
    console.log(blob, bitmap);

    destCanvas.update({ img: bitmap } );
    

    status.update(`Received ${bitmap.width} x ${bitmap.height} image (${blob.size.toLocaleString()} bytes).`);
    bitmap.close();
    } catch (error) {
    status.update(`Request failed: ${error.message}`);
    } finally {
    sendButton.update(srcFile.isNull());
    }
});