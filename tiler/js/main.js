
import FileInput from "./fileinput.js";
import EndPoint from "./endpoint.js";
import SendButton from "./sendbutton.js";
import Status from "./status.js";
import Canvas from "./canvas.js";
import SourceFile from "./srcfile.js";
import FileLoader from "./file-loader.js";
import Uploader from "./uploader.js";
import Downloader from "./downloader.js";

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

sendButton.setUploader(new Uploader(srcFile, endPoint, status));
sendButton.setDownloader(new Downloader([destCanvas, status]));

sendButton.onclick((event) => sendButton.clicked(event));
