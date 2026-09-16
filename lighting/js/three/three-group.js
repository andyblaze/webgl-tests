import ThreeObj from "./three-obj.js";

export default class ThreeGroup extends ThreeObj {
    constructor(three, cfg) {
        super();
        this.threeObj = new three.Group();
    }
    add(item) {
        this.threeObj.add(item);
    }
}
