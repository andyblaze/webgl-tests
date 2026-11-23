
import * as THREE from 'three';
import Flash from './Flash.js';

export default class FlashEngine {
    constructor(scene, paletteManager, { count = 20 } = {}) {
        this.scene = scene;
        this.paletteManager = paletteManager;

        this.group = new THREE.Group();
        this.scene.add(this.group);

        this.geometry = new THREE.SphereGeometry(0.035, 36, 36);

        this.flashes = [];

        for (let i = 0; i < count; i++) {
            const flash = new Flash(
                i,
                this.geometry,
                this.paletteManager
            );

            this.flashes.push(flash);
            this.group.add(flash.mesh);
        }
    }

    update(dt) {
        for (const flash of this.flashes) {
            flash.update(dt);
        }
    }

    dispose() {
        for (const flash of this.flashes) {
            flash.dispose();
        }

        this.geometry.dispose();
        this.scene.remove(this.group);
        this.flashes = [];
    }
}
