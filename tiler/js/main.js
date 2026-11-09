
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
import TileType from "./tiletype.js";

const tileType = new TileType("tileType");
tileType.onchange((event) => tileType.change(event));

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

sendButton.setUploader(new Uploader(srcFile, endPoint, status, tileType));
sendButton.setDownloader(new Downloader([destCanvas, status]));

sendButton.onclick((event) => sendButton.clicked(event));

const threeScene = new ThreeScene(THREE, "three-wrap");

destCanvas.ondraw = function() {
    threeScene.setTexture(THREE, destCanvas.canvas);
};


// Animation
function animate() {
    requestAnimationFrame(animate);
    threeScene.rotateShape();
    threeScene.render();
}

animate();

// Handle resizing
/*const resizeObserver = new ResizeObserver(() => {
    const width = wrap.clientWidth;
    const height = wrap.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
});

resizeObserver.observe(wrap);*/

