export default class InputManager {
    constructor() {
        this.left = false;
        this.right = false;

        window.addEventListener("keydown", (event) => this.onKeyDown(event));
        window.addEventListener("keyup", (event) => this.onKeyUp(event));
    }
    onKeyDown(event) {
        switch(event.code) {
            case "ArrowLeft":
                this.left = true;
                break;

            case "ArrowRight":
                this.right = true;
                break;
        }
    }
    onKeyUp(event) {
        switch(event.code) {
            case "ArrowLeft":
                this.left = false;
                break;

            case "ArrowRight":
                this.right = false;
                break;
        }
    }
}
