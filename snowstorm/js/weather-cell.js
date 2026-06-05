export default class WeatherCell {
    constructor(cfg) {
        this.cfg = cfg;
        this.x = 0;
        this.y = 0;
        this.strength = 0;
        this.maxStrength = 0;
        this.driftSpeed = 0; 
        this.lifetime = 0; 
        this.age = 0;
        this.active = false;
        this.noForce = { x: 0, y: 0 };
    }
    calcStrengthFromAge() {
        const t = this.age / this.lifetime;
        if (t >= 1) return 0;
        return this.maxStrength * Math.sin(Math.PI * t);
    }
    update() {
        this.age++;
        if (this.age > this.lifetime)
            this.active = false;
        if (false === this.active) return;
        this.x += this.driftSpeed;
        this.strength = this.calcStrengthFromAge();
    }
    baseReset() {
        this.strength = 0;
        this.age = 0;
        this.active = true;
    }
    getForce(f1, f2) {
        const t = f1 / f2;
        return (1 - t) * this.strength;
    }
    reset() {
        console.error("WeatherCell.reset() must be overridden in child classes.");
    }
    sample(px, py) {
        console.error("WeatherCell.sample(px, py) must be overridden in child classes.");
    }
}
