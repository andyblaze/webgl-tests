import CowHorn from "./cowhorn.js";
import Snake from "./snake.js";
import Bezier from "./bezier.js";
import BendBy from "./bendby.js";
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
        bendBy: {
            ctor: BendBy
        },
        helix: {
            ctor: Helix
        }
    }
    static get(three, idx, params={}) {
        const def = CurveRegistry.data[idx];
        return new def.ctor(three, params);
    }
}
