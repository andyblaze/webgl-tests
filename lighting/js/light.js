import ThreeObj from "./three-obj.js";

export default class Light extends ThreeObj {
    constructor(factory, type, cfg) {
        super();
        this.threeObj = factory.create(type, cfg);
    }
}
