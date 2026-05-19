export default class SceneChanger {
    constructor(scene, scenes, program, vertShader, renderer) {
        this.scene = scene;
        this.scenes = scenes;
        this.program = program;
        this.vertShader = vertShader;
        this.renderer = renderer;
    }
    update() {
        this.scene = this.scenes.next();
        this.program.make("feedback", this.scene.shader, this.vertShader);
        this.renderer.stop();
        this.renderer.setFeedbackProgram(this.program.feedback);
        this.renderer.setConfig(this.scene.config);
        this.renderer.start();
    }
}
