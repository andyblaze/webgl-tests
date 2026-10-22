import ThreeObj from "./three-obj.js";

export default class ThreeGroup extends ThreeObj {
    constructor(three) {
        super();
        this.threeObj = new three.Group();
    }
    add(item) {
        this.threeObj.add(item.native);
        return this;
    }
}
