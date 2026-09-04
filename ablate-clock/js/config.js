import { ROT90, ROT30, ROT6 } from "./consts.js";

export default class Config {
    constructor(wnd) {
        this.innerW = wnd.innerWidth;
        this.innerH = wnd.innerHeight;
        this.aspect = wnd.innerWidth / wnd.innerHeight;
        this.dpr = wnd.devicePixelRatio;
        this.now = new Date();
        this.hands = {
            secondHand: {
                segments: 40, length: 5,
                width: 0.06, angle: 0,
                speed:  ROT6, direction: -1,
                initialAngle: (this.now.getSeconds() / 60) * ROT90
            },
            minuteHand: {
                segments: 40, length: 5,
                width: 0.06, angle: 0,
                speed:  ROT6 / 60, direction: -1,
                initialAngle: (
                    ROT90 - ( this.now.getMinutes() + this.now.getSeconds() / 60 ) * ROT6
                )
            },
            hourHand: {
                segments: 40, length: 3,
                width: 0.06, angle: 0,
                speed: ROT30 / 3600, direction: -1,
                initialAngle: (
                    ROT90 -
                    (
                        (this.now.getHours() % 12) +
                        this.now.getMinutes() / 60 +
                        this.now.getSeconds() / 3600
                    ) * ROT30
                )
            }
        }
    }
}
