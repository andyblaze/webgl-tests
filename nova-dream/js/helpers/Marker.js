import * as THREE from 'three';
import { markerShader } from '../shaders/marker.js';

export default class Marker {
    static create(paletteManager) {
        const color = paletteManager.getSystemColors('marker')[0];
        const geometry = new THREE.SphereGeometry(0.055, 16, 16);

        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uMarkerColor: { value: color.clone() }
            },
            vertexShader: markerShader.vertex,
            fragmentShader: markerShader.fragment,
            toneMapped: false
        });

        return new THREE.Mesh(
            geometry,
            material
        );
    }
    static updatePalette(marker, paletteManager) {
        const color = paletteManager.getSystemColors('marker')[0];
        marker.material.uniforms.uMarkerColor.value.copy(color);
    }
} 
