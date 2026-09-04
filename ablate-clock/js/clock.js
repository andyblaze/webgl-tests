export default class Clock {
    constructor() {
        this.hands = {};
    }
    update(dt) {
        for ( const [name, hand] of Object.entries(this.hands) )
            hand.update(dt);
    }
    add(h) {
        this.hands[h.name] = h;
        return this;
    }
}
