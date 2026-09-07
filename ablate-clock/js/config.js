import { ROT90, ROT30, ROT6 } from "./consts.js";
import { deg2rad } from "./functions.js";

export default class Config {
    constructor(three, wnd) {
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
                bendMin: 0.5, bendMax: 0.25,
                initialAngle: (this.now.getSeconds() / 60) * ROT90
            },
            minuteHand: {
                segments: 40, length: 5,
                width: 0.06, angle: 0,
                speed:  ROT6 / 60, direction: -1,
                bendMin: 4, bendMax: 8,
                initialAngle: (
                    ROT90 - ( this.now.getMinutes() + this.now.getSeconds() / 60 ) * ROT6
                )
            },
            hourHand: {
                segments: 40, length: 3,
                width: 0.06, angle: 0,
                speed: ROT30 / 3600, direction: -1,
                bendMin: 40, bendMax: 80,
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
        this.markers = {
            twelve: { 
                rotation: new three.Euler(0, deg2rad(90), deg2rad(90)),
                position: new three.Vector3(0, 0, -1)
            },
            three: { 
                rotation: new three.Euler(0, 0, 0),
                position: new three.Vector3(0, 0, -1)
            },
            two: { 
                rotation: new three.Euler(0, deg2rad(0), deg2rad(30)),
                position: new three.Vector3(0, 0, -1)
            },
            one: { 
                rotation: new three.Euler(0, deg2rad(0), deg2rad(60)),
                position: new three.Vector3(0, 0, -1)
            },
            eleven: { 
                rotation: new three.Euler(0, deg2rad(0), deg2rad(120)),
                position: new three.Vector3(0, 0, -1)
            },
            ten: { 
                rotation: new three.Euler(0, deg2rad(0), deg2rad(150)),
                position: new three.Vector3(0, 0, -1)
            }
        };
    }
}
