export default class EffectBase {
    constructor() {
        this.active = false;
    }
    stop() {
        this.active = false;
        return this;
    }
    inactive() {
        return (false === this.active);
    }
    init() {
        this.active = true;
        return this;        
    }
}
