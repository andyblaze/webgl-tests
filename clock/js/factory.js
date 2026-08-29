import GearShaft from "./gear-shaft.js";
import Bush from "./bush.js";
import Hand from "./hand.js";
import GearWheel from "./gearwheel.js";

export default class Factory {
    constructor(three) {
        this.three = three;
    }
    shaft(name, cfg) {
        return new GearShaft(this.three, name, cfg);
    }
    bush(name, cfg) {
        return new Bush(this.three, name, cfg);
    }
    hand(name, cfg) {
        return new Hand(this.three, name, cfg);
    }
    gear(name, cfg, decorator) {
        return new GearWheel(this.three, name, cfg, decorator);
    }
}
