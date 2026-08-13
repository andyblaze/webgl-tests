import { byId, ucFirst } from "./functions.js";

export default class Associations {
    constructor(registry) {
        this.geometriess = [];
        for ( const key of Object.keys(registry.geometries) )
            this.geometriess.push({ label: ucFirst(key), value: key });
        
        this.material = [
            {
                label: "Basic"
            },
            {
                label: "Physical"
            },
            {
                label: "Phong"
            }
        ];
        this.normalMaps = [
            { label: "spots", img: "./textures/spots-normal.png" },
            { label: "pave", img: "./textures/pave-normal.png" },
            { label: "stone", img: "./textures/stone-normal.png" },
            { label: "brush", img: "./textures/brush-normal.png" },
            { label: "cloud", img: "./textures/cloud-normal.png" },
            { label: "marble", img: "./textures/marble-normal.png" },
            { label: "speck", img: "./textures/speck-normal.png" }
        ];
        this.roughnessMaps = [
            { label: "spots", img: "./textures/spots.png" },
            { label: "pave", img: "./textures/pave.png" },
            { label: "stone", img: "./textures/stone.png" },
            { label: "brush", img: "./textures/brush.png" },
            { label: "cloud", img: "./textures/cloud.png" },
            { label: "marble", img: "./textures/marble.png" },
            { label: "speck", img: "./textures/speck.png" }
        ];
    }
    groupLength(group) {
        return this[group].length;
    }
    get(group, index) { 
        return this[group][index];
    }
    update(ctrl) {
        if ( !ctrl.dataset.assoc ) return;
        ctrl.max = this.groupLength(ctrl.dataset.assoc) - 1;
        const item = this.get(ctrl.dataset.assoc, Number(ctrl.value));
        if ( ctrl.dataset.value )
            ctrl.dataset.value = item.value;
        byId(ctrl.dataset.lbl).textContent = item.label;
        if ( ctrl.dataset.img ) {
            byId(ctrl.dataset.img).src = item.img;
            ctrl.dataset.mapsrc = item.img;
        }
    }
}
