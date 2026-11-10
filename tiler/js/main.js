
import FileInput from "./fileinput.js";
import EndPoint from "./endpoint.js";
import SendButton from "./sendbutton.js";
import Status from "./status.js";
import Canvas from "./canvas.js";
import SourceFile from "./srcfile.js";
import FileLoader from "./file-loader.js";
import Uploader from "./uploader.js";
import Downloader from "./downloader.js";
import ThreeScene from "./three-scene.js"
import * as THREE from "three";
import StdInput from "./std-input.js";

const tileType = new StdInput("tileType");
tileType.onchange((event) => tileType.change(event));

const strength = new StdInput("strength");
strength.onchange((event) => strength.change(event));

const fileInput = new FileInput("fileInput");
const endPoint = new EndPoint("endpoint");
const status = new Status("status");

const srcCanvas = new Canvas("sourceCanvas");
const destCanvas = new Canvas("resultCanvas");

const srcFile = new SourceFile();

const sendButton = new SendButton("sendButton");

const loader = new FileLoader(fileInput);
loader.addObservers([srcCanvas, srcFile, sendButton, status]);

fileInput.onchange((event) => loader.load(event));

const uploadData = {
    "src": srcFile, "status": status, "url": endPoint.url, 
    "tileType": tileType, "strength": strength
};
sendButton.setUploader(new Uploader(uploadData));
sendButton.setDownloader(new Downloader([destCanvas, status]));

sendButton.onclick((event) => sendButton.clicked(event));

const threeScene = new ThreeScene(THREE, "three-wrap");

destCanvas.ondraw = function() {
    threeScene.setTexture(THREE, destCanvas.canvas);
};

function animate() {
    requestAnimationFrame(animate);
    threeScene.rotateShape();
    threeScene.render();
}
animate();
