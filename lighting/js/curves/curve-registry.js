import CowHorn from "./cowhorn.js";
import Snake from "./snake.js";
import Bezier from "./bezier.js";
import Bend45 from "./bend45.js";
import Helix from "./helix.js";

export default class CurveRegistry {
    static data = {
        cowHorn: {
            ctor: CowHorn
        },
        snake: {
            ctor: Snake
        },
        bezier: {
            ctor: Bezier
        },
        bend45: {
            ctor: Bend45
        },
        helix: {
            ctor: Helix
        }
    }
    static get(idx, three) {
        const def = CurveRegistry.data[idx];
        return new def.ctor(three);
    }
}
